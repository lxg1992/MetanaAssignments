const eth = require("ethereumjs-util");
const { expect } = require("chai");
const {
  bytecode,
} = require("../artifacts/contracts/FuzzyIdentity.sol/FuzzySolver.json");
describe("FuzzyIdentity", function () {
  it("should return the correct hash", async () => {
    const Deployer = await ethers.getContractFactory("Deployer");

    const deployer = await Deployer.deploy(bytecode);

    await deployer.deployed();
    let saltBytes;

    for (let salt = 17417618; salt <= 100000000000000; salt++) {
      // Compute the create2 salt value
      saltBytes = ethers.utils.hexZeroPad(
        ethers.BigNumber.from(salt).toHexString(),
        32
      );
      const create2Inputs = [
        "0xff",
        deployer.address,
        saltBytes,
        ethers.utils.keccak256(bytecode),
      ];
      const create2InputsHash = ethers.utils.solidityKeccak256(
        ["bytes"],
        [ethers.utils.concat(create2Inputs)]
      );
      const contractAddress = ethers.utils
        .getAddress(ethers.utils.hexDataSlice(create2InputsHash, 12))
        .toLowerCase();

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

    await deployer.deployContract(saltBytes);
  });
});
