// const secp = require("ethereum-cryptography/secp256k1");
// const { toHex } = require("ethereum-cryptography/utils");
// import elliptic from "elliptic";
// import jssha3 from "js-sha3";
// const { keccak256 } = jssha3;
// const { ec: EC } = elliptic;

// const PRIVATE_KEY =
//   "a69c0d784fda6fec0f449f12602068ff4f11a999f82da8bc81bf53d0a76d8844";
// const PRIVATE_KEY_0x =
//   "0xa69c0d784fda6fec0f449f12602068ff4f11a999f82da8bc81bf53d0a76d8844";

// console.log({ lengthIS: PRIVATE_KEY.length });

// const ec = new EC("secp256k1");
// const genPoint = ec.g;

// // Public Key = X and Y concatenated

// // const keyPair = ec.genKeyPair();
// const keyPair = ec.keyFromPrivate(
//   "a69c0d784fda6fec0f449f12602068ff4f11a999f82da8bc81bf53d0a76d8844"
// );

// const privateKey = keyPair.getPrivate("hex");
// const publicKey = keyPair.getPublic();
// const pubHex = publicKey.encode("hex").substring(2);
// const hashOfPublicKey = keccak256(Buffer.from(pubHex, "hex"));
// const ethAddressBuffer = Buffer.from(hashOfPublicKey, "hex");
// const ethAddress = `0x${ethAddressBuffer.slice(-20).toString("hex")}`;

// console.log({ privateKey, publicKey: pubHex, ethAddress });
