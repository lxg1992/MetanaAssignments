import { EventLog, Log } from "ethers";

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
} from "@chakra-ui/react";
import { f4l4 } from "../utils/str.ts";
import { Link } from "./Link.tsx";
import { usePageContext } from "../../renderer/usePageContext.tsx";
export { Page };

function Page() {
  const { urlPathname } = usePageContext();
  const proposalId = urlPathname.split("/")[2];
  console.log(urlPathname);

  if (!proposalId) {
    return (
      <Box>
        <Text>No Proposal</Text>
      </Box>
    );
  }

  console.log({ proposalId });

  return <Box>Stuff</Box>;
}
