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

import {
  generateCredentials,
  importWithPrivateKey,
} from "../helpers/ethUtils.mjs";

const pKeyRegex = /[0-9a-f]{64}/i;

const Anonymous = () => {
  const { setAccount } = useContext(MyContext);

  const [openImport, setOpenImport] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [inputPKey, setInputPKey] = useState("");
  const [error, setError] = useState("");
  const [salt, setSalt] = useState("");

  return (
    <Container style={{ padding: "1rem" }} fluid textAlign="center">
      <Card fluid>
        <Card.Content>
          <Modal
            onClose={() => {
              setError("");
              setOpenCreate(false);
            }}
            onOpen={() => {
              setError("");
              setOpenCreate(true);
            }}
            open={openCreate}
            trigger={<Button>Create</Button>}
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
                  const { publicKey, privateKey, ethAddress, encPK } =
                    generateCredentials(salt);
                  setAccount((prev) => ({
                    ...prev,
                    isSet: true,
                    // privateKey: privateKey,
                    publicKey: publicKey,
                    address: ethAddress,
                    encPK,
                    salt,
                  }));
                  setOpenCreate(false);
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
              setOpenImport(false);
            }}
            onOpen={() => {
              setError("");
              setOpenImport(true);
            }}
            open={openImport}
            trigger={<Button secondary>Import</Button>}
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
                  setOpenImport(false);
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
                    const { publicKey, privateKey, ethAddress, encPK } =
                      importWithPrivateKey(inputPKey, salt);
                    if (!(publicKey && ethAddress)) {
                      setError("Something went wrong. Please Try Again");
                      return;
                    }

                    // At this point we can see that import is fine
                    setAccount((prev) => ({
                      ...prev,
                      isSet: true,
                      // privateKey: privateKey,
                      publicKey: publicKey,
                      address: ethAddress,
                      encPK,
                      salt,

                      //account should have a salted-hash
                      //if salt is provided, then ask for it, if not then default hash
                    }));

                    setOpenImport(false);
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
