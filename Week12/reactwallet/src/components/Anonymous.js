import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Container,
  Modal,
  Header,
  Input,
  Card,
  Label,
} from "semantic-ui-react";
import { MyContext } from "../context/Ctx";
import { generateDefaultAccount, pKeyRegex } from "../helpers/constants.mjs";

import {
  generateCredentialsMulti,
  generateCredentialsSingle,
  importWithPrivateKeySingle,
} from "../helpers/ethUtils.mjs";
import { generateMnemonic } from "../helpers/ethUtils.mjs";

const Anonymous = () => {
  const { setAccount, setAccountInDict, patchAccount } = useContext(MyContext);

  const [openImportSingle, setOpenImportSingle] = useState(false);
  const [openCreateSingle, setOpenCreateSingle] = useState(false);

  const [openImportMulti, setOpenImportMulti] = useState(false);
  const [openCreateMulti, setOpenCreateMulti] = useState(false);

  const [inputPKey, setInputPKey] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [error, setError] = useState("");
  const [salt, setSalt] = useState("");

  const clearFields = () => {
    setError("");
    setInputPKey("");
    setSalt("");
    setMnemonic("");
  };

  return (
    <Container style={{ padding: "1rem" }} fluid textAlign="center">
      <Card fluid>
        <Card.Content>
          <Modal
            onClose={() => {
              clearFields();
              setOpenCreateSingle(false);
            }}
            onOpen={() => {
              clearFields();
              setOpenCreateSingle(true);
            }}
            open={openCreateSingle}
            trigger={<Button>Create Single Account</Button>}
          >
            <Modal.Header>Enter your password</Modal.Header>
            <Modal.Content>
              <Input
                onChange={(e) => setSalt(e.target.value)}
                fluid
                placeholder="p4ssc0d3"
              />
            </Modal.Content>
            <Modal.Actions>
              <Button
                primary
                onClick={() => {
                  if (!salt) {
                    setError("Please input the password");
                    return;
                  }
                  const { publicKey, ethAddress, encPK } =
                    generateCredentialsSingle(salt);

                  const accountObj = generateDefaultAccount({
                    publicKey,
                    encPK,
                    salt,
                    ethAddress,
                    isSet: true,
                  });

                  setAccountInDict(ethAddress, accountObj);
                  patchAccount(accountObj);
                  // setAccount((prev) => ({
                  //   ...prev,
                  //   ...accountObj,
                  // }));
                  clearFields();
                  setOpenCreateSingle(false);
                }}
              >
                Create New
              </Button>
            </Modal.Actions>
          </Modal>
          <Modal
            onClose={() => {
              clearFields();
              setOpenImportSingle(false);
            }}
            onOpen={() => {
              clearFields();
              setOpenImportSingle(true);
            }}
            open={openImportSingle}
            trigger={<Button secondary>Import with Private Key</Button>}
          >
            <Modal.Header>Enter your Private Key and Password</Modal.Header>
            <Modal.Content>
              <Input
                onChange={(e) => setInputPKey(e.target.value)}
                fluid
                placeholder="1234abcd.......abcd01234"
              />
            </Modal.Content>
            <Modal.Content>
              <Input
                onChange={(e) => setSalt(e.target.value)}
                fluid
                placeholder="p4ssc0d3"
              />
            </Modal.Content>
            {error && (
              <Modal.Content>
                <p>{error}</p>
              </Modal.Content>
            )}
            <Modal.Actions>
              <Button
                content="Submit"
                labelPosition="right"
                positive
                icon="checkmark"
                onClick={() => {
                  try {
                    if (!pKeyRegex.test(inputPKey)) {
                      setError("Invalid Key");
                      return;
                    }
                    if (!salt) {
                      setError("No password");
                      return;
                    }
                    const { publicKey, ethAddress, encPK } =
                      importWithPrivateKeySingle(inputPKey, salt);
                    if (!(publicKey && ethAddress)) {
                      setError("Something went wrong. Please Try Again");
                      return;
                    }
                    const accountObj = generateDefaultAccount({
                      publicKey,
                      encPK,
                      salt,
                      ethAddress,
                      isSet: true,
                    });
                    setAccountInDict(ethAddress, accountObj);
                    patchAccount(accountObj);

                    setOpenImportSingle(false);
                    clearFields();
                  } catch (e) {
                    console.log(e);
                  }
                }}
              />
            </Modal.Actions>
          </Modal>
        </Card.Content>
      </Card>
      <Card fluid>
        <Card.Content>
          <Modal
            onClose={() => {
              clearFields();
              setOpenCreateMulti(false);
            }}
            onOpen={() => {
              clearFields();
              setOpenCreateMulti(true);
              setMnemonic(generateMnemonic());
            }}
            open={openCreateMulti}
            trigger={<Button>Create with Mnemonic</Button>}
          >
            <Modal.Header>
              Please save the Mnemonic Phrase and add a Password
            </Modal.Header>
            <Modal.Content>
              <Label>{mnemonic}</Label>
            </Modal.Content>
            <Modal.Content>
              <Input
                onChange={(e) => setSalt(e.target.value)}
                fluid
                placeholder="p4ssc0d3"
              />
            </Modal.Content>
            <Modal.Actions>
              <Button
                primary
                onClick={() => {
                  if (!salt) {
                    setError("Please input the password");
                    return;
                  }
                  const accounts = generateCredentialsMulti(mnemonic, salt);
                  accounts.forEach((acc, i) => {
                    const {
                      publicKey,
                      ethAddress,
                      encPK,
                      fromMnemonic,
                      encMnemonic,
                    } = acc;
                    const accountObj = generateDefaultAccount({
                      publicKey,
                      encPK,
                      salt,
                      ethAddress,
                      isSet: true,
                      fromMnemonic,
                      encMnemonic,
                    });
                    if (i === 0) {
                      // Set the first new account as the current account
                      setAccount(accountObj);
                    }
                    setAccountInDict(ethAddress, accountObj);
                  });
                  setOpenCreateMulti(false);
                  clearFields();
                }}
              >
                Create Accounts
              </Button>
            </Modal.Actions>
          </Modal>
          <Modal
            onClose={() => {
              clearFields();
              setOpenImportMulti(false);
            }}
            onOpen={() => {
              clearFields();
              setOpenImportMulti(true);
            }}
            open={openImportMulti}
            trigger={<Button secondary>Import from Mnemonic</Button>}
          >
            <Modal.Header>
              Please enter your Mnemonic Phrase and Password
            </Modal.Header>
            <Modal.Content>
              <Input
                fluid
                placeholder="firstword secondword thirdword..."
                onChange={(e) => setMnemonic(e.target.value)}
              />
            </Modal.Content>
            <Modal.Content>
              <Input
                fluid
                placeholder="p4ssc0d3"
                onChange={(e) => setSalt(e.target.value)}
              />
            </Modal.Content>
            <Modal.Actions>
              <Button
                primary
                onClick={() => {
                  if (!salt) {
                    setError("Please input the password");
                    return;
                  }
                  if (!mnemonic) {
                    setError("Please input the mnemonic");
                    return;
                  }
                  const accounts = generateCredentialsMulti(mnemonic, salt);
                  accounts.forEach((acc, i) => {
                    const {
                      publicKey,
                      ethAddress,
                      encPK,
                      fromMnemonic,
                      encMnemonic,
                    } = acc;
                    const accountObj = generateDefaultAccount({
                      publicKey,
                      encPK,
                      salt,
                      ethAddress,
                      isSet: true,
                      fromMnemonic,
                      encMnemonic,
                    });
                    if (i === 0) {
                      // Set the first new account as the current account
                      setAccount(accountObj);
                    }
                    setAccountInDict(ethAddress, accountObj);
                  });
                  setOpenImportMulti(false);
                  clearFields();
                }}
              >
                Import Accounts
              </Button>
            </Modal.Actions>
          </Modal>
        </Card.Content>
      </Card>
    </Container>
  );
};

export default Anonymous;
