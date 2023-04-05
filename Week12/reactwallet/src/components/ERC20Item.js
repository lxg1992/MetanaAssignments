import React, { useState, useContext, useEffect } from "react";
import { Card, Input } from "semantic-ui-react";
import { MyContext } from "../context/Ctx";

const ERC20Item = ({ name, address, getERC20Balance, getERC20Decimals }) => {
  const { account } = useContext(MyContext);
  const [balance, setBalance] = useState(0);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    async function asyncAction() {
      const returnDecimals = await getERC20Decimals(address);
      const returnBalance = await getERC20Balance(address, returnDecimals);
      setBalance(returnBalance);
    }

    asyncAction();
  });

  return (
    <Card fluid>
      <Card.Content>
        <Card.Header>Name: {name}</Card.Header>
        <Card.Description>Address: {address}</Card.Description>
        <Card.Description>Balance: {balance}</Card.Description>
      </Card.Content>
      <Card.Content>
        <Input placeholder />
      </Card.Content>
    </Card>
  );
};

export default ERC20Item;
