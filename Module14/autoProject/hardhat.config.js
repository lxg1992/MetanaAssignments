require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.10",
  networks: {
    local: {
      url: "http://localhost:8545",
    },
    goerli: {
      url: "https://goerli.infura.io/v3/3f603564d9e44bcd91f5d08319d99942",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
