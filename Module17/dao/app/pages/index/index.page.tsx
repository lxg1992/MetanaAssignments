import { Container, Text, Button, Box, Flex, Card } from "@chakra-ui/react";
import { useMetaMask } from "metamask-react";
import { Contract } from "ethers";
import { useEffect, useState } from "react";

import { ProposalDashboard } from "../../components/ProposalDashboard.tsx";
import { PageProps } from "../../renderer/types.ts";
import { fetchReadContract, fetchWriteContract } from "../../utils/contract.ts";
import { useConnection } from "../../hooks/blockchain.ts";
import { Profile } from "../../components/Profile.tsx";
export { Page };

function Page(pageProps: PageProps) {
  const { governanceToken, governorContract, timeLock } = pageProps;
  const { status, connect, account, chainId, ethereum, switchChain } =
    useMetaMask();
  const { provider, signer, userAddress, cxLoading } = useConnection();
  const [rCToken, setRCToken] = useState<Contract | undefined>(undefined); //read contract token
  const [wCToken, setWCToken] = useState<Contract | undefined>(undefined); //write contract token

  useEffect(() => {
    const asyncAction = async () => {
      if (!cxLoading) {
        const readToken = fetchReadContract(
          governanceToken.address,
          governanceToken.abi,
          provider
        );
        setRCToken(readToken);
        const writeToken = fetchWriteContract(
          governanceToken.address,
          governanceToken.abi,
          signer
        );
        setWCToken(writeToken);
        const bal = await readToken.balanceOf(userAddress);
        console.log({ bal });
      }
    };
    asyncAction();
  }, [cxLoading, provider, signer]);

  if (status === "unavailable") return <Text>MetaMask is not installed</Text>;

  if (status === "initializing") return <Text>Initializing...</Text>;

  if (status === "notConnected")
    return <Button onClick={connect}>Connect to Metamask</Button>;

  if (status === "connecting") return <Text>Connecting...</Text>;

  if (status === "connected") {
    console.log({ account, chainId, ethereum });
    if (pageProps.mode === "goerli" && chainId !== "0x5") {
      console.log("PROD: Not Goerli");
      return (
        <Box>
          <Button onClick={() => switchChain("0x5")}>
            Switch to Goerli Network
          </Button>
        </Box>
      );
    } else if (pageProps.mode === "hardhat" && chainId !== "0x7a69") {
      console.log("DEV: Not local");
      return (
        <Box>
          <Button onClick={() => switchChain("0x7a69")}>
            Switch to Hardhat Network (Local)
          </Button>
        </Box>
      );
    }

    return (
      <Flex>
        <Card>
          <ProposalDashboard />
        </Card>
        <Card>
          <Profile />
        </Card>
      </Flex>
    );
  }

  return <Text>Metamask Error</Text>;
}
