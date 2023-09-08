import { useMetaMask } from "metamask-react";

import { useEffect } from "react";
import { Box } from "@chakra-ui/react";
import {
  useConnection,
  useReadContract,
  useWriteContract,
} from "../../hooks/blockchain.ts";

export { Page };

function Page(pageProps) {
  const { governanceToken, governorContract, timeLock } = pageProps;
  const { provider, signer, userAddress, cxLoading } = useConnection();
  const { rContract, cLoading } = useReadContract(
    governanceToken.address,
    governanceToken.abi,
    provider
  );
  const { wContract, wLoading } = useWriteContract(
    governanceToken.address,
    governanceToken.abi,
    signer
  );

  useEffect(() => {
    const asyncAction = async () => {
      if (!cxLoading) {
        const name = await rContract.name();
        console.log({ name });
      }
    };
    asyncAction();
  }, [cxLoading]);


  console.log({ pageProps });
  if (cxLoading) {
    return <Box>Loading...</Box>;
  }
  if ((provider, signer, userAddress)) {
    console.log({ provider, signer, userAddress });
  }
  return (
    <>
      <h1>About</h1>
      <p>
        Example of using <code>vite-plugin-ssr</code>.
      </p>
    </>
  );
}
