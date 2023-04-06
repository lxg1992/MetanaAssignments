// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers, upgrades } = require("hardhat");

async function main() {
  // const token = {
  //   address: "0xf8f4b52ab9f21C85F44C824c2B56Aa852cf8C270",
  //   implementation: "0x5D63605ee274Ae4806f2D50F520A013783f0Fdc1",
  // };
  // const nft = {
  //   address: "0xD5686181438b9De73feF74a134449912ce86FF74",
  //   implementation: "0x7FF0F7F59Ad62c00b8f2C87F07828871F52121A1",
  // };
  // const staking = {
  //   address: "0x92F198A7F21c5E2DE3af1f09B5520F90EEF6e967",
  //   implementation: "0xC3823870eCa77c769a8602079f34d3D17296AC07",
  // };
  const NFTContract = await ethers.getContractFactory("NFTContractUpg");
  const TokenContract = await ethers.getContractFactory("TokenContractUpg");
  const StakingContract = await ethers.getContractFactory("StakingContractUpg");

  const nft = await upgrades.deployProxy(NFTContract, {
    initializer: "initialize",
    kind: "uups",
  });
  console.log({ nftAddress: nft.address });

  const token = await upgrades.deployProxy(TokenContract, {
    initializer: "initialize",
    kind: "uups",
  });
  console.log({ tokenAddress: token.address });

  const staking = await upgrades.deployProxy(
    StakingContract,
    [token.address, nft.address],
    {
      initializer: "initialize",
      kind: "uups",
    }
  );
  console.log({ staking: staking.address });

  // const token = await upgrades.deployProxy(UpgToken, [1000000], {
  //   initializer: "initialize",
  //   kind: "uups",
  // });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
