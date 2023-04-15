const eth = require("ethereumjs-util");
const { expect } = require("chai");
const ejsUtil = require("ethereumjs-util");
const hre = require("hardhat");

function computePublicKey(transaction) {
  const signature = {
    r: transaction.r,
    s: transaction.s,
    v: transaction.v,
  };

  const serializedTransaction = ethers.utils.serializeTransaction(
    transaction,
    signature
  );
  const msg = ethers.utils.keccak256(serializedTransaction);
  const publicKey = ethers.utils.recoverPublicKey(msg, signature);

  return publicKey;
}

function getRawTransaction(tx) {
  function addKey(accum, key) {
    if (tx[key]) {
      accum[key] = tx[key];
    }
    return accum;
  }

  // Extract the relevant parts of the transaction and signature
  const txFields =
    "accessList chainId data gasPrice gasLimit maxFeePerGas maxPriorityFeePerGas nonce to type value".split(
      " "
    );
  const sigFields = "v r s".split(" ");

  // Seriailze the signed transaction
  const raw = utils.serializeTransaction(
    txFields.reduce(addKey, {}),
    sigFields.reduce(addKey, {})
  );

  // Double check things went well
  if (utils.keccak256(raw) !== tx.hash) {
    throw new Error("serializing failed!");
  }

  return raw;
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
      value: "0x0E0B6B3A7640000",
      
    };

    const txSent = await signer.sendTransaction(payload);
    // console.log({ txSent });
    const { gasPrice, ...tx } = txSent;

    const signature = {

    }

    ejsUtil.ecrecover();

    console.log({ tx });
    // const rawTx = getRawTransaction(txSent);

    const pubKey = computePublicKey(tx);
    console.log(pubKey);
  });
});
