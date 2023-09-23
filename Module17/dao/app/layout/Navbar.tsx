import React from "react";
import { useMetaMask } from "metamask-react";
import { Link, Flex, Box, Text, Tooltip } from "@chakra-ui/react";
import { f4l4 } from "../utils/str.ts";
import { usePageContext } from "../renderer/usePageContext.tsx";

export function Navbar() {
  const { account } = useMetaMask();
  return (
    <Flex
      style={{
        padding: 20,
      }}
      margin={"1vh 1vw"}
      borderRadius={"10px"}
      backgroundColor={"gray.200"}
      direction={"row"}
      justifyContent={"space-between"}
    >
      <Box>
        <Link padding="5" href="/">
          Home
        </Link>
        <Link padding="5" href="/about">
          About
        </Link>
        <Link padding="5" href="/new">
          New
        </Link>
      </Box>
      <Box>
        <Tooltip label={account ? account : "No account detected"}>
          <Text>{account ? f4l4(account) : "No account detected"}</Text>
        </Tooltip>
      </Box>
    </Flex>
  );
}
