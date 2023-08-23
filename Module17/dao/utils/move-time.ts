import { network } from "hardhat";

export async function moveTime(amount: number) {
  console.log("moving blocks...");
  await network.provider.send("evm_increaseTime", [amount]);
}
