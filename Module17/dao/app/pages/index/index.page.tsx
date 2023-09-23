import { Box, Button, Grid, GridItem, Text } from "@chakra-ui/react";
import { Contract, EventLog, Log } from "ethers";
import { useMetaMask } from "metamask-react";
import { useEffect, useState } from "react";

import { EventFeed } from "../../components/EventFeed.tsx";
import { Profile } from "../../components/Profile.tsx";
import { ProposalDashboard } from "../../components/ProposalDashboard.tsx";
import { useConnection } from "../../hooks/blockchain.ts";
import { PageProps } from "../../renderer/types.ts";
import { fetchReadContract, fetchWriteContract } from "../../utils/contract.ts";

export { Page };

function Page(pageProps: PageProps) {
  const {
    governanceToken,
    governorContract,
    timeLock,
    box,
  }: {
    governanceToken: any;
    governorContract: any;
    timeLock: any;
    box: any;
  } = pageProps;
  const { status, connect, account, chainId, ethereum, switchChain } =
    useMetaMask();

  const { provider, signer, cxLoading } = useConnection(account);

  const [rToken, setRToken] = useState<Contract | undefined>(undefined);
  const [wToken, setWToken] = useState<Contract | undefined>(undefined);
  const [rGovernor, setRGovernor] = useState<Contract | undefined>(undefined);
  const [wGovernor, setWGovernor] = useState<Contract | undefined>(undefined);
  const [rTimeLock, setRTimeLock] = useState<Contract | undefined>(undefined);
  const [wTimeLock, setWTimeLock] = useState<Contract | undefined>(undefined);
  const [rBox, setRBox] = useState<Contract | undefined>(undefined);
  const [wBox, setWBox] = useState<Contract | undefined>(undefined);
  const [govEvents, setGovEvents] = useState<(EventLog | Log)[] | undefined>(
    undefined
  );
  const [proposalEvents, setProposalEvents] = useState<
    (EventLog | Log)[] | undefined
  >(undefined);
  const [ping, setPing] = useState<number>(0);

  useEffect(() => {
    if (cxLoading) return;
    const asyncAction = async () => {
      const readToken = fetchReadContract(
        governanceToken.address,
        governanceToken.abi,
        provider
      );
      const writeToken = fetchWriteContract(
        governanceToken.address,
        governanceToken.abi,
        signer
      );
      setRToken(readToken);
      setWToken(writeToken);
      const readGovernor = fetchReadContract(
        governorContract.address,
        governorContract.abi,
        provider
      );
      const writeGovernor = fetchWriteContract(
        governorContract.address,
        governorContract.abi,
        signer
      );
      setRGovernor(readGovernor);
      setWGovernor(writeGovernor);
      const readTimeLock = fetchReadContract(
        timeLock.address,
        timeLock.abi,
        provider
      );
      const writeTimeLock = fetchWriteContract(
        timeLock.address,
        timeLock.abi,
        signer
      );
      setRTimeLock(readTimeLock);
      setWTimeLock(writeTimeLock);
      const readBox = fetchReadContract(box.address, box.abi, provider);
      const writeBox = fetchWriteContract(box.address, box.abi, signer);
      setRBox(readBox);
      setWBox(writeBox);
    };
    asyncAction();
  }, [cxLoading, provider, signer]);

  const propose = async () => {
    if (!(rGovernor && account && wBox && wGovernor)) {
      return;
    }
    const encodedFunctionCall = wBox.interface.encodeFunctionData("store", [
      327,
    ]);
    const tx = await wGovernor.propose(
      [box.address],
      [0],
      [encodedFunctionCall],
      "wosat"
    );
    console.log({ tx });
    const receipt = await tx.wait();
    console.log({ receipt });
    setPing((ping) => ping + 1);
  };

  //TODO: SET UP PROPOSAL PAGE AND ALLOW TO VOTE ON THEM.

  useEffect(() => {
    if (!(rGovernor && account && rBox && provider)) {
      return;
    }
    const asyncAction = async () => {
      console.log("This triggers");
      const latestBlock = await provider.getBlockNumber();
      const governorEvents = await rGovernor.queryFilter(
        "*",
        governanceToken.blockDeployed,
        latestBlock
      );
      const proposalEvents = await rGovernor.queryFilter(
        "ProposalCreated",
        governorContract.blockDeployed,
        latestBlock
      );
      setGovEvents(governorEvents);
      setProposalEvents(proposalEvents);
    };
    asyncAction();

    return () => {
      rGovernor.removeAllListeners();
    };
  }, [rGovernor, rBox, account, ping]);

  if (status === "unavailable") return <Text>MetaMask is not installed</Text>;

  if (status === "initializing") return <Text>Initializing...</Text>;

  if (status === "notConnected")
    return (
      <Box>
        <Text>Please connect your MetaMask to access this app</Text>
        <Button onClick={connect}>Connect to Metamask</Button>
        <Button onClick={propose}>Propose</Button>
      </Box>
    );

  if (status === "connecting") return <Text>Connecting...</Text>;

  if (status === "connected") {
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
      <Grid templateColumns="300px 1fr 150px" gap={2} minHeight={150}>
        <GridItem bg="orange.300">
          <EventFeed govEvents={govEvents} />
        </GridItem>
        <GridItem bg="pink.200">
          <Button onClick={propose}>Propose</Button>
          <ProposalDashboard
            rGovernor={rGovernor}
            wGovernor={wGovernor}
            proposalEvents={proposalEvents}
          />
        </GridItem>
        <GridItem bg="blue.100">
          <Profile rToken={rToken} account={account} />
        </GridItem>
      </Grid>
    );
  }

  //TODO: FETCH PROPOSALS FROM EVENTS

  return <Text>Metamask Error</Text>;
}
