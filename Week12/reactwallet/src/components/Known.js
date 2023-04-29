import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useTransition,
} from "react";
import {
  Button,
  Card,
  Container,
  Accordion,
  Grid,
  GridColumn,
  Input,
  Label,
  Modal,
  Popup,
} from "semantic-ui-react";

import { MyContext } from "../context/Ctx";
import { chainScan, infuraNode } from "../helpers/constants.mjs";
import { f4l4 } from "../helpers/utils";
import EthTransaction from "./SendEth";
import ERC20Container from "./ERC20Container";
import {
  calculateGasFee,
  getBlockByNumber,
  getLatestBlockNum,
} from "../helpers/ethUtils.mjs";

const Known = () => {
  const { account, fullResetAccount, setAccount } = useContext(MyContext);
  const [balance, setBalance] = useState(0);
  const [nonce, setNonce] = useState(0);
  const [gasPriceEstimate, setGasPriceEstimate] = useState(0);
  const [open, setOpen] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [saltInput, setSaltInput] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [error, setError] = useState("");
  const [network, setNetwork] = useState("");
  const intervalRef = useRef();

  const fetchGasInfo = async () => {
    const gasFeeInfo = await calculateGasFee();
    setGasPriceEstimate(gasFeeInfo);
    beginTimer();
  };

  const beginTimer = () => {
    clearInterval(intervalRef.current);
    setSecondsElapsed(0);
    intervalRef.current = setInterval(() => {
      setSecondsElapsed((s) => s + 1);
    }, 1000);
  };

  const getPrivateKey = (salt) => {
    if (account.salt !== saltInput) {
      setError("Invalid Password");
    }
    // Get the export private key function
  };

  const WalletContent = (
    <Card fluid>
      <Grid
        container
        columns={3}
        textAlign="center"
        verticalAlign="top"
        padded="vertically"
        doubling
        stackable
      >
        <Grid.Row>
          <Grid.Column>
            <Card fluid>
              <Card.Content>
                <Card.Description>Ethereum Balance: {balance}</Card.Description>
              </Card.Content>
            </Card>
            <Card fluid>
              <Card.Content>
                <Popup
                  trigger={
                    <Card.Description>
                      Address: {f4l4(account.address)}
                    </Card.Description>
                  }
                  hoverable
                  basic
                >
                  <Popup.Content>{account.address}</Popup.Content>
                </Popup>
              </Card.Content>
            </Card>
            <Card fluid>
              <Card.Content>
                <Popup
                  trigger={
                    <Card.Description>
                      Public Key: {f4l4(account.publicKey)}
                    </Card.Description>
                  }
                  hoverable
                  basic
                >
                  <Popup.Content>{account.publicKey}</Popup.Content>
                </Popup>
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
                    as={Button}
                    href={`${chainScan}/tx/${account.lastTx}`}
                  >
                    Last Tx: {f4l4(account.lastTx)}
                  </Card.Description>
                ) : (
                  <Card.Description>LastTx: none detected</Card.Description>
                )}
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column>
            <Card fluid>
              <Card.Content>
                <Card.Header>Network</Card.Header>
              </Card.Content>
            </Card>
            <Card fluid>
              <Card.Content>
                <Card.Header>Account</Card.Header>
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

        <Grid.Row>
          <Grid.Column width={16}>
            <Card fluid>
              <Card.Content>
                <Button color="green" onClick={fetchGasInfo}>
                  Calculate Gas
                </Button>
                <Input
                  value={gasPriceEstimate}
                  label={"gwei"}
                  labelPosition="right"
                />
                {gasPriceEstimate > 0 && (
                  <Label>updated {secondsElapsed}s ago</Label>
                )}
              </Card.Content>
            </Card>
          </Grid.Column>
          <GridColumn width={16}>
            <Card fluid>
              <Card.Content>
                <Button color="red" onClick={fullResetAccount}>
                  Clear Accounts
                </Button>
                <Modal
                  onClose={() => setOpen(false)}
                  onOpen={() => setOpen(true)}
                  open={open}
                  size="small"
                  trigger={<Button>Reveal Private Key</Button>}
                >
                  <Modal.Content>
                    <Label basic>Please Enter Your Salt</Label>
                    <Input
                      value={saltInput}
                      onChange={(e) => setSaltInput(e.target.value)}
                    />
                    <Button onClick={getPrivateKey}>Reveal</Button>
                    {error ? error : privateKey}
                  </Modal.Content>
                </Modal>
              </Card.Content>
            </Card>
          </GridColumn>
        </Grid.Row>
      </Grid>
    </Card>
  );

  const TokenContent = (
    <Card fluid>
      <ERC20Container nonce={nonce} />
    </Card>
  );

  const panels = [
    {
      title: "Wallet",
      key: "wallet",
      content: {
        content: WalletContent,
      },
    },
    {
      title: "Tokens",
      key: "tokens",
      content: {
        content: TokenContent,
      },
    },
  ];

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
      <Accordion
        styled
        fluid
        // exclusive={false}
        panels={panels}
        defaultActiveIndex={0}
      />
    </Container>
  );
};

export default Known;
