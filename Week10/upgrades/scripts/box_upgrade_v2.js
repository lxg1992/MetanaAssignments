// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers, upgrades } = require("hardhat");

const PROXY = "0x6716734196D5b2c9917B397F5CdcBCa38A6B6d4D";

async function main() {
  const BoxV2 = await ethers.getContractFactory("BoxV2");

  const box = await upgrades.upgradeProxy(PROXY, BoxV2);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
