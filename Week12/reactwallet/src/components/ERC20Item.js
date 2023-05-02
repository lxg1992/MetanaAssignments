import React, { useState, useContext, useEffect } from "react";
import { Card, Input, Button, Icon } from "semantic-ui-react";
import { MyContext } from "../context/Ctx";
import {
  generateTxData,
  createTransferDataPayload,
  generateSendRawTxPayload,
  decryptPK,
  calculateGasFee,
} from "../helpers/ethUtils.mjs";

const ERC20Item = ({
  name,
  address,
  getERC20Balance,
  getERC20Decimals,
  nonce,
}) => {
  const { account, setAccount, removeToken, network } = useContext(MyContext);
  const [balance, setBalance] = useState(0);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(0);
  const [decimals, setDecimals] = useState(0);

  const sendERC20Transfer = async () => {
    const dataFieldValue = createTransferDataPayload(
      recipient,
      amount,
      decimals
    );

    const gasPrice = await calculateGasFee({ network });

    //estimate gas

    const txData = await generateTxData(
      nonce,
      address,
      0,
      dataFieldValue,
      gasPrice,
      100000
      // 100,
    );

    const pk = decryptPK(account.encPK, account.salt);

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

  useEffect(() => {
    async function asyncAction() {
      const returnDecimals = await getERC20Decimals(address);
      setDecimals(returnDecimals);
      const returnBalance = await getERC20Balance(address, returnDecimals);
      setBalance(returnBalance);
    }

    asyncAction();
  }, [account, network]);

  return (
    <Card fluid>
      <Card.Content>
        <Button
          floated="right"
          icon="close"
          onClick={(e) => removeToken(name)}
        />
        <Card.Header>Name: {name}</Card.Header>
        <Card.Description>Address: {address}</Card.Description>
        <Card.Description>Balance: {balance}</Card.Description>
      </Card.Content>
      <Card.Content>
        <Card.Header>Transfer Address & Amount</Card.Header>
        <Input
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder={"0xabcd...1234"}
        />

        <Input
          value={amount}
          placeholder={"10000"}
          onChange={(e) => setAmount(e.target.value)}
        ></Input>
        <Button onClick={sendERC20Transfer}>Send</Button>
      </Card.Content>
    </Card>
  );
};

export default ERC20Item;
