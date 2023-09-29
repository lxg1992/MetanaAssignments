import { useEffect, useState } from "react";
import {
  Box,
  Select,
  Heading,
  Text,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import { useConnection } from "../../hooks/blockchain.ts";

import { fetchReadContract, fetchWriteContract } from "../../utils/contract.ts";
import { Contract } from "ethers";
import { useMetaMask } from "metamask-react";
import { titleCase } from "../../utils/str.ts";
export { Page };

function Page({ box: { abi } }) {
  const { status, connect, account, chainId, ethereum, switchChain } =
    useMetaMask();
  const { provider, signer, cxLoading } = useConnection(account);

  const [mutators, setMutators] = useState<any>(undefined); // Functions that can mutate state
  const [selection, setSelection] = useState<any>(undefined); //DDL selected function

  useEffect(() => {
    if (cxLoading) return;
    const mutFuncs = abi.filter((x) => x.stateMutability === "nonpayable");
    console.log({ mutFuncs });
    setMutators(mutFuncs);
    // const asyncAction = async () => {};
    // asyncAction();
  }, [cxLoading]);

  const handleChange = (e: any) => {
    const { value } = e.target;
    const selected = mutators.find((x) => x.name === value);
    setSelection(selected);
  };

  console.log({ selection });

  const deriveInputs = (arrayOfInputs) => {
    console.log({ arrayOfInputs });
    return arrayOfInputs.map((input) => {
      return deriveInput(input);
    });
  };

  const deriveInput = (input) => {
    if (input.type.includes("tuple")) {
      // return <Input placeholder={input.type} />;
      return input.components.map((component) => {
        return deriveInput(component);
      });
    }
    if (input.type.includes("[]")) {
      return (
        <Input
          placeholder={`${input.name} - ${input.type} - Separate values by comma`}
        />
      );
    }
    return <Input placeholder={`${input.name} - ${input.type}`} />;
  };

  if (!mutators) {
    <Box>No available functions!</Box>;
  }

  const selectionComponent = (
    <Box>
      <Heading p={6}>Select Function to Call</Heading>
      <Text>Function selected: {selection ? selection.name : "none"}</Text>
      <Select
        p={6}
        iconColor="white"
        onChange={handleChange}
        placeholder="Select action"
      >
        {mutators &&
          mutators.map((func: { name: string }) => {
            return (
              <option value={func?.name} key={func?.name}>
                {titleCase(func?.name)}
              </option>
            );
          })}
      </Select>
      {selection && selection.inputs.length ? (
        <>
          <Box>{selection.inputs.length}</Box>
          <FormControl>{deriveInputs(selection.inputs)}</FormControl>
        </>
      ) : (
        <Box>No inputs</Box>
      )}
    </Box>
  );
  //TODO: Create a set of inputs that will be used to call the function

  return selectionComponent;
}
