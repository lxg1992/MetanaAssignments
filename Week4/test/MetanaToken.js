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

  // Convenience functions
  const presetConfig = () => metanaToken.setSpecialAccess(forger.address, true);
  const forgerWithMinter = (role) => forger.connect(role);
  const ff = (s = 60) => time.increase(s); //fast forward 60 seconds by default
  const bytes = (data = "") => ethers.utils.formatBytes32String(data);

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

    it("Forces user to wait between transactions", async () => {
      await forger.forge(0, 1);
      await expect(forger.forge(1, 1)).to.be.revertedWith(
        /Need to wait at least a minute/
      );
    });
    it("Fails to mint improved tokens if no prerequisites", async () => {
      await expect(forger.forge(3, 1)).to.be.revertedWith(/of id 0/);
    });
    it("Fails to mint advanced token if no prerequisites", async () => {
      await expect(forger.forge(6, 1)).to.be.revertedWith(/of id 0/);
    });
    it("Fails to mint nonexistent token", async () => {
      await expect(forger.forge(7, 5)).to.be.revertedWith("No such token");
    });
    it("Forges 10 basic tokens", async () => {
      await forger.forge(0, 10);
      expect(await metanaToken.balanceOf(nonOwner1.address, 0)).to.equal(10);
    });
    it("Forges 10 token of each type", async () => {
      await forger.forge(0, 10);
      await ff();
      await forger.forge(1, 10);
      await ff();
      await forger.forge(2, 10);
      expect(await metanaToken.balanceOf(nonOwner1.address, 0)).to.equal(10);
      expect(await metanaToken.balanceOf(nonOwner1.address, 1)).to.equal(10);
      expect(await metanaToken.balanceOf(nonOwner1.address, 2)).to.equal(10);
    });
    it("Fails minting token 3", async () => {
      await forger.forge(0, 10);
      await ff();
      await expect(forger.forge(3, 1)).to.be.revertedWith(/of id 1/);
    });

    it("Fails minting token 4", async () => {
      await forger.forge(1, 10);
      await ff();
      await expect(forger.forge(4, 1)).to.be.revertedWith(/of id 2/);
    });
    it("Fails minting token 4", async () => {
      await expect(forger.forge(4, 1)).to.be.revertedWith(/of id 1/);
    });
    it("Fails minting token 6 cause missing token 1s", async () => {
      await forger.forge(0, 10);
      await ff();
      await expect(forger.forge(6, 1)).to.be.revertedWith(/of id 1/);
    });
    it("Fails minting token 6 cause missing token 2s", async () => {
      await forger.forge(0, 10);
      await ff();
      await forger.forge(1, 10);
      await ff();
      await expect(forger.forge(6, 1)).to.be.revertedWith(/of id 2/);
    });
    it("Forges 3 tokens of improved type", async () => {
      await forger.forge(0, 10);
      await ff();
      await forger.forge(1, 10);
      await ff();
      await forger.forge(2, 10);
      await ff();

      await forger.forge(3, 3);
      await ff();
      await forger.forge(4, 3);
      await ff();
      await forger.forge(5, 3);
      expect(await metanaToken.balanceOf(nonOwner1.address, 3)).to.equal(3);
      expect(await metanaToken.balanceOf(nonOwner1.address, 4)).to.equal(3);
      expect(await metanaToken.balanceOf(nonOwner1.address, 5)).to.equal(3);
    });

    it("Forges 10 tokens of advanced type", async () => {
      await forger.forge(0, 8);
      await ff();
      await forger.forge(1, 8);
      await ff();
      await forger.forge(2, 8);
      await ff();

      await forger.forge(6, 8);
      expect(await metanaToken.balanceOf(nonOwner1.address, 6)).to.equal(8);
    });

    it("Fails to trade for an inaccessible token", async () => {
      await expect(forger.tradeFrom(0, 3, 5)).to.be.revertedWith(
        /Cannot trade/
      );
    });

    it("Fails to trade from tokens which don't have enough supply", async () => {
      await forger.forge(0, 5);

      await expect(forger.tradeFrom(0, 1, 6)).to.be.revertedWith(
        /ERC1155: burn amount/
      );
    });

    it("Succeeds in trading tokens", async () => {
      await forger.forge(0, 10);
      await forger.tradeFrom(0, 1, 6);
      expect(await forger.getTokenBalance(nonOwner1.address, 0)).to.equal(4);
      expect(await forger.getTokenBalance(nonOwner1.address, 1)).to.equal(6);
    });

    it("Fails to mint if no special access", async () => {
      // await disablePresetConfig();
      await expect(
        metanaToken.connect(nonOwner1).mint(nonOwner1.address, 0, 1, bytes())
      ).to.be.revertedWith(/not special privileges/);
    });

    it("Fails to burn if no special access", async () => {
      // await disablePresetConfig();
      await expect(
        metanaToken.connect(nonOwner1).burn(nonOwner1.address, 0, 1)
      ).to.be.revertedWith(/not special privileges/);
    });

    it("Fails to burn batch if no special access", async () => {
      // await disablePresetConfig();
      await expect(
        metanaToken
          .connect(nonOwner1)
          .burnBatch(nonOwner1.address, [0, 1], [2, 2])
      ).to.be.revertedWith(/not special privileges/);
    });
  });
});
