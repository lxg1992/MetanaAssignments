import elliptic from "elliptic";
import jssha3 from "js-sha3";
import { Buffer } from "buffer";

const { keccak256 } = jssha3;
const { ec: EC } = elliptic;

// const PRIVATE_KEY =
//   "a69c0d784fda6fec0f449f12602068ff4f11a999f82da8bc81bf53d0a76d8844";

const ec = new EC("secp256k1");

export const generateCredentials = () => {
  try {
    const keyPair = ec.genKeyPair();
    const privateKey = keyPair.getPrivate("hex");
    const publicKey = keyPair.getPublic();
    const pubHex = publicKey.encode("hex").substring(2);
    const hashOfPublicKey = keccak256(Buffer.from(pubHex, "hex"));
    const ethAddressBuffer = Buffer.from(hashOfPublicKey, "hex");
    const ethAddress = `0x${ethAddressBuffer.slice(-20).toString("hex")}`;
    return {
      publicKey: pubHex,
      privateKey,
      ethAddress,
    };
  } catch (e) {
    console.log(e);
  }
};

export const importWithPrivateKey = (pkInput) => {
  try {
    const keyPair = ec.keyFromPrivate(pkInput);
    const privateKey = keyPair.getPrivate("hex");
    const publicKey = keyPair.getPublic();
    const pubHex = publicKey.encode("hex").substring(2);
    const hashOfPublicKey = keccak256(Buffer.from(pubHex, "hex"));
    const ethAddressBuffer = Buffer.from(hashOfPublicKey, "hex");
    const ethAddress = `0x${ethAddressBuffer.slice(-20).toString("hex")}`;
    return {
      publicKey: pubHex,
      privateKey,
      ethAddress,
    };
  } catch (e) {
    console.log(e);
  }
};

export const signMessage = (msg, privateKey) => {
  const msgHash = keccak256(msg);
  const signature = ec.sign(msgHash, privateKey, { canonical: true });
  return signature;
};
