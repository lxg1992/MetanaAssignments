require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const { INFURA_RPC, PRIVATE_KEY, ES_API_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  defaultNetwork: "hardhat",
  etherscan: {
    apiKey: ES_API_KEY
  },
  networks: {
    goerli: {
      url: INFURA_RPC,
      accounts: [PRIVATE_KEY],
      chainId: 5,
    }
  }
};
