import React, { useState } from "react";
import axios from "axios";
import { Buffer } from "buffer";
import { ec } from "elliptic";
import { keccak256 } from "js-sha3";
import utf8 from "hex-utf8";

const PRIVATE_KEY = "PUT_YOUR_PRIVATE_KEY_HERE";

const generateTxData = (to, value, data) => {
  const txData = {
    to,
    value: Buffer.from(parseFloat(value) * 1e18).toString("hex"),
    data: data ? Buffer.from(utf8.encode(data), "utf8").toString("hex") : "0x",
    nonce: web3.utils.toHex(
      web3.eth.getTransactionCount(web3.eth.defaultAccount)
    ),
    gasPrice: web3.utils.toHex(web3.utils.toWei("1", "gwei")),
    gasLimit: web3.utils.toHex("50000"),
  };
  return txData;
};

const signTransaction = (txData, privateKey) => {
  const txDataString = `${txData.nonce}${txData.gasPrice}${txData.gasLimit}${txData.to}${txData.value}${txData.data}`;
  const hash = keccak256(Buffer.from(txDataString, "hex"));
  const ecKey = ec("secp256k1").keyFromPrivate(Buffer.from(privateKey, "hex"));
  const signature = ecKey.sign(Buffer.from(hash, "hex"));
  const r = signature.r.toString("hex");
  const s = signature.s.toString("hex");
  const v = signature.recoveryParam + 27;
  return { r, s, v };
};

const sendSignedTransaction = async (signedTxData) => {
  try {
    const response = await axios.post(
      "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID",
      {
        jsonrpc: "2.0",
        id: 1,
        method: "eth_sendRawTransaction",
        params: [signedTxData],
      }
    );
    console.log(response.data.result);
  } catch (error) {
    console.error(error);
  }
};

const EthTransaction = () => {
  const [to, setTo] = useState("");
  const [value, setValue] = useState("");
  const [data, setData] = useState("");

  const handleToChange = (event) => {
    setTo(event.target.value);
  };

  const handleValueChange = (event) => {
    setValue(event.target.value);
  };

  const handleDataChange = (event) => {
    setData(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const txData = generateTxData(to, value, data);
    const signedTx = signTransaction(txData, PRIVATE_KEY);
    const signedTxData = `0x${signedTx.r}${signedTx.s}${signedTx.v}`;
    await sendSignedTransaction(signedTxData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        To:
        <input type="text" value={to} onChange={handleToChange} />
      </label>
      <br />
      <label>
        Value (ETH):
        <input type="text" value={value} onChange={handleValueChange} />
      </label>
      <br />
      <label>
        Data:
        <textarea value={data} onChange={handleDataChange} />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default EthTransaction;
