import React, { useState, useEffect, createContext, useMemo } from "react";
import { apiKey } from "../helpers/constants.mjs";

export const networkDict = {
  mainnet: {
    name: "mainnet",
    title: "Mainnet",
    color: "red",
    node: `https://mainnet.infura.io/v3/${apiKey}`,
    chainScan: `https://etherscan.io`,
    label: "🟥",
  },
  goerli: {
    name: "goerli",
    title: "Goerli",
    color: "blue",
    node: `https://goerli.infura.io/v3/${apiKey}`,
    chainScan: `https://goerli.etherscan.io`,
    label: "🟦",
  },
  sepolia: {
    name: "sepolia",
    title: "Sepolia",
    color: "purple",
    node: `https://sepolia.infura.io/v3/${apiKey}`,
    chainScan: `https://sepolia.etherscan.io`,
    label: "🟪",
  },
};

const MyContext = createContext();

const INITIAL = {
  isSet: false,
};

function MyContextProvider({ children }) {
  const [account, setAccount] = useState(INITIAL); // {}
  const [accountDict, setAccountDict] = useState({});
  const [network, setNetwork] = useState(networkDict.goerli);

  // Local Storage: setting & getting data
  useEffect(() => {
    const accountData =
      JSON.parse(localStorage.getItem("rw_account_active")) || "";
    const accountDictData =
      JSON.parse(localStorage.getItem("rw_account_dict")) || {};
    const networkData =
      /*Added for*/ JSON.parse(localStorage.getItem("rw_network")) || {};

    //If local storage variables exist, set them in the context
    if (accountData && accountData.isSet) {
      setAccount(accountData);
      setAccountDict((state) => ({
        ...state,
        [accountData.address]: accountData,
      }));
    }

    if (Object.keys(accountDictData).length) {
      setAccountDict(accountDictData);
    }

    if (Object.keys(networkData).length) {
      setNetwork(networkData);
    }
    // ON INITIAL LOAD
  }, []);

  useEffect(() => {
    localStorage.setItem("rw_account_active", JSON.stringify(account));
  }, [account]);

  useEffect(() => {
    localStorage.setItem("rw_account_dict", JSON.stringify(accountDict));
  }, [accountDict]);

  useEffect(() => {
    localStorage.setItem("rw_network", JSON.stringify(network));
  }, [network]);

  //Whenever account changes, it will change the active account, and the account list

  const fullResetAccount = () => {
    setAccount(INITIAL);
    setAccountDict({});
  };

  const setNetworkTo = (networkValue) => {
    setNetwork(networkDict[networkValue]);
  };

  const addToken = (newTokenName, newTokenAddr, networkStr) => {
    setAccount((state) => {
      state.ERC20Contracts[networkStr][newTokenName] = newTokenAddr;
      return { ...state };
    });
  };

  const removeToken = (tokenNameToRemove, networkStr) => {
    setAccount((state) => {
      delete state.ERC20Contracts[networkStr][tokenNameToRemove];
      return { ...state };
    });
  };

  const setAccountInDict = (address, patchObj) => {
    setAccountDict((state) => ({
      ...state, //rest of accounts
      [address]: {
        ...state[address], //Spread the rest of the object
        ...patchObj, //Edit new details
      },
    }));
  };

  const patchAccount = (patchObj) => {
    setAccount((state) => ({
      ...state, //rest of accounts
      ...patchObj, //Edit new details
    }));
  };

  const removeAccountFromDict = (address) => {
    setAccountDict((state) => {
      delete state[address];
      return {
        ...state,
      };
    });
  };

  const findAvailableAccount = () => {
    const availableAccounts = Object.keys(accountDict);
    if (availableAccounts.length) {
      return { availableAddr: availableAccounts[0] };
    }
    return { availableAddr: null };
  };

  const ctxVals = useMemo(
    () => ({
      account,
      network,
      accountDict,
      setAccount,
      setAccountDict,
      patchAccount,
      fullResetAccount,
      addToken,
      removeToken,
      setNetworkTo,
      setAccountInDict,
      removeAccountFromDict,
      findAvailableAccount,
    }),
    [account, network, accountDict]
  );

  return <MyContext.Provider value={ctxVals}>{children}</MyContext.Provider>;
}

export { MyContextProvider, MyContext };
