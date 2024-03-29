require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.4",
      },
      {
        version: "0.7.0",
      },
      {
        version: "0.6.12",
      },
      {
        version: "0.5.16",
      },
      {
        version: "0.4.24",
      },
      {
        version: "0.8.0",
      },
    ],
  },
};
