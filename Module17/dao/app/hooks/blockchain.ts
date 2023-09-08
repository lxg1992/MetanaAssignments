import * as React from "react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  BrowserProvider,
  JsonRpcSigner,
  Interface,
  InterfaceAbi,
  Contract,
  JsonRpcProvider,
} from "ethers";

export const useConnection = () => {
  //TODO: FIX THE SIGNER AND THE PROVIDER NOT BEING AVAILABLE FOR CONSUMPTION
  const [provider, setProvider] = useState<BrowserProvider | undefined>(
    undefined
  );
  const [signer, setSigner] = useState<JsonRpcSigner | undefined>(undefined);
  const [userAddress, setUserAddress] = useState<string | undefined>("");
  const [cxLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const asyncAction = async () => {
      if (window?.ethereum) {
        setLoading(true);
        const eProvider = new ethers.BrowserProvider(
          window.ethereum /*'goerli'^*/
        );
        const eSigner = await eProvider.getSigner();
        const eUserAddress = await eSigner.getAddress();
        setProvider(eProvider);
        setSigner(eSigner);
        setUserAddress(eUserAddress);
        setLoading(false);
      }
      setLoading(false);
    };

    asyncAction();
  }, []);

  return { provider, signer, userAddress, cxLoading };
};

export const useReadContract = (
  address: string,
  abi: Interface | InterfaceAbi,
  provider: BrowserProvider | undefined
) => {
  const [contract, setContract] = useState<Contract | undefined>(undefined);
  const [cLoading, setLoading] = useState<boolean>(true);

  console.log({ provider });

  useEffect(() => {
    setLoading(true);
    const eContract = new ethers.Contract(address, abi, provider);
    setContract(eContract);
    setLoading(false);
  }, [address]);

  return { rContract: contract, cLoading };
};

export const useWriteContract = (
  address: string,
  abi: Interface | InterfaceAbi,
  signer: JsonRpcSigner | undefined
) => {
  const [contract, setContract] = useState<Contract | undefined>(undefined);
  const [cLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const eContract = new ethers.Contract(address, abi, signer);
    setContract(eContract);
    setLoading(false);
  }, [address]);

  return { wContract: contract, cLoading };
};
