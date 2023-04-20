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
import { chainScan, infuraNode } from "../helpers/constants";
import { f4l4 } from "../helpers/utils";
import { signMessage } from "../helpers/ethUtils.mjs";
import EthTransaction from "./SendEth";
import ERC20Container from "./ERC20Container";

const Known = () => {
  const { account, resetAccount, setAccount } = useContext(MyContext);
  const [balance, setBalance] = useState(0);
  const [nonce, setNonce] = useState(0);

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
  }, [account]);

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
  }, [account]);

  return (
    <Container textAlign="center" style={{ padding: "2rem" }}>
      <Card fluid>
        <Grid
          container
          columns={2}
          textAlign="center"
          verticalAlign="top"
          celled="internally"
        >
          <Grid.Row>
            <Grid.Column>
              <Button onClick={resetAccount}>Reset</Button>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Card fluid>
                <Card.Content>
                  <Card.Header>Ethereum balance</Card.Header>
                  <Card.Description>{balance}</Card.Description>
                </Card.Content>
              </Card>
              <Card fluid>
                <Card.Content>
                  <Card.Description>
                    Address: {account.address}
                  </Card.Description>
                </Card.Content>
              </Card>
              <Card fluid>
                <Card.Content>
                  <Card.Description>
                    Public Key: {f4l4(account.publicKey)}
                  </Card.Description>
                </Card.Content>
              </Card>

              <Card fluid>
                <Card.Content>
                  <Card.Description>Nonce: {nonce}</Card.Description>
                </Card.Content>
              </Card>
              <Card fluid>
                <Card.Content>
                  {account.lastTx ? (
                    <Card.Description
                      href={`${chainScan}/tx/${account.lastTx}`}
                    >
                      Last Tx: {f4l4(account.lastTx)}{" "}
                    </Card.Description>
                  ) : (
                    <Card.Description>LastTx: none detected</Card.Description>
                  )}
                </Card.Content>
              </Card>
            </Grid.Column>
            <GridColumn>
              <Card fluid>
                <Card.Content>
                  <EthTransaction nonce={nonce} />
                </Card.Content>
              </Card>
            </GridColumn>
          </Grid.Row>
        </Grid>
      </Card>
      <Card fluid>
        <ERC20Container nonce={nonce} />
      </Card>
    </Container>
  );
};

export default Known;
