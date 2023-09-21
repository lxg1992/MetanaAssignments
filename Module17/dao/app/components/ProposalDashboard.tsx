import { EventLog, Log } from "ethers";
import { usePageContext } from "../renderer/usePageContext.js";
import {
  Box,
  Container,
  Text,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";
import { f4l4 } from "../utils/str.ts";
import { Link } from "./Link.tsx";
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
    <TableContainer>
      <Table size="sm">
        <TableCaption>Proposals</TableCaption>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>User</Th>
            <Th>Vote Start</Th>
            <Th>Vote End</Th>
            <Th>Description</Th>
          </Tr>
        </Thead>
        <Tbody>
          {proposalEvents.map((event, idx) => (
            <LinkBox as={Tr} key={idx}>
              <LinkOverlay
                href={"/proposal/" + event.args[0].toString()}
                textDecoration={"underline"}
              >
                <Td>{f4l4(event.args[0].toString())}</Td>
              </LinkOverlay>
              <Td>{f4l4(event.args[1].toString())}</Td>
              <Td>{event.args[6].toString()}</Td>
              <Td>{event.args[7].toString()}</Td>
              <Td>{event.args[8]}</Td>
            </LinkBox>
          ))}
        </Tbody>
        {/* <Box>
          <Text>Proposal Dashboard</Text>
        </Box> */}
      </Table>
    </TableContainer>
  );
}
