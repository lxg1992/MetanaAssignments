import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { Contract } from "ethers";
import { useConnection } from "../../hooks/blockchain.ts";
import { fetchReadContract, fetchWriteContract } from "../../utils/contract.ts";
import { PageProps } from "../../renderer/types.ts";
export { Page };

function Page(pageProps: PageProps) {
  const { governanceToken, governorContract, timeLock } = pageProps;
  const { provider, signer, cxLoading } = useConnection();
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
      }
    };
    asyncAction();
  }, [cxLoading, provider, signer]);

  if (cxLoading) {
    return <Box>Loading...</Box>;
  }


  return (
    <>
      <h1>About</h1>
    </>
  );
}
