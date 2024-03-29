import React, { useState, useContext } from "react";
import { Card, Input, Button } from "semantic-ui-react";
import BigNumber from "bignumber.js";
import { MyContext } from "../context/Ctx";
import ERC20Item from "./ERC20Item";

const ERC20Container = ({ nonce }) => {
  const { account, addToken, network } = useContext(MyContext);
  const [newTokenName, setNewTokenName] = useState("");
  const [newTokenAddr, setNewTokenAddr] = useState("");

  async function getERC20Balance(contractAddress, decimals) {
    const balanceOfMethodId = "0x70a08231";
    const paddedAddress = account.address.replace(/^0x/, "").padStart(64, "0");
    const data = balanceOfMethodId + paddedAddress;

    const response = await fetch(network.node, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_call",
        params: [
          {
            to: contractAddress,
            data: data,
          },
          "latest",
        ],
      }),
    });

    const { result, error } = await response.json();
    if (error) throw new Error(error.message);

    const balance = new BigNumber(result).dividedBy(
      new BigNumber(10).exponentiatedBy(decimals)
    ); // Convert from wei to tokens
    return balance.toFixed(18);
  }

  async function getERC20Decimals(contractAddress) {
    const decimalsMethodId = "0x313ce567";

    const response = await fetch(network.node, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_call",
        params: [
          {
            to: contractAddress,
            data: decimalsMethodId,
          },
          "latest",
        ],
      }),
    });

    const { result, error } = await response.json();
    if (error) throw new Error(error.message);

    const decimals = parseInt(result, 16);
    return decimals;
  }

  return (
    <Card fluid>
      <Card.Content>
        {Object.entries(account.ERC20Contracts[network.name] || {}).map(
          (entry, idx) => {
            return (
              <ERC20Item
                key={idx}
                name={entry[0]}
                address={entry[1]}
                getERC20Balance={getERC20Balance}
                getERC20Decimals={getERC20Decimals}
                nonce={nonce}
              />
            );
          }
        )}
      </Card.Content>
      <Card.Content>
        <Card.Header>Add Tokens</Card.Header>
        <Input
          value={newTokenName}
          onChange={(e) => setNewTokenName(e.target.value)}
          placeholder={"Name of token"}
        />
        <Input
          value={newTokenAddr}
          onChange={(e) => setNewTokenAddr(e.target.value)}
          placeholder={"Token Address"}
        />
        <Button
          onClick={() => addToken(newTokenName, newTokenAddr, network.name)}
        >
          Add
        </Button>
      </Card.Content>
    </Card>
  );
};

export default ERC20Container;
