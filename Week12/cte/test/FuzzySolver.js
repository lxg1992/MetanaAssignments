const eth = require("ethereumjs-util");
const { expect } = require("chai");
const {
  bytecode,
} = require("../artifacts/contracts/FuzzyIdentity.sol/FuzzySolver.json");
// const { ethers } = require("ethers");
const loggerFactory = () => {
  let i = 0; // 6500000
  return () => console.log(i++);
};

describe("FuzzyIdentity", function () {
  const logger = loggerFactory();

  xit("should return the correct hash", async () => {
    // const [owner] = await ethers.getSigners(); //local
    // const owner = { address: "0x5BD00AB64cA841f01BEDee69d431be70169Cf744" }; // goerli
    let hashedBytecode = eth
      .bufferToHex(eth.keccak256(Buffer.from(bytecode, "hex")))
      .slice(2);
    let i = 0; // for local
    let saltToBytes;
    // let i = 1;

    const Deployer = await ethers.getContractFactory("Deployer");
    const deployer = await Deployer.deploy(bytecode);
    await deployer.deployed();
    console.log({ deployer }); // to deploy Deployer.sol

    let ffAddress = `0xff${deployer.address.substr(2)}`;

    deployer.on("AddressReturn", (address) => {
      console.log({ address });
    });

    while (true) {
      // or while(true)
      // 1. Convert i to hex, and it pad to 32 bytes:
      saltToBytes = i.toString(16).padStart(64, "0");

      // 2. Concatenate this between the other 2 strings
      let concatString = ffAddress.concat(saltToBytes).concat(hashedBytecode);

      // 3. Hash the resulting string
      let hashed = eth.bufferToHex(
        eth.keccak256(Buffer.from(concatString), "hex")
      );

      // 4. Remove leading 0x and 12 bytes
      // 5. Check if the result contains badc0de
      if (hashed.substr(26).includes("badc0de")) {
        console.log({ saltToBytes });
        break;
      }
      if (i % 10000 === 0) {
        console.log(`${i} results checked`);
      }
      i++;
    }
    // 0000000000000000000000000000000000000000000000000000000000e06d04 // local
    // 00000000000000000000000000000000000000000000000000000000000939cc // goerli

    const tx = await deployer.deployContract("0x" + saltToBytes);

    await tx.wait();

    console.log(tx);

    // const hash = await deployer.deploy("0x" + saltToBytes);

    // console.log(hash);
  });

  it("should return the correct hash", async () => {
    logger();
    const Deployer = await ethers.getContractFactory("Deployer");
    logger();

    const deployer = await Deployer.deploy(bytecode);
    logger();

    const dep = await deployer.deployed();
    logger();
    console.log({ dep }); // to deploy Deployer.sol
    logger();

    // let ffAddress = `0xff${deployer.address.substr(2)}`;

    for (let salt = 0; salt <= 100000000000000; salt++) {
      // Compute the create2 salt value
      const saltBytes = ethers.utils.hexZeroPad(
        ethers.BigNumber.from(salt).toHexString(),
        32
      );
      const create2Inputs = [
        "0xff",
        dep.address,
        saltBytes,
        ethers.utils.keccak256(bytecode),
      ];
      const create2InputsHash = ethers.utils.solidityKeccak256(
        ["bytes"],
        [ethers.utils.concat(create2Inputs)]
      );
      const contractAddress = ethers.utils.getAddress(
        ethers.utils.hexDataSlice(create2InputsHash, 12)
      );

      // Check if the contract address contains 'badc0de'
      if (contractAddress.includes("badc0de")) {
        // If found, print the salt value and contract address
        console.log(`Salt value: ${salt}`);
        console.log(`Contract address: ${contractAddress}`);
        break;
      }
      if (salt % 10000 === 0) {
        console.log(`${salt} elapsed`);
      }
    }
  });
});
