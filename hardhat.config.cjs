require('dotenv').config({ path: '.env.local' });
require('@nomicfoundation/hardhat-toolbox');

/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  solidity: '0.8.20',
  paths: {
    sources: './contracts',
    artifacts: './artifacts',
    cache: './cache',
  },
  networks: {
    bsctestnet: {
      url:
        process.env.BSC_TESTNET_RPC_URL ||
        'https://bsc-testnet.blockpi.network/v1/rpc/public',
      chainId: 97,
      accounts: process.env.RELAYER_PRIVATE_KEY
        ? [process.env.RELAYER_PRIVATE_KEY]
        : [],
    },
  },
};

module.exports = config;
