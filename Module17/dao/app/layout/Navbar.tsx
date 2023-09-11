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
        background:
          "linear-gradient(90deg, rgba(173,173,173,1) 0%, rgba(255,255,255,1) 45%, rgba(249,249,249,1) 55%, rgba(166,166,166,1) 100%)",
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
      </Box>
      <Box>
        <Tooltip label={account ? account : "No account detected"}>
          <Text>{account ? f4l4(account) : "No account detected"}</Text>
        </Tooltip>
      </Box>
    </Flex>
  );
}
