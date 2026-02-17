const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log('Deploying AgentPredictionMarket with account:', await deployer.getAddress());

  const AgentPredictionMarket = await hre.ethers.getContractFactory('AgentPredictionMarket');

  const initialRelayer = await deployer.getAddress();
  console.log('Using relayer address (constructor param):', initialRelayer);

  const contract = await AgentPredictionMarket.deploy(initialRelayer);
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log('AgentPredictionMarket deployed to:', address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
