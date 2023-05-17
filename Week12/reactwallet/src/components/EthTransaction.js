import React, { useContext, useState } from "react";

import { MyContext } from "../context/Ctx";
import {
  generateTxData,
  generateSendRawTxPayload,
  decryptItem,
  calculateGasFee,
} from "../helpers/ethUtils.mjs";
import { ethAddressRegex, hexaDecimalRegex } from "../helpers/constants.mjs";
import { Button, Card, Input, Icon } from "semantic-ui-react";
// local

const EthTransaction = ({ nonce }) => {
  const { account, setAccount, network } = useContext(MyContext);
  const [to, setTo] = useState("");
  const [value, setValue] = useState("");
  const [data, setData] = useState("");
  const [overriddenGasLimit, setOverriddenGasLimit] = useState("");
  // const [overriddenGasPrice, setOverriddenGasPrice] = useState("");
  const [estimatedGasLimit, setEstimatedGasLimit] = useState("");
  const [isEstimated, setIsEstimated] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const handleToChange = (event) => {
    setIsEstimated(false);
    setTo(event.target.value);
    checkValidity();
  };

  const handleValueChange = (event) => {
    setIsEstimated(false);
    setValue(event.target.value);
    checkValidity();
  };

  const handleDataChange = (event) => {
    setIsEstimated(false);
    setData(event.target.value);
    checkValidity();
  };

  const handleOverriddenGasLimitChange = (event) => {
    // setIsEstimated(false);
    setOverriddenGasLimit(event.target.value);
  };

  // const handleOverriddenGasPriceChange = (event) => {
  //   // setIsEstimated(false);
  //   setOverriddenGasPrice(event.target.value);
  // };

  const checkValidity = () => {
    setIsValid(false);
    let toRef;
    clearTimeout(toRef);
    toRef = setTimeout(() => {
      if (
        checkToValidity() &&
        checkValueValidity() &&
        checkDataValidity() &&
        checkOverriddenGasLimitValidity()
      ) {
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    }, 2000);
  };

  const checkToValidity = () => {
    return ethAddressRegex.test(to);
  };

  const checkValueValidity = () => {
    return !isNaN(value) || value === "";
  };

  //regex for 0x hex string for evm function signature

  const checkDataValidity = () => {
    return (
      data === "" ||
      (hexaDecimalRegex.test(data) &&
        data.length % 2 === 0 &&
        data.length >= 10)
    );
  };

  const checkOverriddenGasLimitValidity = () => {
    return overriddenGasLimit === "" || !isNaN(overriddenGasLimit);
  };

  const handleEstimate = async () => {
    try {
      const gasPrice = await calculateGasFee({ network });
      const txData = await generateTxData(nonce, to, value, data, gasPrice);
      const response = await fetch(network.node, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_estimateGas",
          params: [txData],
          id: 1,
        }),
      });

      const returnData = await response.json();
      if (returnData.error) {
        console.error(returnData.error);
        throw new Error(returnData.error.message);
      }
      const intGasLimit = parseInt(returnData.result, 16);
      setIsEstimated(true);
      setEstimatedGasLimit(intGasLimit);
      return intGasLimit;
    } catch (e) {
      console.error(e);
      throw new Error(e);
    }
  };

  const handleSubmit = async () => {
    const gasPrice = await calculateGasFee({ network });
    const gasLimit = overriddenGasLimit
      ? overriddenGasLimit
      : estimatedGasLimit;
    const txData = await generateTxData(
      nonce,
      to,
      value,
      data,
      gasPrice,
      gasLimit
    );
    const pk = decryptItem(account.encPK, account.salt);
    const signedPayload = generateSendRawTxPayload(txData, pk, network.name);
    const response = await fetch(network.node, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_sendRawTransaction",
        params: ["0x" + signedPayload],
        id: 1,
      }),
    });

    const returnData = await response.json();
    if (returnData.error) {
      console.error(returnData.error);
      throw new Error(returnData.error.message);
    }
    setAccount((prevState) => ({ ...prevState, lastTx: returnData.result }));
    console.log(returnData.result);
    return returnData.result;
  };

  return (
    <Card fluid color={isValid ? "green" : "red"}>
      <Card.Content>
        <Card.Header>Send Tx </Card.Header>
        <Card.Description>
          Transaction Valid?{" "}
          {isValid ? <Icon name="checkmark" /> : <Icon name="close" />}
        </Card.Description>
        <Card.Meta> To:</Card.Meta>
        <Card.Content>
          <Input
            type="text"
            value={to}
            onChange={handleToChange}
            placeholder={"0x123456...abcdef"}
          />
        </Card.Content>
        <Card.Meta>Value (ETH):</Card.Meta>
        <Card.Content>
          <Input
            type="text"
            value={value}
            onChange={handleValueChange}
            placeholder={"0.1234"}
          />
        </Card.Content>
        <Card.Meta>Data:</Card.Meta>
        <Card.Content>
          <Input value={data} onChange={handleDataChange} placeholder="0x" />
        </Card.Content>
        {isEstimated && isValid && (
          <>
            <Card.Content>
              <Card.Meta>Estimated Gas Limit:</Card.Meta>
              <Card.Description>{estimatedGasLimit}</Card.Description>
            </Card.Content>
            <Card.Meta>Overridde Gas Limit:</Card.Meta>
            <Card.Content>
              <Input
                value={overriddenGasLimit}
                onChange={handleOverriddenGasLimitChange}
                placeholder="21000"
              />
            </Card.Content>
          </>
        )}
        {isEstimated && isValid ? (
          <Button secondary onClick={handleSubmit}>
            Submit
          </Button>
        ) : (
          <Button disabled={!isValid} onClick={handleEstimate}>
            Estimate
          </Button>
        )}
      </Card.Content>
    </Card>
  );
};

export default EthTransaction;
