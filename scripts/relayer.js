require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');
const hre = require('hardhat');

const contractArtifact = require('../artifacts/contracts/AgentPredictionMarket.sol/AgentPredictionMarket.json');

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const contractAddress = process.env.CONTRACT_ADDRESS || '';
const rawScale = process.env.ONCHAIN_STAKE_SCALE || '';
const onchainStakeScale = rawScale && Number(rawScale) > 0 ? Number(rawScale) : 1;

if (!supabaseUrl || !supabaseServiceKey || !contractAddress) {
  console.error('Missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or CONTRACT_ADDRESS');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function ensureMarketOnchain(contract, market) {
  if (market.onchain_market_id != null) {
    return market.onchain_market_id;
  }

  const nextId = await contract.nextMarketId();
  const endTimeSeconds = Math.floor(new Date(market.end_time).getTime() / 1000);
  const tx = await contract.addMarket(market.question, endTimeSeconds);
  const receipt = await tx.wait();

  const onchainId = Number(nextId.toString());

  await supabase
    .from('markets')
    .update({ onchain_market_id: onchainId })
    .eq('id', market.id);

  return { id: onchainId, txHash: receipt.hash };
}

async function ensureAgentRegistered(contract, publicAddress) {
  const isAlready = await contract.isAgent(publicAddress);
  if (isAlready) {
    return;
  }
  const tx = await contract.registerAgent(publicAddress);
  await tx.wait();
}

function toWeiAmount(stake) {
  const stakeNumber = typeof stake === 'number' ? stake : Number(stake || 0);
  if (!Number.isFinite(stakeNumber) || stakeNumber <= 0) {
    return null;
  }
  const scaled = stakeNumber * onchainStakeScale;
  const wei = Math.floor(scaled * 1e18);
  if (!Number.isFinite(wei) || wei <= 0) {
    return null;
  }
  return BigInt(wei);
}

async function syncOnce(contract) {
  const { data: marketsToMirror, error: marketsError } = await supabase
    .from('markets')
    .select('id, question, end_time, status, onchain_market_id')
    .is('onchain_market_id', null)
    .in('status', ['open', 'resolved']);

  if (!marketsError && marketsToMirror && marketsToMirror.length > 0) {
    for (const m of marketsToMirror) {
      try {
        await ensureMarketOnchain(contract, m);
      } catch (err) {
        console.error('Failed to mirror market onchain', m.id, err);
      }
    }
  }

  const { data: trades, error: tradesError } = await supabase
    .from('trades')
    .select('id, agent_id, market_id, side, stake, tx_hash')
    .is('tx_hash', null)
    .order('created_at', { ascending: true })
    .limit(50);

  if (tradesError) {
    console.error('Failed to fetch trades', tradesError);
    return;
  }

  if (!trades || trades.length === 0) {
    return;
  }

  for (const t of trades) {
    try {
      const { data: market } = await supabase
        .from('markets')
        .select('id, onchain_market_id, status, end_time')
        .eq('id', t.market_id)
        .maybeSingle();

      if (!market || market.status !== 'open') {
        continue;
      }

      const { data: agent } = await supabase
        .from('agents')
        .select('public_address')
        .eq('id', t.agent_id)
        .maybeSingle();

      if (!agent || !agent.public_address) {
        continue;
      }

      const onchainInfo = await ensureMarketOnchain(contract, market);
      const onchainMarketId =
        typeof onchainInfo === 'number' ? onchainInfo : onchainInfo.id;

      await ensureAgentRegistered(contract, agent.public_address);

      const sideValue = t.side === 'yes' ? 1 : 2;
      const onchainStake = toWeiAmount(t.stake);

      if (!onchainStake) {
        continue;
      }

      const tx = await contract.trade(
        onchainMarketId,
        agent.public_address,
        sideValue,
        onchainStake,
      );

      const receipt = await tx.wait();

      await supabase
        .from('trades')
        .update({ tx_hash: receipt.hash })
        .eq('id', t.id);
    } catch (err) {
      console.error('Failed to mirror trade onchain', t.id, err);
    }
  }
}

async function main() {
  const [signer] = await hre.ethers.getSigners();
  const contract = new hre.ethers.Contract(
    contractAddress,
    contractArtifact.abi,
    signer,
  );

  for (;;) {
    try {
      await syncOnce(contract);
    } catch (err) {
      console.error('Relayer loop error', err);
    }
    await sleep(5000);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

