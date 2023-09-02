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
