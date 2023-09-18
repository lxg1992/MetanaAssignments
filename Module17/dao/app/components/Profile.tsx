import { useEffect, useState } from "react";
import { usePageContext } from "../renderer/usePageContext.js";
import { Box, Text } from "@chakra-ui/react";
export { Profile };

function Profile({ rToken, account }) {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (!(rToken && account)) {
      return;
    }
    const asyncAction = async () => {
      const bal = await rToken.balanceOf(account); //This has to be an ERC20votes "delegated power" equivalent, not balanceOf
      setBalance(bal);
    };
    asyncAction();
  }, [rToken, account]);

  // useEffect(() => {
  //   if (!(rToken && account)) {
  //     return;
  //   }
  //   const asyncAction = async () => {};
  //   asyncAction();
  // });
  return (
    <Box>
      <Text>Balance: {balance ? balance.toString() : "loading..."}</Text>
      <Text>Profile </Text>
    </Box>
  );
}
