import { Container, Text, Button, Box } from "@chakra-ui/react";
import { useMetaMask } from "metamask-react";
export { Page };

function Page() {
  const { status, connect, account, chainId, ethereum } = useMetaMask();

  if (status === "unavailable") return <Text>MetaMask is not installed</Text>;

  if (status === "initializing") return <Text>Initializing...</Text>;

  if (status === "notConnected")
    return <Button onClick={connect}>Connect to Metamask</Button>;

  if (status === "connecting") return <Text>Connecting...</Text>;

  if (status === "connected") {
    console.log({ account, chainId, ethereum });
    return (
      <Box>
        <Text>Welcome</Text>
      </Box>
    );
  }

  return <Text>Metamask Error</Text>;
}
