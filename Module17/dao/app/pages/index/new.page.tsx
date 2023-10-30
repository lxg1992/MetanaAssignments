import { useCallback, useEffect, useState, useRef } from "react";
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
  Button,
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
  const formDataRef = useRef(formData);

  //TODO: Refactor the function to use formDataRef.current instead of a random object which creates reference issues

  useEffect(() => {
    if (cxLoading) return;
    const mutFuncs = box.abi.filter((x) => x.stateMutability === "nonpayable");
    console.log({ mutFuncs });
    setMutators(mutFuncs);
  }, [cxLoading]);

  useEffect(() => {
    //TODO: Create a function that will set the default values for the inputs
    if (selection) {
      setFormData(getDefaultValuesInputs(selection.inputs));
    }
  }, [selection]);

  useEffect(() => {
    if (cxLoading) return;
    const wBox = fetchWriteContract(box.address, box.abi, signer);
    const wGovernor = fetchWriteContract(
      governorContract.address,
      governorContract.abi,
      signer
    );
    setWBox(wBox);
    setWGovernor(wGovernor);
  }, [cxLoading, signer]);

  const handleFunctionChange = (e: any) => {
    const { value } = e.target;
    const selected = mutators.find((x) => x.name === value);
    setSelection(selected);
    setFormData({});
  };

  const splitStringIntoArray = (str: string) => {
    return str.split(",");
  };

  const splitNumbersIntoArray = (numStr: string) => {
    return numStr.split(",").map((x) => parseInt(x));
  };

  const commaDigitsRegex = /^[-,0-9]+$/;
  const commaStringRegex = /^[-,a-zA-Z0-9]+$/;

  const handleInputChange = (e: any, subsection: string | null) => {
    console.log({ e });
    const { value } = e.target;
    console.log({ value });
    if (value) {
      if (subsection) {
        setFormData((formData) => ({
          ...formData,
          [subsection]: { ...formData[subsection], [e.target.name]: value },
        }));
        return;
      }
      setFormData((formData) => ({ ...formData, [e.target.name]: value }));
      return;
    }

  };

  const renderInputs = useCallback(
    (arrayOfInputs) => {
      return arrayOfInputs.map((input) => {
        return renderInput(input);
      });
    },
    [selection]
  );

  const renderInput = useCallback((input, subsection = null) => {
    //formData[subsection?]= this;
    if (input.type.includes("tuple")) {
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
          type={"text"}
        />
      );
    }

    //TODO: Prevent re-renders when defaulting state variables
    if (input.type.includes("bool")) {
      return (

        <Select
          m={2}
          onChange={(e) => handleInputChange(e, subsection)}
          name={input.name}
          placeholder={input.name}
        >
          <option value="true">True</option>
          <option value="false">False</option>
        </Select>
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
  }, []);

  const getDefaultValuesInputs = useCallback(
    (arrayOfInputs) => {
      return arrayOfInputs.reduce((initObj, input) => {
        return getDefaultValue(initObj, input);
      }, formDataRef.current);
    },
    [selection]
  );

  const getDefaultValue = useCallback(
    (initObj, input, subsection = null) => {
      if (input.type.includes("tuple")) {
        return input.components.reduce((initObj, component) => {
          return getDefaultValue(initObj, component, input.name);
        }, initObj);
      }

      if (input.type.includes("[]")) {
        if (subsection) {
          return {
            ...initObj,
            [subsection]: { ...initObj[subsection], [input.name]: [] },
          };
        }
        return { ...initObj, [input.name]: [] };
      }

      if (input.type.includes("bool")) {
        if (subsection) {
          return {
            ...initObj,
            [subsection]: { ...initObj[subsection], [input.name]: false },
          };
        }
        return { ...initObj, [input.name]: false };
      }

      if (input.type.includes("int")) {
        if (subsection) {
          return {
            ...initObj,
            [subsection]: { ...initObj[subsection], [input.name]: 0 },
          };
        }
        return { ...initObj, [input.name]: 0 };
      }

      if (subsection) {
        return {
          ...initObj,
          [subsection]: { ...initObj[subsection], [input.name]: "" },
        };
      }
      return { ...initObj, [input.name]: "" };
    },
    [selection]
  );

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
              <Button>Propose Change</Button>

            </VStack>
          </FormControl>
        </>
      ) : (
        <Box>No inputs</Box>
      )}
      <Box>{JSON.stringify(formData, null, "\n")}</Box>
    </Box>
  );
  //TODO: Create a set of inputs that will be used to call the function

  return selectionComponent;
}
