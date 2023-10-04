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
  Checkbox,
  InputGroup,
  Stack,
  StackDivider,
  VStack,
  Flex,
} from "@chakra-ui/react";
import { useConnection } from "../../hooks/blockchain.ts";

import { fetchReadContract, fetchWriteContract } from "../../utils/contract.ts";
import { Contract } from "ethers";
import { useMetaMask } from "metamask-react";
import { titleCase } from "../../utils/str.ts";
import { StringLiteral } from "typescript";
export { Page };

function Page({ box, governorContract }) {
  const { status, connect, account, chainId, ethereum, switchChain } =
    useMetaMask();
  const { provider, signer, cxLoading } = useConnection(account);

  const [wBox, setWBox] = useState<Contract | undefined>(undefined);
  const [wGovernor, setWGovernor] = useState<Contract | undefined>(undefined);

  const [mutators, setMutators] = useState<any>(undefined); // Functions that can mutate state
  const [selection, setSelection] = useState<any>(undefined); //DDL selected function
  const [formData, setFormData] = useState<any>({}); //Form data to be used to call function

  useEffect(() => {
    if (cxLoading) return;
    const mutFuncs = box.abi.filter((x) => x.stateMutability === "nonpayable");
    console.log({ mutFuncs });
    setMutators(mutFuncs);
    // const asyncAction = async () => {};
    // asyncAction();
  }, [cxLoading]);

  useEffect(() => {
    if (cxLoading) return;
    const asyncAction = async () => {
      const wBox = fetchWriteContract(box, signer);
      const wGovernor = fetchWriteContract(governorContract, signer);
      setWBox(wBox);
      setWGovernor(wGovernor);
    };
    asyncAction();
  }, [cxLoading]);

  const handleFunctionChange = (e: any) => {
    const { value } = e.target;
    const selected = mutators.find((x) => x.name === value);
    setSelection(selected);
    setFormData({});
  };

  const handleInputChange = (e: any, subsection: string | null) => {
    console.log({ e });
    const { value, checked } = e.target;
    if (value) {
      if (subsection) {
        setFormData({
          ...formData,
          [subsection]: { ...formData[subsection], [e.target.name]: value },
        });
        return;
      }
      setFormData({ ...formData, [e.target.name]: value });
    }
    if (checked || !value) {
      if (subsection) {
        setFormData({
          ...formData,
          [subsection]: { ...formData[subsection], [e.target.name]: checked },
        });
        return;
      }
      setFormData({ ...formData, [e.target.name]: checked });
    }
  };

  console.log({ selection });

  const renderInputs = (arrayOfInputs) => {
    console.log({ arrayOfInputs });
    return arrayOfInputs.map((input) => {
      return renderInput(input);
    });
  };

  const renderInput = (input, subsection = null) => {
    //formData[subsection?]= this;
    if (input.type.includes("tuple")) {
      console.log({ input });
      // return <Input placeholder={input.type} />;
      //TODO: Create a form for the tuple, needs to handle nested data
      return (
        <Flex alignItems="flex-start">
          <Text p={4}>{input.name}</Text>
          {input.components.map((component) => {
            return renderInput(component, input.name);
          })}
        </Flex>
      );
    }

    if (input.type.includes("[]")) {
      return (
        <Input
          placeholder={`${input.name} - ${input.type} - Separate values by comma`}
          onChange={(e) => handleInputChange(e, subsection)}
          name={input.name}
          m={2}
          type={input.type.includes("int") ? "number" : "text"}
        />
      );
    }
    if (input.type.includes("bool")) {
      return (
        <Flex
          marginTop={2}
          border="1px"
          borderColor="gray.200"
          borderRadius="5px"
        >
          <Text m={2}>{input.name}?</Text>
          <Checkbox
            m={2}
            onChange={(e) => handleInputChange(e, subsection)}
            name={input.name}
          ></Checkbox>
        </Flex>
      );
    }
    return (
      <Input
        placeholder={`${input.name} - ${input.type}`}
        onChange={(e) => handleInputChange(e, subsection)}
        name={input.name}
        m={2}
        type={input.type.includes("int") ? "number" : "text"}
      />
    );
  };

  if (!mutators) {
    return <Box>No available functions!</Box>;
  }

  const selectionComponent = (
    <Box>
      <Heading p={6}>Select Function to Call</Heading>
      <Text>Function selected: {selection ? selection.name : "none"}</Text>
      <Select
        p={6}
        iconColor="white"
        onChange={handleFunctionChange}
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
          <FormControl>
            <VStack divider={<StackDivider />}>
              {renderInputs(selection.inputs)}
            </VStack>
          </FormControl>
        </>
      ) : (
        <Box>No inputs</Box>
      )}
      <Box>{JSON.stringify(formData)}</Box>
    </Box>
  );
  //TODO: Create a set of inputs that will be used to call the function

  return selectionComponent;
}
