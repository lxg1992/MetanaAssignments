import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Button,
  Card,
  Container,
  Accordion,
  Grid,
  Icon,
  GridColumn,
  Input,
  Label,
  Modal,
  Popup,
  Dropdown,
} from "semantic-ui-react";

import { MyContext, networkDict } from "../context/Ctx";
import { f4l4 } from "../helpers/utils";
import EthTransaction from "./EthTransaction";
import ERC20Container from "./ERC20Container";
import {
  calculateGasFee,
  decryptItem,
  importWithPrivateKeySingle,
} from "../helpers/ethUtils.mjs";
import { generateDefaultAccount, pKeyRegex } from "../helpers/constants.mjs";

const Known = () => {
  const {
    // States
    account,
    network,
    accountDict,
    // Actions
    setAccount,
    fullResetAccount,
    setNetworkTo,
    setAccountInDict,
    removeAccountFromDict,
    findAvailableAccount,
  } = useContext(MyContext);
  const [balance, setBalance] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [nonce, setNonce] = useState(0);
  const [gasPriceEstimate, setGasPriceEstimate] = useState(0);
  const [error, setError] = useState("");
  //Modals
  const [revealModalOpen, setRevealModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [mnemonicModalOpen, setMnemonicModalOpen] = useState(false);

  //Inputs
  const [saltInput, setSaltInput] = useState("");
  const [inputPrivateKey, setInputPrivateKey] = useState("");
  //Derived
  const [revealPrivateKey, setRevealPrivateKey] = useState("");
  const [revealMnemonic, setRevealMnemonic] = useState("");
  const intervalRef = useRef();

  const networkOptions = Object.entries(networkDict).map((n, i) => ({
    key: i,
    text: `${n[1].label} ${n[1].title}`,
    value: n[0],
  }));

  const accountOptions = Object.entries(accountDict).map((n, i) => {
    console.log(n[0]);
    console.log(n[1]);
    return {
      key: i,
      text: (
        <>
          <Popup
            content="Remove"
            trigger={
              <Icon
                name="close"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveAccount(n[0]);
                }}
              />
            }
          />
          <Popup
            content={n[0]}
            trigger={<Label>{`[${i}] ${f4l4(n[0])}`}</Label>}
          />
        </>
      ), // change to i + 1 at the end
      value: n[0],
    };
  });

  const handleRemoveAccount = (address) => {
    removeAccountFromDict(address);
    const { availableAddr } = findAvailableAccount();
    if (!availableAddr) {
      fullResetAccount();
      return;
    }
    setAccount(accountDict[availableAddr]);
  };

  // useEffect(() => {
  //   fetchGasInfo();
  // }, [network]);

  const resetHiddenValues = () => {
    setInputPrivateKey("");
    setRevealPrivateKey("");
    setRevealMnemonic("");
    setSaltInput("");
    setError("");
  };

  const fetchGasInfo = async () => {
    const gasFeeInfo = await calculateGasFee({ network });
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

  const handleGetPK = () => {
    if (account.salt !== saltInput) {
      setError("Invalid Password");
      return;
    }
    resetHiddenValues();
    setRevealPrivateKey(decryptItem(account.encPK, account.salt));
    // Get the export private key function
  };

  const handleGetMnemonic = () => {
    if (account.salt !== saltInput) {
      setError("Invalid Password");
      return;
    }
    resetHiddenValues();
    setRevealMnemonic(decryptItem(account.encMnemonic, account.salt));
    // Get the export
  };

  // Generate the key
  const handleSingleImport = () => {
    if (!pKeyRegex.test(inputPrivateKey)) {
      setError("Invalid Private Key");
      return;
    }
    const { publicKey, ethAddress, encPK } = importWithPrivateKeySingle(
      inputPrivateKey,
      account.salt
    );
    if (!publicKey || !ethAddress || !encPK) {
      setError("Error generating account data");
      return;
    }

    const accountObj = generateDefaultAccount({
      publicKey,
      encPK,
      salt: account.salt,
      ethAddress,
      isSet: true,
    });

    setAccountInDict(ethAddress, accountObj);
    setAccount(accountObj);
    resetHiddenValues();
    setImportModalOpen(false);
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
                {account.lastTx ? ( //This needs to be fixed so that it shows the last tx per account, not for network
                  <Card.Description
                    as={Button}
                    href={`${network.chainScan}/tx/${account.lastTx}`} //Need to make it so account[network].lastTx
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
              <Card.Content>
                <Dropdown
                  selection
                  options={networkOptions}
                  value={network.name}
                  onChange={(e, d) => {
                    setNetworkTo(d.value);
                  }}
                ></Dropdown>
              </Card.Content>
            </Card>
            <Card fluid>
              <Card.Content>
                <Card.Header>Account</Card.Header>
              </Card.Content>
              <Card.Content>
                <Dropdown
                  selection
                  options={accountOptions}
                  value={account.address}
                  onChange={(e, d) => {
                    setAccount(accountDict[d.value]);
                  }}
                ></Dropdown>
              </Card.Content>
            </Card>
          </Grid.Column>
          <GridColumn>
            <EthTransaction nonce={nonce} />
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
                  onClose={() => {
                    resetHiddenValues();
                    setRevealModalOpen(false);
                  }}
                  onOpen={() => {
                    resetHiddenValues();
                    setRevealModalOpen(true);
                  }}
                  open={revealModalOpen}
                  size="small"
                  trigger={<Button>Reveal Private Key</Button>}
                >
                  <Modal.Content>
                    <Label basic>Please Enter Your Password</Label>
                    <Input
                      value={saltInput}
                      onChange={(e) => setSaltInput(e.target.value)}
                    />
                    <Button onClick={handleGetPK}>Reveal</Button>
                    {error && <Label>{error}</Label>}
                    {revealPrivateKey && <Label>{revealPrivateKey}</Label>}
                  </Modal.Content>
                </Modal>
                {account.fromMnemonic && (
                  <Modal
                    onClose={() => {
                      resetHiddenValues();
                      setMnemonicModalOpen(false);
                    }}
                    onOpen={() => {
                      resetHiddenValues();
                      setMnemonicModalOpen(true);
                    }}
                    open={mnemonicModalOpen}
                    size="large"
                    trigger={<Button>Reveal Mnemonic</Button>}
                  >
                    <Modal.Content>
                      <Label basic>Please Enter Your Password</Label>
                      <Input
                        value={saltInput}
                        onChange={(e) => setSaltInput(e.target.value)}
                      />
                      <Button onClick={handleGetMnemonic}>Reveal</Button>
                      {error && <Label>{error}</Label>}
                      {revealMnemonic && <Label>{revealMnemonic}</Label>}
                    </Modal.Content>
                  </Modal>
                )}
              </Card.Content>
              <Card.Content>
                <Modal
                  onClose={() => {
                    resetHiddenValues();
                    setImportModalOpen(false);
                  }}
                  onOpen={() => {
                    resetHiddenValues();
                    setImportModalOpen(true);
                  }}
                  open={importModalOpen}
                  size="large"
                  trigger={<Button>Import Address With Private Key</Button>}
                >
                  <Modal.Content>
                    <Label basic>Please Enter Your Private Key</Label>
                    <Input
                      fluid
                      value={inputPrivateKey}
                      onChange={({ target }) =>
                        setInputPrivateKey(target.value)
                      }
                    />
                    <Button onClick={handleSingleImport}>Import</Button>
                    {error && <Label basic>{error}</Label>}
                  </Modal.Content>
                </Modal>
              </Card.Content>
            </Card>
          </GridColumn>
        </Grid.Row>
      </Grid>
    </Card>
  );

  const TokenContent = <ERC20Container nonce={nonce} />;

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
      const response = await fetch(network.node, {
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
  }, [account, network]);

  useEffect(() => {
    async function getNonce() {
      const response = await fetch(network.node, {
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
  }, [account, network]);

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
