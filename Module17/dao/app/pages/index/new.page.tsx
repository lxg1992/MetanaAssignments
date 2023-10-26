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
    // const asyncAction = async () => {};
    // asyncAction();
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
  }, [cxLoading]);

  const handleFunctionChange = (e: any) => {
    const { value } = e.target;
    const selected = mutators.find((x) => x.name === value);
    setSelection(selected);
    setFormData({});
    // getDefaultValuesInputs(selected.inputs);
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
    // if (checked || !checked) {
    //   //THIS IS WHERE THE ERROR IS, IT HAS TO CHECK IF IT'S NOT CHECKED
    //   if (subsection) {
    //     setFormData({
    //       ...formData,
    //       [subsection]: { ...formData[subsection], [e.target.name]: checked },
    //     });
    //     return;
    //   }
    //   setFormData({ ...formData, [e.target.name]: checked });
    // }
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
      // const val = deriveDefaultVal(input.name, subsection);
      return (
        <Input
          placeholder={`${input.name} - ${input.type} - Separate values by comma`}
          onChange={(e) => handleInputChange(e, subsection)}
          name={input.name}
          // value={val}
          m={2}
          type={"text"}
        />
      );
    }

    //TODO: Prevent re-renders when defaulting state variables
    if (input.type.includes("bool")) {
      // const val = deriveDefaultBool(input.name, subsection);
      return (
        // <Flex
        //   marginTop={2}
        //   border="1px"
        //   borderColor="gray.200"
        //   borderRadius="5px"
        // >

        <Select
          m={2}
          onChange={(e) => handleInputChange(e, subsection)}
          name={input.name}
          placeholder={input.name}
        >
          <option value="true">True</option>
          <option value="false">False</option>
        </Select>
        // </Flex>
      );
    }
    return (
      <Input
        placeholder={`${input.name} - ${input.type}`}
        onChange={(e) => handleInputChange(e, subsection)}
        name={input.name}
        m={2}
        type={input.type.includes("int") ? "number" : "text"}
        // value={
        //   input.type.includes("int")
        //     ? deriveDefaultNum(input.name, subsection)
        //     : deriveDefaultVal(input.name, subsection)
        // }
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
        return input.components.map((component) => {
          return getDefaultValue(initObj, component, input.name);
        });
      }

      if (input.type.includes("[]")) {
        if (subsection) {
          return {
            ...initObj,
            [subsection]: { ...initObj[subsection], [input.name]: [] },
          };
          return setFormData((formData) => ({
            ...formData,
            [subsection]: { ...formData[subsection], [input.name]: [] },
          }));
        }
        return { ...initObj, [input.name]: [] };
        return setFormData((formData) => ({
          ...formData,
          [input.name]: [],
        }));
      }

      if (input.type.includes("bool")) {
        if (subsection) {
          return {
            ...initObj,
            [subsection]: { ...initObj[subsection], [input.name]: false },
          };
          return setFormData((formData) => ({
            ...formData,
            [subsection]: { ...formData[subsection], [input.name]: false },
          }));
        }
        return { ...initObj, [input.name]: false };
        return setFormData((formData) => ({
          ...formData,
          [input.name]: false,
        }));
      }

      if (input.type.includes("int")) {
        if (subsection) {
          return {
            ...initObj,
            [subsection]: { ...initObj[subsection], [input.name]: 0 },
          };
          return setFormData((formData) => ({
            ...formData,
            [subsection]: { ...formData[subsection], [input.name]: 0 },
          }));
        }
        return { ...initObj, [input.name]: 0 };
        return setFormData((formData) => ({
          ...formData,
          [input.name]: 0,
        }));
      }

      if (subsection) {
        return {
          ...initObj,
          [subsection]: { ...initObj[subsection], [input.name]: "" },
        };
        return setFormData((formData) => ({
          ...formData,
          [subsection]: { ...formData[subsection], [input.name]: "" },
        }));
      }
      return { ...initObj, [input.name]: "" };

      return setFormData((formData) => ({
        ...formData,
        [input.name]: "",
      }));
    },
    [selection]
  );

  const deriveDefaultVal = (inputName, subsection = null) => {
    if (subsection) {
      if (formData[subsection]) {
        return formData[subsection][inputName];
      }
      return "";
    }
    if (formData[inputName]) {
      return formData[inputName];
    }
    return "";
  };

  const deriveDefaultBool = (inputName, subsection = null) => {
    if (subsection) {
      //TODO: FIX BOOLEAN ISSUE NOT REGISTERING I NSUBSECTION
      if (formData[subsection]) {
        return Boolean(formData[subsection][inputName]);
      }
      return false;
    }
    if (formData[inputName] !== null) {
      console.log("true");
      return Boolean(formData[inputName]);
    }
    console.log("false");
    return false;
  };
  //TODO: default bool stays false, should be changeable

  const deriveDefaultNum = (inputName, subsection = null) => {
    if (subsection) {
      if (formData[subsection]) {
        return parseInt(formData[subsection][inputName]);
      }
      // return 0;
    }
    if (formData[inputName]) {
      return parseInt(formData[inputName]);
    }
    // return 0;
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
      <Box>{JSON.stringify(formData, null, "\n")}</Box>
    </Box>
  );
  //TODO: Create a set of inputs that will be used to call the function

  return selectionComponent;
}
