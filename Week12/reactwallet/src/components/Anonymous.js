import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Container,
  Modal,
  Header,
  Input,
  Card,
} from "semantic-ui-react";
import { MyContext } from "../context/Ctx";
import { pKeyRegex } from "../helpers/constants.mjs";

import {
  generateCredentialsSingle,
  importWithPrivateKeySingle,
} from "../helpers/ethUtils.mjs";

const Anonymous = () => {
  const { account, setAccount, setAccountInDict } = useContext(MyContext);

  const [openImportSingle, setOpenImportSingle] = useState(false);
  const [openCreateSingle, setOpenCreateSingle] = useState(false);

  const [openImportMulti, setOpenImportMulti] = useState(false);
  const [openCreateMulti, setOpenCreateMulti] = useState(false);

  const [inputPKey, setInputPKey] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [error, setError] = useState("");
  const [salt, setSalt] = useState("");

  return (
    <Container style={{ padding: "1rem" }} fluid textAlign="center">
      <Card fluid>
        <Card.Content>
          <Modal
            onClose={() => {
              setError("");
              setOpenCreateSingle(false);
            }}
            onOpen={() => {
              setError("");
              setOpenCreateSingle(true);
            }}
            open={openCreateSingle}
            trigger={<Button>Create Single</Button>}
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
                  }
                  const { publicKey, ethAddress, encPK } =
                    generateCredentialsSingle(salt);

                  const accountObj = {
                    isSet: true,
                    publicKey,
                    encPK,
                    salt,
                    address: ethAddress,
                  };
                  setAccountInDict(ethAddress, accountObj);

                  setAccount((prev) => ({
                    ...prev,
                    ...accountObj,
                  }));
                  setOpenCreateSingle(false);
                  setError("");
                }}
              >
                Create New
              </Button>
            </Modal.Actions>
          </Modal>
          <Modal
            onClose={() => {
              setError("");
              setOpenImportSingle(false);
            }}
            onOpen={() => {
              setError("");
              setOpenImportSingle(true);
            }}
            open={openImportSingle}
            trigger={<Button secondary>Import Single</Button>}
          >
            <Modal.Header>Enter your Private Key and Password</Modal.Header>
            <Modal.Content>
              <Input
                onChange={(e) => setInputPKey(e.target.value)}
                fluid
                placeholder="1234abcd.......abcd01234"
              />
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
                color="black"
                onClick={() => {
                  setInputPKey("");
                  setSalt("");
                  setOpenImportSingle(false);
                }}
              >
                Cancel
              </Button>
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
                    }
                    // const { publicKey, privateKey, ethAddress } =
                    const { publicKey, ethAddress, encPK } =
                      importWithPrivateKeySingle(inputPKey, salt);
                    if (!(publicKey && ethAddress)) {
                      setError("Something went wrong. Please Try Again");
                      return;
                    }

                    const accountObj = {
                      isSet: true,
                      publicKey,
                      encPK,
                      salt,
                      address: ethAddress,
                      lastTx: "",
                      ERC20Contracts: {
                        mainnet: {},
                        sepolia: {},
                        goerli: {},
                      },
                    };

                    setAccountInDict(ethAddress, accountObj);
                    // At this point we can see that import is fine
                    setAccount((prev) => ({
                      ...prev,
                      ...accountObj,
                    }));

                    setOpenImportSingle(false);
                    setError("");
                  } catch (e) {
                    console.log(e);
                  }
                }}
              />
            </Modal.Actions>
          </Modal>
        </Card.Content>
      </Card>
    </Container>
  );
};

export default Anonymous;
