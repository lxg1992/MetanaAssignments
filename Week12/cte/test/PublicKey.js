const eth = require("ethereumjs-util");
const { expect } = require("chai");
const { ec } = require("elliptic");

function getSenderPublicKey(txData) {
  // Extract the relevant values from the transaction data
  const { from, r, s, v, chainId } = txData;

  // Create an instance of the elliptic curve secp256k1
  const curve = new ec("secp256k1");

  // Prepare the transaction hash for signing
  const txHash = `0x${txData.hash.slice(2)}${chainId
    .toString(16)
    .padStart(2, "0")}${r.slice(2)}${s.slice(2)}`;

  // Convert the v value to an integer
  const vValue = parseInt(v, 10);
  console.log({ v, vValue });

  // Determine the recovery parameter (y-parity) from the v value
  const recoveryParam = vValue; //- 27;

  // Derive the public key from the transaction hash and recovery parameter
  const publicKey = curve.recoverPubKey(
    Buffer.from(txHash, "hex"),
    recoveryParam,
    Buffer.from(r, "hex"),
    Buffer.from(s, "hex")
  );

  // Convert the public key to uncompressed format and return it as a hexadecimal string
  return `0x${publicKey.encode("hex", false)}`;
}

describe("Public Key", function () {
  it("should accept the correct public key for authenticate function", async () => {
    const PublicKey = await ethers.getContractFactory("PublicKeyChallenge");

    const pk = await PublicKey.deploy();

    await pk.deployed();

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: ["0x92b28647Ae1F3264661f72fb2eB9625A89D88A31"],
    });

    await hre.network.provider.send("hardhat_setBalance", [
      "0x92b28647Ae1F3264661f72fb2eB9625A89D88A31",
      "0xDE0B6B3A7640000",
    ]);

    const signer = await ethers.getSigner(
      "0x92b28647Ae1F3264661f72fb2eB9625A89D88A31"
    );

    const payload = {
      to: "0x92b28647Ae1F3264661f72fb2eB9625A89D88A31",
      gasLimit: "21000",
    };

    const txSent = await signer.sendTransaction(payload);
    console.log({ txSent });

    const pubKey = getSenderPublicKey(txSent);
    console.log(pubKey);
  });
});
