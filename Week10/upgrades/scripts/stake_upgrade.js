// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers, upgrades } = require("hardhat");

//VERIFY https://goerli.etherscan.io/address/0x5d63605ee274ae4806f2d50f520a013783f0fdc1#code

async function main() {
  const token = {
    proxy: "0xf8f4b52ab9f21C85F44C824c2B56Aa852cf8C270",
    implementation: "0x5D63605ee274Ae4806f2D50F520A013783f0Fdc1",
  };
  const nft = {
    proxy: "0xD5686181438b9De73feF74a134449912ce86FF74",
    implementation: "0x7FF0F7F59Ad62c00b8f2C87F07828871F52121A1",
  };
  const staking = {
    proxy: "0x92F198A7F21c5E2DE3af1f09B5520F90EEF6e967",
    implementation: "0xC3823870eCa77c769a8602079f34d3D17296AC07",
  };
  const NFTContractV2 = await ethers.getContractFactory("NFTContractUpgV2");
  const TokenContractV2 = await ethers.getContractFactory("TokenContractUpgV2");
  const StakingContractV2 = await ethers.getContractFactory(
    "StakingContractUpgV2"
  );

  // const nftV2 = await upgrades.upgradeProxy(nft.proxy, NFTContractV2);
  // const tokenV2 = await upgrades.upgradeProxy(token.proxy, TokenContractV2);
  const stakingV2 = await upgrades.upgradeProxy(
    staking.proxy,
    StakingContractV2
  );
  // console.log({ nftV2Address: nftV2.address });
  // console.log({ tokenV2Address: tokenV2.address });
  console.log({ stakingV2Address: stakingV2.address });

  const data = {
    tokenV2Proxy: "0xf8f4b52ab9f21C85F44C824c2B56Aa852cf8C270",
    tokenV2Impl: "0x5D63605ee274Ae4806f2D50F520A013783f0Fdc1",
    nftV2Proxy: "0xD5686181438b9De73feF74a134449912ce86FF74",
    nftV2Impl: "0x7FF33933ed82C6aaD43695A0B257F11ABd4F598E",
    stakingV2Proxy: "0x92F198A7F21c5E2DE3af1f09B5520F90EEF6e967",
    stakingV2Impl: "0xC3823870eCa77c769a8602079f34d3D17296AC07",
  };
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
