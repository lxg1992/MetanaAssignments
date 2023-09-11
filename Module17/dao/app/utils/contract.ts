import { ethers } from "ethers";
import {
  BrowserProvider,
  JsonRpcSigner,
  Interface,
  InterfaceAbi,
  Contract,
} from "ethers";

export const fetchReadContract = (
  address: string,
  abi: Interface | InterfaceAbi,
  provider: BrowserProvider | undefined
) => {
  const contract: Contract = new ethers.Contract(address, abi, provider);
  return contract;
};

export const fetchWriteContract = (
  address: string,
  abi: Interface | InterfaceAbi,
  signer: JsonRpcSigner | undefined
) => {
  const contract: Contract = new ethers.Contract(address, abi, signer);
  return contract;
};
