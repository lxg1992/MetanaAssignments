import elliptic from "elliptic";
import jssha3 from "js-sha3";
import { Buffer } from "buffer";
import { Transaction } from "@ethereumjs/tx";
import BigNumber from "bignumber.js";
import { Common } from "@ethereumjs/common";
import CryptoJS from "crypto-js";
import bip39 from "bip39";
import Wallet, { hdkey } from "ethereumjs-wallet";

const { keccak256 } = jssha3;
const { ec: EC } = elliptic;

const ec = new EC("secp256k1");

export const encryptPK = (pk, salt) =>
  CryptoJS.AES.encrypt(pk, salt).toString();

export const decryptPK = (encPK, salt) =>
  CryptoJS.AES.decrypt(encPK, salt).toString(CryptoJS.enc.Utf8);

export const generateCredentialsMulti = (mnemonic, salt = "salt") => {
  try {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const root = hdkey.fromMasterSeed(seed);
    const accounts = [];
    for (let i = 0; i < 10; i++) {
      const hdWallet = root.derivePath(`m/44'/60'/${i}'/0/0`);
      const privateKey = hdWallet.getWallet().getPrivateKeyString().slice(2);
      // console.log({ pkMulti: privateKey });
      const encPK = encryptPK(privateKey, salt);
      const publicKey = hdWallet.getWallet().getPublicKeyString();
      const pubHex = publicKey.substring(2);
      const hashOfPublicKey = keccak256(Buffer.from(pubHex, "hex"));
      const ethAddressBuffer = Buffer.from(hashOfPublicKey, "hex");
      const ethAddress = `0x${ethAddressBuffer.slice(-20).toString("hex")}`;
      // console.log({ unEncMulti: decryptPK(encPK, salt) });

      accounts.push({
        publicKey: pubHex,
        privateKey,
        ethAddress,
        encPK,
      });
    }
    return accounts;
  } catch (e) {
    console.log(e);
  }
};

export const generateCredentialsSingle = (salt = "salt") => {
  try {
    const keyPair = ec.genKeyPair();
    const privateKey = keyPair.getPrivate("hex");
    const encPK = encryptPK(privateKey, salt);
    const publicKey = keyPair.getPublic();
    const pubHex = publicKey.encode("hex").substring(2);
    const hashOfPublicKey = keccak256(Buffer.from(pubHex, "hex"));
    const ethAddressBuffer = Buffer.from(hashOfPublicKey, "hex");
    const ethAddress = `0x${ethAddressBuffer.slice(-20).toString("hex")}`;
    return {
      publicKey: pubHex,
      privateKey,
      ethAddress,
      encPK,
    };
  } catch (e) {
    console.log(e);
  }
};

export const generateMnemonic = () => {
  return bip39.generateMnemonic(128);
};

export const importWithPrivateKeySingle = (pkInput, salt = "salt") => {
  try {
    const keyPair = ec.keyFromPrivate(pkInput);
    const privateKey = keyPair.getPrivate("hex");
    // console.log({ pkSingle: privateKey });
    const encPK = encryptPK(privateKey, salt);
    const publicKey = keyPair.getPublic();
    const pubHex = publicKey.encode("hex").substring(2);
    const hashOfPublicKey = keccak256(Buffer.from(pubHex, "hex"));
    const ethAddressBuffer = Buffer.from(hashOfPublicKey, "hex");
    const ethAddress = `0x${ethAddressBuffer.slice(-20).toString("hex")}`;
    // console.log({ unEncSingle: decryptPK(encPK, salt) });
    return {
      publicKey: pubHex,
      privateKey,
      ethAddress,
      encPK,
    };
  } catch (e) {
    console.log(e);
  }
};

export const getBlockByNumber = async ({ hexNum = "latest", network }) => {
  const blockDataRequest = {
    jsonrpc: "2.0",
    id: 2,
    method: "eth_getBlockByNumber",
    params: [hexNum, false],
  };

  const response = await fetch(network.node, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(blockDataRequest),
  });

  const data = await response.json();

  return data.result;
};

//Returns 0xab etc
export const calculateGasFee = async ({ network, returnType = "int" }) => {
  const block = await getBlockByNumber({ hexNum: "latest", network });
  const { baseFeePerGas } = block;
  const parsed = parseInt(baseFeePerGas, 16);
  const maxFee = (parsed / 1e9) * 1.125;
  if (returnType === "int") {
    return maxFee;
  } else {
    const hexMaxFee = maxFee.toString(16);
    return "0x" + hexMaxFee;
  }
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

export const generateTxData = async (
  nonce,
  to, // 0xaddresshere
  valueInEth,
  data = "0x",
  gasPriceInGwei = 5,
  gasLimit = 100000
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

export function generateSendRawTxPayload(txParams, privateKey, chain) {
  const common = new Common({ chain });
  const tx = Transaction.fromTxData(txParams, { common });
  const pkBuffer = Buffer.from(privateKey, "hex");
  const signedTx = tx.sign(pkBuffer);
  const serializedTx = signedTx.serialize();
  return serializedTx.toString("hex");
}

export function createTransferDataPayload(recipient, amount, decimals) {
  // ERC20 transfer function signature
  const transferSignature = "0xa9059cbb";

  // Convert the recipient address to a hexadecimal string
  const recipientHex = recipient.substring(2).padStart(64, "0");

  // Convert the amount to a hexadecimal string
  const amountHex = new BigNumber(amount)
    .multipliedBy(new BigNumber(10).exponentiatedBy(decimals))
    .toString(16)
    .padStart(64, "0");

  // Concatenate the function signature, recipient, and amount to create the payload
  const payload = transferSignature + recipientHex + amountHex;

  return payload;
}
