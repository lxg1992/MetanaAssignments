import elliptic from "elliptic";
import jssha3 from "js-sha3";
import { Buffer } from "buffer";
import { ecsign, toBuffer } from "ethereumjs-util";
import RLP from "rlp";

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

export const encodeNum = (num) => "0x" + (num ? num.toString(16) : "0x0");
export const decodeNum = (hex) => parseInt(hex.toString("hex"));

export const gweiToHex = (gwei) => (gwei ? encodeNum(gwei * 1e9) : "0x0");
export const ethToHex = (eth) => (eth ? encodeNum(eth * 1e18) : "0x0");

export const generateTxData = (
  nonce,
  to, // 0xaddresshere
  valueInEth,
  data = "0x",
  gasPriceInGwei = gweiToHex("100"),
  gasLimit = encodeNum(50000)
) => {
  const txData = {
    to,
    value: ethToHex(valueInEth),
    gasPrice: gweiToHex(gasPriceInGwei),
    gasLimit: encodeNum(gasLimit),
    nonce: encodeNum(nonce),
    data,
  };
  return txData;
};

export async function signTransaction(txObj, privateKey) {
  // const { nonce, gasPrice, gasLimit, to, value, data } = tx;

  // // Construct the transaction object
  // const txObj = {
  //   nonce: "0x" + nonce.toString(16),
  //   gasPrice: "0x" + gasPrice.toString(16),
  //   gasLimit: "0x" + gasLimit.toString(16),
  //   to: to || "0x",
  //   value: "0x" + value.toString(16),
  //   data: data || "0x",
  // };

  // Compute the hash of the transaction to be signed
  const txHash = Buffer.from(
    keccak256(
      RLP.encode([
        Buffer.from(txObj.nonce),
        Buffer.from(txObj.gasPrice),
        Buffer.from(txObj.gasLimit),
        Buffer.from(txObj.to),
        Buffer.from(txObj.value),
        Buffer.from(txObj.data),
      ])
    ).slice(2),
    "hex"
  );

  // Sign the transaction hash with the private key
  const privateKeyBuffer = Buffer.from(privateKey, "hex");
  const { v, r, s } = ecsign(txHash, privateKeyBuffer);

  // Convert the signature to the format expected by the `eth_sendRawTransaction` RPC call
  const rpcSig = Buffer.concat([Buffer.from(v), r, s]).toString("hex");

  // Construct and return the payload object
  const payload = {
    jsonrpc: "2.0",
    method: "eth_sendRawTransaction",
    params: [RLP.encode([txObj, Buffer.from(v), r, s]).toString("hex")],
    id: 1,
  };
  return payload;
}
