const secp = require("ethereum-cryptography/secp256k1");
const { hexToBytes } = require("ethereum-cryptography/utils");
const { toHex } = require("ethereum-cryptography/utils");
const Wallet = require("ethereumjs-wallet");
const EthUtil = require("ethereumjs-util");
//
const privateKeyString =
  "0xa69c0d784fda6fec0f449f12602068ff4f11a999f82da8bc81bf53d0a76d8844";

const privateKeyBuffer = EthUtil.toBuffer(privateKeyString);
console.log();
const wallet = Wallet.default.fromPrivateKey(privateKeyBuffer);
const publicKey = wallet.getPublicKeyString();
const address = wallet.getAddressString();

//secp.utils.randomPrivateKey();
// console.log({ privateKey });
// console.log({ hexpri: toHex(privateKey) });

// const publicKey = secp.getPublicKey(privateKey);

// console.log({ publicKey });
// console.log({ hexpub: toHex(publicKey) });

// const address = toHex(publicKey.slice(-20));

console.log({ address });

module.exports = {
  generateCredentials() {
    const privateKey = secp.utils.randomPrivateKey();
    const publicKey = secp.getPublicKey(privateKey);
    const address = publicKey.slice(-20);

    return {
      privateKey: toHex(privateKey),
      publicKey: toHex(publicKey),
      address: toHex(address),
    };
  },
};
