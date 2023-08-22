import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { MIN_DELAY } from "../helper-hardhat-config";

const deployTimeLock: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log(deployer);

  const timelock = await deploy("TimeLock", {
    from: deployer,
    args: [MIN_DELAY, [], [], deployer],
    log: true,
  });
};

export default deployTimeLock;
