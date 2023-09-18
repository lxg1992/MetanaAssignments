import { useMetaMask } from "metamask-react";
import { usePageContext } from "../renderer/usePageContext.js";
import { Box, Text } from "@chakra-ui/react";
export { EventFeed };

function EventFeed({ govEvents }) {
  const { account } = useMetaMask();

  //TODO: Make an event feed which is fed all the events for the governor contract (and others?);
  return (
    <Box>
      <Text>Event Feed</Text>
    </Box>
  );
}
