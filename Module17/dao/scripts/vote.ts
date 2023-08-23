import fs from "fs";
import {
  VOTING_PERIOD,
  developmentChains,
  proposalsFile,
} from "../helper-hardhat-config";
import { ethers, network } from "hardhat";
import { moveBlocks } from "../utils/move-block";

async function main(proposalIndex: number) {
  const proposals = JSON.parse(
    fs.readFileSync(__dirname + proposalsFile, "utf8")
  );

  const proposalId = proposals[network.config.chainId!][proposalIndex];
  // 0 against, 1 for, 2 abstain
  const voteWay = 1;
  const reason = "I like to vote true";
  const governor = await ethers.getContract("GovernorContract");
  const voteTxResponse = await governor.castVoteWithReason(
    proposalId,
    voteWay,
    reason
  );

  await voteTxResponse.wait(1);

  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_PERIOD + 1);
  }
  console.log("Voted!");
}
const index = 0;

main(index)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
