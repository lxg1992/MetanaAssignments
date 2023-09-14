import { useEffect, useState } from "react";
import { usePageContext } from "../renderer/usePageContext.js";
import { Box, Text } from "@chakra-ui/react";
export { Profile };

function Profile({ rToken, account }) {
  const [balance, setBalance] = useState(0);
  //   const pageContext = usePageContext();
  //   const className = [
  //     props.className,
  //     pageContext.urlPathname === props.href && "is-active",
  //   ]
  // .filter(Boolean)
  // .join(" ");
  useEffect(() => {
    if (!(rToken && account)) {
      return;
    }
    const asyncAction = async () => {
      const bal = await rToken.balanceOf(account);
      console.log({ bal });
      setBalance(bal);
    };
    asyncAction();
  }, [rToken, account]);
  return (
    <Box>
      <Text>Balance: {balance.toString()}</Text>
      <Text>Profile </Text>
    </Box>
  );
}
