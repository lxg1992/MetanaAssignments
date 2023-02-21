const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const { BigNumber } = ethers;

const hex =
  "0xdb81b4d58595fbbbb592d3661a34cdca14d7ab379441400cbfa1b78bc447c365";

describe("Tests", function () {
  const container = (start = 0) => {
    let count = start;

    return (msg = undefined) => {
      console.log({ count: `${count}-${msg}` });
      count++;
    };
  };

  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  // async function deployOneYearLockFixture() {
  //   const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  //   const ONE_GWEI = 1_000_000_000;

  //   const lockedAmount = ONE_GWEI;
  //   const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

  //   // Contracts are deployed using the first signer/account by default
  //   const [owner, otherAccount] = await ethers.getSigners();

  //   const Lock = await ethers.getContractFactory("Lock");
  //   const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

  //   return { lock, unlockTime, lockedAmount, owner, otherAccount };
  // }

  // const oneEth = BigNumber.from("1_000_000_000_000_000_000");
  // const twoEth = BigNumber.from("2_000_000_000_000_000_000");

  describe("GuessNumber", function () {
    it("Should guess number to be 42", async function () {
      // const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);
      const GTN = await ethers.getContractFactory("GuessTheNumberChallenge");
      const gtn = await GTN.deploy({
        value: ethers.utils.parseEther("1"),
      });
      await gtn.deployed();

      await gtn.guess(42, { value: ethers.utils.parseEther("1") });
      expect(await gtn.isComplete()).to.equal(true);
    });
  });

  describe("GuessSecretNumber", function () {
    it("Should guess the secret number", async function () {
      const GTSN = await ethers.getContractFactory(
        "GuessTheSecretNumberChallenge"
      );
      const gtsn = await GTSN.deploy({
        value: ethers.utils.parseEther("1"),
      });
      await gtsn.deployed();
      let n = 0;
      let trigger = true;

      while (trigger) {
        n++;
        const hash = ethers.utils.keccak256(n);
        if (hash === hex) {
          trigger = false;
        }
      }
      console.log({ n });

      await gtsn.guess(n, { value: ethers.utils.parseEther("1") });
      expect(await gtsn.isComplete()).to.equal(true);
    });
  });

  describe("GuessRandomNumber", function () {
    it("Should get the number at storage 0", async function () {
      // const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);
      const GTRN = await ethers.getContractFactory(
        "GuessTheRandomNumberChallenge"
      );
      const gtrn = await GTRN.deploy({
        value: ethers.utils.parseEther("1"),
      });
      await gtrn.deployed();
      const n = BigNumber.from(
        await ethers.provider.getStorageAt(gtrn.address, 0)
      );
      console.log({ n });
      await gtrn.guess(n, { value: ethers.utils.parseEther("1") });
      expect(await gtrn.isComplete()).to.equal(true);
    });
  });

  describe("GuessNewNumber", () => {
    const counter = container();

    it.only("Guesses the newly generated number", async () => {
      const GTNN = await ethers.getContractFactory(
        "GuessTheNewNumberChallenge"
      );
      const ATTACK = await ethers.getContractFactory("GTNNAttack");
      const gtnn = await GTNN.deploy({
        value: ethers.utils.parseEther("1"),
      });
      counter(`${gtnn.address}`);

      const attack = await ATTACK.deploy(gtnn.address);
      counter("attack");

      await attack.hack({
        value: ethers.utils.parseEther("1"),
        gasLimit: 50000,
      });
      counter("hack");

      expect(await gtnn.isComplete()).to.equal(true);
    });
  });
});
