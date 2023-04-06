import React, { useState, useContext, useEffect } from "react";
import { Card, Input, Button } from "semantic-ui-react";
import { MyContext } from "../context/Ctx";
import {
  generateTxData,
  createTransferPayload,
  generateSendRawTxPayload,
} from "../scripts/ethUtils.mjs";
import { infuraNode } from "../helpers/constants";

const ERC20Item = ({
  name,
  address,
  getERC20Balance,
  getERC20Decimals,
  nonce,
}) => {
  const { account, setAccount, removeToken } = useContext(MyContext);
  const [balance, setBalance] = useState(0);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(0);
  const [decimals, setDecimals] = useState(0);

  const sendTransfer = async () => {
    const dataFieldValue = createTransferPayload(recipient, amount, decimals);
    console.log({ decimals });

    const txData = generateTxData(
      nonce,
      address,
      0,
      dataFieldValue,
      100,
      100000
    );

    const signedPayload = generateSendRawTxPayload(txData, account.privateKey);

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

  useEffect(() => {
    async function asyncAction() {
      const returnDecimals = await getERC20Decimals(address);
      setDecimals(returnDecimals);
      const returnBalance = await getERC20Balance(address, returnDecimals);
      setBalance(returnBalance);
    }

    asyncAction();
  }, [account]);

  return (
    <Card fluid>
      <Card.Content>
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
        <Button onClick={sendTransfer}>Send</Button>
        {/* <Button
          onClick={(e) => {
            removeToken(name);
          }}
        > MAKE SURE THIS WORKS BEFORE COMMIT
          Remove Token
        </Button> */}
      </Card.Content>
    </Card>
  );
};

export default ERC20Item;
