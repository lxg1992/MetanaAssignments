import { useEffect, useState } from "react";
import {
  Box,
  Select,
  Heading,
  Text,
  NumberInputStepper,
} from "@chakra-ui/react";
import { useConnection } from "../../hooks/blockchain.ts";
import { fetchReadContract, fetchWriteContract } from "../../utils/contract.ts";
import { Contract } from "ethers";
import { useMetaMask } from "metamask-react";
export { Page };

function Page({ box: { abi } }) {
  const { status, connect, account, chainId, ethereum, switchChain } =
    useMetaMask();
  const { provider, signer, cxLoading } = useConnection(account);

  const [mutators, setMutators] = useState<any>(undefined);
  const [selection, setSelection] = useState<any>(undefined);

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

  if (!mutators) {
    <Box>No available functions!</Box>;
  }

  const selectionComponent = (
    <Box>
      <Heading p={6}>Select Function to Call</Heading>
      <Text>Current selection: {selection ? selection.name : "none"}</Text>
      <Select
        p={6}
        iconColor="white"
        onChange={handleChange}
        placeholder="Select function"
      >
        {mutators &&
          mutators.map((func) => {
            return <option value={func.name}>{func.name}</option>;
          })}
      </Select>
      {selection && selection.inputs.length ? (
        <Box>{selection.inputs.length}</Box>
      ) : (
        <Box>No inputs</Box>
      )}
    </Box>
  );
  //TODO: Create a set of inputs that will be used to call the function

  return selectionComponent;
}
