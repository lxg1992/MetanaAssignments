import React, { useContext, useState } from "react";

import { MyContext } from "../context/Ctx";
import {
  generateTxData,
  generateSendRawTxPayload,
  decryptPK,
} from "../helpers/ethUtils.mjs";
import { infuraNode, network } from "../helpers/constants";
import { Button, Card, Input } from "semantic-ui-react";
// local

const EthTransaction = ({ nonce }) => {
  const { account, setAccount } = useContext(MyContext);
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

  const handleSubmit = async () => {
    const txData = generateTxData(nonce, to, value, data);
    const pk = decryptPK(account.encPK, account.salt);
    const signedPayload = generateSendRawTxPayload(txData, pk);
    const response = await fetch(infuraNode, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_sendRawTransaction",
        params: ["0x" + signedPayload],
        id: 1,
      }),
    });

    const returnData = await response.json();
    if (returnData.error) {
      console.error(returnData.error);
      throw new Error(returnData.error.message);
    }
    setAccount((prevState) => ({ ...prevState, lastTx: returnData.result }));
    console.log(returnData.result);
    return returnData.result;
  };

  return (
    <>
      <Card.Header>Send Tx</Card.Header>
      <Card.Content>
        To:
        <Input type="text" value={to} onChange={handleToChange} />
      </Card.Content>
      <br />
      <Card.Content>
        Value (ETH):
        <Input type="text" value={value} onChange={handleValueChange} />
      </Card.Content>
      <br />
      <Card.Content>
        Data:
        <Input value={data} onChange={handleDataChange} />
      </Card.Content>
      <br />
      <Button onClick={handleSubmit}>Submit</Button>
    </>
  );
};

export default EthTransaction;
