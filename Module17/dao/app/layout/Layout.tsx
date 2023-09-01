import React from "react";
import { Flex } from "@chakra-ui/react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Flex
      style={{
        border: "1px dotted blue",
      }}
      direction={"column"}
    >
      {children}
    </Flex>
  );
}
