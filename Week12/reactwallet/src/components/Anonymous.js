import React, { useState, useEffect, useContext } from "react";
import { Button, Container, Modal, Header, Input } from "semantic-ui-react";
import { MyContext } from "../context/Ctx";

import {
  generateCredentials,
  importWithPrivateKey,
} from "../scripts/ethUtils.mjs";

const pKeyRegex = /[0-9a-f]{64}/i;

const Anonymous = () => {
  const { setAccount } = useContext(MyContext);

  const [open, setOpen] = useState(false);
  const [inputPKey, setInputPKey] = useState("");
  const [error, setError] = useState("");

  return (
    <Container fluid textAlign="center">
      <Button
        primary
        onClick={() => {
          const { publicKey, privateKey, ethAddress } = generateCredentials();
          setAccount({
            isSet: true,
            priKey: privateKey,
            pubKey: publicKey,
            address: ethAddress,
          });
        }}
      >
        Create New
      </Button>
      <Modal
        onClose={() => {
          setError("");
          setOpen(false);
        }}
        onOpen={() => {
          setError("");
          setOpen(true);
        }}
        open={open}
        trigger={<Button secondary>Import</Button>}
      >
        <Modal.Header>Enter your Private Key</Modal.Header>
        <Modal.Content>
          <Input
            onChange={(e) => setInputPKey(e.target.value)}
            fluid
            placeholder="1234abcd.......abcd01234"
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
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            content="Submit"
            labelPosition="right"
            icon="checkmark"
            onClick={() => {
              try {
                if (!pKeyRegex.test(inputPKey)) {
                  setError("Invalid Key");
                  return;
                }
                // const { publicKey, privateKey, ethAddress } =
                const { publicKey, privateKey, ethAddress } =
                  importWithPrivateKey(inputPKey);
                if (!(publicKey && privateKey && ethAddress)) {
                  setError("Something went wrong. Please Try Again");
                  return;
                }

                // At this point we can see that import is fine
                setAccount({
                  isSet: true,
                  priKey: privateKey,
                  pubKey: publicKey,
                  address: ethAddress,
                });

                setError("");
                setOpen(false);
              } catch (e) {
                console.log(e);
              }
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    </Container>
  );
};

export default Anonymous;
