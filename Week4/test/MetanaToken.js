const {
  time,
  loadFixture,
  setBalance,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const chai = require("chai");
const BN = require("bn.js");
const { ethers } = require("hardhat");
chai.use(require("chai-bn")(BN));

const { expect } = chai;

describe("MetanaToken", function () {
  let metanaToken;
  let forger;
  let owner;
  let nonOwner1;
  let nonOwner2;
  let nonOwner3;

  const presetConfig = () => metanaToken.setSpecialAccess(forger.address, true);
  const forgerWithMinter = (role) => forger.connect(role);
  const ff = (s = 60) => time.increase(s); //fast forward 60 seconds by default
  beforeEach(async () => {
    [owner, nonOwner1, nonOwner2, nonOwner3] = await ethers.getSigners();
    const TokenFactory = await ethers.getContractFactory("MetanaMultiToken");
    const ForgerFactory = await ethers.getContractFactory("Forger");
    metanaToken = await TokenFactory.deploy();
    await metanaToken.deployed();
    forger = await ForgerFactory.deploy(metanaToken.address);
    await forger.deployed();
  });

  describe("Deployment", function () {
    it("Should give Forger special access", async () => {
      await presetConfig();
      expect(await metanaToken.getSpecialAccess(forger.address)).to.be.true;
    });

    it("Should fail to grant special access by a non-owner", async () => {
      await expect(
        metanaToken.connect(nonOwner1).setSpecialAccess(forger.address, true)
      ).to.be.revertedWith(/Ownable:/);
    });
  });

  describe("Forging", () => {
    beforeEach(async () => {
      presetConfig();
      forger = await forgerWithMinter(nonOwner1);
    });
    it("Forges 10 basic tokens", async () => {
      await forger.forge(0, 10);
      expect(await metanaToken.balanceOf(nonOwner1.address, 0)).to.equal(10);
    });
    it("Forces user to wait between transactions", async () => {
      await forger.forge(0, 1);
      await expect(forger.forge(1, 1)).to.be.revertedWith(
        /Need to wait at least a minute/
      );
    });
  });
});
