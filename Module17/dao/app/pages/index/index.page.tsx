import { Container, Text, Button, Box } from "@chakra-ui/react";
import { useMetaMask } from "metamask-react";
export { Page };

function Page(pageProps) {
  const { status, connect, account, chainId, ethereum, switchChain } =
    useMetaMask();

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
      <Box>
        <Text>Welcome</Text>
      </Box>
    );
  }

  return <Text>Metamask Error</Text>;
}
