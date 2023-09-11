import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { useConnection } from "../../hooks/blockchain.ts";
import { fetchReadContract, fetchWriteContract } from "../../utils/contract.ts";
import { Contract } from "ethers";
export { Page };

function Page(pageProps) {
  const { governanceToken, governorContract, timeLock } = pageProps;
  const { provider, signer, userAddress, cxLoading } = useConnection();
  const [rCToken, setRCToken] = useState<Contract | undefined>(undefined); //read contract token
  const [wCToken, setWCToken] = useState<Contract | undefined>(undefined); //write contract token

  useEffect(() => {
    const asyncAction = async () => {
      if (!cxLoading) {
        const readToken = fetchReadContract(
          governanceToken.address,
          governanceToken.abi,
          provider
        );
        setRCToken(readToken);
        const writeToken = fetchWriteContract(
          governanceToken.address,
          governanceToken.abi,
          signer
        );
        setWCToken(writeToken);
        const bal = await readToken.balanceOf(userAddress);
        console.log({ bal });
      }
    };
    asyncAction();
  }, [cxLoading, provider, signer]);

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
