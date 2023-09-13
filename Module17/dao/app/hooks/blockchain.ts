import * as React from "react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { BrowserProvider, JsonRpcSigner } from "ethers";

export const useConnection = () => {
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


