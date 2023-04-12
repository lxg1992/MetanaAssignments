const eth = require("ethereumjs-util");
const { expect } = require("chai");

describe("Public Key", function () {
  it("should accept the correct public key for authenticate function", async () => {
    const PublicKey = await ethers.getContractFactory("PublicKeyChallenge");

    const pk = await PublicKey.deploy();

    await pk.deployed();

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: ["0x92b28647Ae1F3264661f72fb2eB9625A89D88A31"],
    });

    const signer = await ethers.getSigner(
      "0x92b28647Ae1F3264661f72fb2eB9625A89D88A31"
    );

    signer.sendTransaction();
  });
});
