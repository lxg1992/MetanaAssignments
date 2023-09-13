import { writeFileSync } from "fs";
import path from "path";

export const writeArtifact = (contract: any, network: { name: string }) => {
  const writeObj = {
    address: contract.address,
    abi: contract.abi,
  };
  const loc = path.resolve(
    __dirname,
    `../app/ethereum/${network.name}/${contract.contractName}.json`
  );
  writeFileSync(loc, JSON.stringify(writeObj, null, 2));
};

//TODO: Get the latest deployed block as the basis for the start "block" from which the ProposalCreated events will be tracked. Save this to the pageProps to be passed to the front end and used in the useEffect hook to fetch the events.
