import React, { useContext, useState } from "react";
import { Transaction } from "@ethereumjs/tx";

import { Chain, Common, Hardfork } from "@ethereumjs/common";
import { MyContext } from "../context/Ctx";
import {
  generateTxData,
  priKeyBuffer,
  signTransaction,
} from "../scripts/ethUtils.mjs";
import { infuraNode, network } from "../helpers/constants";
import { Button, Card, Input } from "semantic-ui-react";
// local

const common = new Common({ chain: Chain.Goerli });

const EthTransaction = ({ nonce }) => {
  const { account } = useContext(MyContext);
  const [to, setTo] = useState("");
  const [value, setValue] = useState("");
  const [data, setData] = useState("");

  const handleToChange = (event) => {
    setTo(event.target.value);
  };

  const handleValueChange = (event) => {
    setValue(parseFloat(event.target.value));
  };

  const handleDataChange = (event) => {
    setData(event.target.value);
  };

  const handleSubmit = async () => {
    const txData = generateTxData(nonce, to, value, data);
    const signedPayload = signTransaction(txData, account.privateKey);
    console.log(signedPayload);
  };

  return (
    <>
      <Card.Header>
        To:
        <Input type="text" value={to} onChange={handleToChange} />
      </Card.Header>
      <br />
      <Card.Header>
        Value (ETH):
        <Input type="text" value={value} onChange={handleValueChange} />
      </Card.Header>
      <br />
      <Card.Header>
        Data:
        <Input value={data} onChange={handleDataChange} />
      </Card.Header>
      <br />
      <Button onClick={handleSubmit}>Submit</Button>
    </>
  );
};

export default EthTransaction;
