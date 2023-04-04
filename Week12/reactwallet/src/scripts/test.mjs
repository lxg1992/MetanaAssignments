// const secp = require("ethereum-cryptography/secp256k1");
// const { toHex } = require("ethereum-cryptography/utils");
// import elliptic from "elliptic";
// import jssha3 from "js-sha3";
// const { keccak256 } = jssha3;
// const { ec: EC } = elliptic;

import utf8 from "utf8";

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

export const encodeStr = (str) => "0x" + Buffer.from(str).toString("hex");
export const decodeStr = (str) => Buffer.from(str.slice(2), "hex").toString();

console.log(encodeStr("abcd"));
console.log(decodeStr("0x616263"));

export const encodeNum = (num) => "0x" + (num ? num.toString(16) : "0x0");
export const decodeNum = (hex) => parseInt(hex.toString("hex"));

console.log(encodeNum(256));
console.log(decodeNum("0x100"));
