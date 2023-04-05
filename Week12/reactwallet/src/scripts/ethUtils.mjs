import elliptic from "elliptic";
import jssha3 from "js-sha3";
import { Buffer } from "buffer";
import { ecsign, toBuffer } from "ethereumjs-util";
import { Transaction } from "@ethereumjs/tx";
import { network } from "../helpers/constants.js";
import { Common } from "@ethereumjs/common";

const common = new Common({ chain: network });

const { keccak256 } = jssha3;
const { ec: EC } = elliptic;

// const PRIVATE_KEY =
//   "a69c0d784fda6fec0f449f12602068ff4f11a999f82da8bc81bf53d0a76d8844";

const ec = new EC("secp256k1");

export const generateCredentials = () => {
  try {
    const keyPair = ec.genKeyPair();
    const privateKeyBuffer = keyPair.getPrivate();
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
      privateKeyBuffer,
    };
  } catch (e) {
    console.log(e);
  }
};

export const importWithPrivateKey = (pkInput) => {
  try {
    const keyPair = ec.keyFromPrivate(pkInput);
    const privateKeyBuffer = keyPair.getPrivate();
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
      privateKeyBuffer,
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

export const encodeStr = (str) =>
  str ? "0x" + Buffer.from(str).toString("hex") : "0x";
export const decodeStr = (hex) => Buffer.from(hex.slice(2), "hex").toString();

export const encodeNum = (num) =>
  num ? "0x" + parseInt(num).toString(16) : "0x0";
export const decodeNum = (hex) => parseInt(hex.toString("hex"));

export const gweiToHex = (gwei) => (gwei ? encodeNum(gwei * 1e9) : "0x0");
export const ethToHex = (eth) =>
  eth ? encodeNum(parseFloat(eth) * 1e18) : "0x0";

export const generateTxData = (
  nonce,
  to, // 0xaddresshere
  valueInEth,
  data = "0x",
  gasPriceInGwei = 100,
  gasLimit = 50000
) => {
  const txData = {
    to: to || "0x",
    value: ethToHex(valueInEth),
    gasPrice: gweiToHex(gasPriceInGwei),
    gasLimit: encodeNum(gasLimit),
    nonce: encodeNum(nonce),
    data,
  };
  return txData;
};

export function generateSendRawTxPayload(txParams, privateKey) {
  const tx = Transaction.fromTxData(txParams, { common });
  const pkBuffer = Buffer.from(privateKey, "hex");
  const signedTx = tx.sign(pkBuffer);
  const serializedTx = signedTx.serialize();
  return serializedTx.toString("hex");
}
