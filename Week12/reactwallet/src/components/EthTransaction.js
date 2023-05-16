import React, { useContext, useState } from "react";

import { MyContext } from "../context/Ctx";
import {
  generateTxData,
  generateSendRawTxPayload,
  decryptItem,
  calculateGasFee,
} from "../helpers/ethUtils.mjs";
import { infuraNode } from "../helpers/constants.mjs";
import { Button, Card, Input } from "semantic-ui-react";
// local

const EthTransaction = ({ nonce }) => {
  const { account, setAccount, network } = useContext(MyContext);
  const [to, setTo] = useState("");
  const [value, setValue] = useState("");
  const [data, setData] = useState("");
  const [isEstimated, setIsEstimated] = useState(false);

  const handleToChange = (event) => {
    setIsEstimated(false);
    setTo(event.target.value);
  };

  const handleValueChange = (event) => {
    setIsEstimated(false);
    setValue(event.target.value);
  };

  const handleDataChange = (event) => {
    setIsEstimated(false);
    setData(event.target.value);
  };

  const handleEstimate = async () => {
    const gasPrice = await calculateGasFee({ network });
    const txData = await generateTxData(nonce, to, value, data, gasPrice);
    // const pk = decryptItem(account.encPK, account.salt);
    // const signedPayload = generateSendRawTxPayload(txData, pk, network.name);
    const response = await fetch(network.node, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_estimateGas",
        params: [txData],
        id: 1,
      }),
    });

    const returnData = await response.json();
    if (returnData.error) {
      console.error(returnData.error);
      throw new Error(returnData.error.message);
    }
    console.log(returnData.result);
    setIsEstimated(true);
    return returnData.result;
  };

  const handleSubmit = async () => {
    const gasPrice = await calculateGasFee({ network });
    const txData = await generateTxData(nonce, to, value, data, gasPrice);
    const pk = decryptItem(account.encPK, account.salt);
    const signedPayload = generateSendRawTxPayload(txData, pk, network.name);
    const response = await fetch(network.node, {
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
    <Card fluid>
      <Card.Content>
        <Card.Header>Send Tx</Card.Header>
        <Card.Meta> To:</Card.Meta>
        <Card.Content>
          <Input
            type="text"
            value={to}
            onChange={handleToChange}
            placeholder={"0x123456...abcdef"}
          />
        </Card.Content>
        <Card.Meta>Value (ETH):</Card.Meta>
        <Card.Content>
          <Input
            type="text"
            value={value}
            onChange={handleValueChange}
            placeholder={"0.1234"}
          />
        </Card.Content>
        <Card.Meta>Data:</Card.Meta>
        <Card.Content>
          <Input value={data} onChange={handleDataChange} placeholder={"0x"} />
        </Card.Content>
        {isEstimated ? (
          <Button secondary onClick={handleSubmit}>
            Submit
          </Button>
        ) : (
          <Button onClick={handleEstimate}>Estimate</Button>
        )}
      </Card.Content>
    </Card>
  );
};

export default EthTransaction;
