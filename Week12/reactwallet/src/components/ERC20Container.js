import React, { useState, useContext } from "react";
import { Card } from "semantic-ui-react";
import { MyContext } from "../context/Ctx";
import ERC20Item from "./ERC20Item";
import BigNumber from "bignumber.js";
import { infuraNode } from "../helpers/constants";

const ERC20Container = () => {
  const { account } = useContext(MyContext);

  async function getERC20Balance(contractAddress, decimals) {
    const balanceOfMethodId = "0x70a08231";
    const paddedAddress = account.address.replace(/^0x/, "").padStart(64, "0");
    const data = balanceOfMethodId + paddedAddress;

    const response = await fetch(infuraNode, {
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

    const response = await fetch(infuraNode, {
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

  async function createTransferPayload(recipient, amount) {
    // ERC20 transfer function signature
    const transferSignature = "0xa9059cbb";

    // Convert the recipient address to a hexadecimal string
    const recipientHex = recipient.substring(2).padStart(64, "0");

    // Convert the amount to a hexadecimal string
    const amountHex = BigInt(amount).toString(16).padStart(64, "0");

    // Concatenate the function signature, recipient, and amount to create the payload
    const payload = transferSignature + recipientHex + amountHex;

    return payload;
  }
  return (
    <Card fluid>
      <Card.Content>
        <Card.Header>Tokens</Card.Header>
        {Object.entries(account.ERC20Contracts).map((entry, idx) => (
          <ERC20Item
            key={idx}
            name={entry[0]}
            address={entry[1]}
            getERC20Balance={getERC20Balance}
            getERC20Decimals={getERC20Decimals}
            createTransferPayload={createTransferPayload}
          />
        ))}
      </Card.Content>
    </Card>
  );
};

export default ERC20Container;
