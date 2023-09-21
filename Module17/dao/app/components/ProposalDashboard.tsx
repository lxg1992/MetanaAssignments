import { EventLog, Log } from "ethers";
import { usePageContext } from "../renderer/usePageContext.js";
import { Box, Text } from "@chakra-ui/react";
export { ProposalDashboard };

function ProposalDashboard({
  proposalEvents,
}: {
  proposalEvents: (EventLog | Log)[] | undefined;
}) {
  if (!proposalEvents) {
    return (
      <Box>
        <Text>No Proposals</Text>
      </Box>
    );
  }

  console.log({ proposalEvents });

  

  return (
    <Box>
      <Text>Proposal Dashboard</Text>
    </Box>
  );
}
