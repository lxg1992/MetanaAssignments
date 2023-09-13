import { usePageContext } from "../renderer/usePageContext.js";
import { Box, Text } from "@chakra-ui/react";
export { Profile };

function Profile() {
  //   const pageContext = usePageContext();
  //   const className = [
  //     props.className,
  //     pageContext.urlPathname === props.href && "is-active",
  //   ]
  // .filter(Boolean)
  // .join(" ");
  return (
    <Box>
      <Text>Profile Dashboard</Text>
    </Box>
  );
}
