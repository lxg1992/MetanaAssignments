// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers, upgrades } = require("hardhat");

async function main() {
  const UpgToken = await ethers.getContractFactory("UpgToken");

  const token = await upgrades.deployProxy(UpgToken, [1000000], {
    initializer: "initialize",
    kind: "uups",
  });

  ///https://goerli.etherscan.io/address/0x4e120cb99357402e175fa3978f68b5d1c25cecaf#code - proxy
  ///https://goerli.etherscan.io/address/0x7787f33bffffe10c289eaf112698f94c806044ce#code - token
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
