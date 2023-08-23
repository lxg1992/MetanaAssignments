import fs from "fs";
import {
  VOTING_PERIOD,
  developmentChains,
  proposalsFile,
} from "../helper-hardhat-config";
import { ethers, network } from "hardhat";
import { moveBlocks } from "../utils/move-block";

async function main() {

  const governor = await ethers.getContract("GovernorContract");

  



}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
