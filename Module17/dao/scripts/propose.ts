import fs from "fs";
import { ethers, network } from "hardhat";
import {
  NEW_STORE_VALUE,
  STORE_FUNC,
  PROPOSAL_DESCRIPTION,
  developmentChains,
  VOTING_DELAY,
  proposalsFile,
} from "../helper-hardhat-config";
import { moveBlocks } from "../utils/move-block";
export async function propose(
  args: any[],
  functionToCall: string,
  proposalDescription: string
) {
  const governor = await ethers.getContract("GovernorContract");
  const box = await ethers.getContract("Box");
  const encodedFunctionCall = box.interface.encodeFunctionData(
    functionToCall, // "storeValue"
    args // 77
  );
  console.log(`Proposing ${functionToCall}(${args})`);
  console.log(`Proposal Description: ${proposalDescription}`);
  const proposeTx = await governor.propose(
    [box.address],
    [0],
    [encodedFunctionCall],
    proposalDescription
  );
  const proposeReceipt = await proposeTx.wait(1);

  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_DELAY + 1);
  }

  const proposalId = proposeReceipt.events[0].args.proposalId;
  console.log({ events: proposeReceipt.events });

  let proposals = JSON.parse(
    fs.readFileSync(__dirname + proposalsFile, { encoding: "utf8", flag: "r" })
  );
  if (proposals[network.config.chainId!.toString()] === undefined) {
    proposals[network.config.chainId!.toString()] = [];
  }
  proposals[network.config.chainId!.toString()].push(proposalId.toString());

  fs.writeFileSync(__dirname + proposalsFile, JSON.stringify(proposals));
}

propose([NEW_STORE_VALUE], STORE_FUNC, PROPOSAL_DESCRIPTION)
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
