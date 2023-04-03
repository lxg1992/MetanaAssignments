import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Card,
  Container,
  Divider,
  Grid,
  GridColumn,
  GridRow,
  Input,
} from "semantic-ui-react";

import { MyContext } from "../context/Ctx";
import { infuraNode } from "../helpers/constants";
import { f4l4 } from "../helpers/utils";
import { signMessage } from "../scripts/ethUtils.mjs";

const Known = () => {
  const { account, resetAccount } = useContext(MyContext);
  const [balance, setBalance] = useState(0);
  const [nonce, setNonce] = useState(0);
  const [messageToSign, setMessageToSign] = useState("");
  const [lastSignature, setLastSignature] = useState("");

  useEffect(() => {
    async function getBalance() {
      const response = await fetch(infuraNode, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "eth_getBalance",
          params: [account.address, "latest"],
        }),
      });

      const json = await response.json();
      const balanceInWei = parseInt(json.result, 16);
      const balanceInEth = balanceInWei / 1000000000000000000;
      setBalance(balanceInEth.toFixed(4));
    }
    getBalance();
  }, [account.address]);

  useEffect(() => {
    async function getNonce() {
      const response = await fetch(infuraNode, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "eth_getTransactionCount",
          params: [account.address, "latest"],
        }),
      });

      const data = await response.json();

      setNonce(parseInt(data.result, 16));
    }

    getNonce();
  }, [account.address]);

  return (
    <Container textAlign="center">
      <Grid container columns={3} verticalAlign="center">
        <Grid.Row>
          <Grid.Column>
            <Button onClick={resetAccount}>Reset</Button>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Card fluid>
              <Card.Description>Address: {account.address}</Card.Description>
            </Card>
            <Card fluid>
              <Card.Description>
                Public Key: {f4l4(account.pubKey)}
              </Card.Description>
            </Card>
            <Card fluid>
              <Card.Description>Nonce: {nonce}</Card.Description>
            </Card>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Card fluid>
              <Card.Header>Sign Message</Card.Header>
              <Input onChange={(e) => setMessageToSign(e.target.value)} />
              <Button
                onClick={() => {
                  const sig = signMessage(messageToSign, account.priKey);
                  console.log(sig);
                  // setLastSignature(sig);
                }}
              >
                Sign
              </Button>
            </Card>
          </Grid.Column>
          <Grid.Column>
            <Card fluid>
              <Card.Header>Last Signature</Card.Header>
              <Card.Description>
                {lastSignature ? lastSignature : "[no signature yet]"}
              </Card.Description>
            </Card>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Card fluid>
              <Card.Header>Ethereum balance</Card.Header>
              <Card.Description>{balance}</Card.Description>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default Known;
