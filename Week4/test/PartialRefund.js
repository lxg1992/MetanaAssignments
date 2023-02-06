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

xdescribe("PartialRefund", function () {
  let partialRefund;
  let owner;
  let nonOwner1;
  let nonOwner2;
  const saleClosingFn = () =>
    partialRefund.buy({ value: ethers.utils.parseEther("1000") });
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  beforeEach(async () => {
    [owner, nonOwner1, nonOwner2] = await ethers.getSigners();
    const PartialRefund = await ethers.getContractFactory("PartialRefund");
    partialRefund = await PartialRefund.deploy(owner.address);
    await partialRefund.deployed();
  });

  describe("Deployment", function () {
    it("Should have 18 decimal points", async () => {
      expect(await partialRefund.decimals()).to.be.equal(18);
    });

    it("Should have sale open", async () => {
      expect(await partialRefund.saleIsClosed()).to.be.false;
    });
  });

  describe("Transactions", function () {
    describe("Sale open", () => {
      it("Should mint 1000 tokens with 1 ether", async () => {
        await partialRefund.buy({ value: ethers.utils.parseEther("1") });
        const balance = await partialRefund.balanceOf(owner.address);
        expect(ethers.utils.formatUnits(balance, 18)).to.equal("1000.0");
      });

      it("Should fail to mint more than 1_000_000 tokens", async () => {
        await expect(
          partialRefund.buy({ value: ethers.utils.parseEther("1000.1") })
        ).to.be.revertedWith("Supply will exceed maximum");
      });
    });

    describe("Sale closed", () => {
      it("Should close the sale once 1_000_000 tokens are bought", async () => {
        // await partialRefund.buy({ value: ethers.utils.parseEther("1000") });
        await saleClosingFn();
        expect(await partialRefund.saleIsClosed()).to.be.true;
      });

      it("Should fail to buy tokens from contract with no balance", async () => {
        await saleClosingFn();
        // await expect (partialRefund.buy({ value: ethers.utils.parseEther("1000") }); // Closes the sale
        await expect(
          partialRefund.buy({ value: ethers.utils.parseEther("0.01") })
        ).to.be.revertedWith(
          "Contract has less tokens available than required"
        );
      });

      it("Should buy tokens from contract balance", async () => {
        await saleClosingFn();
        await partialRefund.sellBack(1_000_000);
        await partialRefund.buy({ value: ethers.utils.parseEther("0.5") });

        expect(await partialRefund.balanceOf(partialRefund.address)).to.equal(
          ethers.utils.parseEther("999500")
        );
      });

      it("Should fail to sell back more tokens than held", async () => {
        await saleClosingFn();
        await expect(partialRefund.sellBack(1_000_001)).to.be.revertedWith(
          "Not enough tokens in balance"
        );
      });
    });

    describe("Withdraw", () => {
      it("Ethereum: Should fail if unauthorized", async () => {
        await expect(
          partialRefund.connect(nonOwner1).withdrawEthereum(nonOwner1.address)
        ).to.be.revertedWith("Only special address can modify data");
      });

      it("Token: Should fail if unauthorized", async () => {
        await expect(
          partialRefund
            .connect(nonOwner1)
            .withdrawTokenToExternalAddress(nonOwner1.address)
        ).to.be.revertedWith("Only special address can modify data");
      });

      it("Should withdraw ethereum", async () => {
        await saleClosingFn();
        const beforeBalance = await ethers.provider.getBalance(
          partialRefund.address
        );
        await expect(
          await partialRefund.withdrawEthereum(owner.address)
        ).to.changeEtherBalance(owner.address, beforeBalance);
      });

      it("Should withdraw tokens", async () => {
        await saleClosingFn();
        await partialRefund.sellBack(8000);

        await partialRefund.withdrawTokenToExternalAddress(nonOwner1.address);

        expect(await partialRefund.balanceOf(owner.address)).to.equal(
          ethers.utils.parseEther("992000")
        );

        expect(await partialRefund.balanceOf(nonOwner1.address)).to.equal(
          ethers.utils.parseEther("8000")
        );
      });
    });

    describe("Sell back", () => {
      it("Should trigger 'Not enough tokens' error", async () => {
        await saleClosingFn();
        await partialRefund.sellBack(1000000);
        partialRefund.connect(nonOwner1);
        //Closes contract and gives 1_000_000 tokens on balance
      });
      it("Should trigger 'Not enough ether in contract'", async () => {
        await saleClosingFn();
        await setBalance(partialRefund.address, 0);
        await expect(partialRefund.sellBack(1)).to.be.revertedWith(
          "Not enough ether in contract"
        );
      });
    });
  });
});
