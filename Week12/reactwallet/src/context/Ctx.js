import React, { useState, useEffect, createContext } from "react";
import { networkDict } from "../helpers/lists";

const MyContext = createContext();

const INITIAL = {
  isSet: false,
  // privateKey: "",
  publicKey: "",
  address: "",
  lastTx: "",
  ERC20Contracts: {
    goerli: {
      USDC: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F", //goerli
      CHAINLINK: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB", //goerli
    },
  },
  encPK: "",
  salt: "",
};

function MyContextProvider({ children }) {
  const [account, setAccount] = useState(INITIAL);
  const [accountDict, setAccountDict] = useState({});
  const [network, setNetwork] = useState({}); // Object

  // Local Storage: setting & getting data
  useEffect(() => {
    const accountData =
      JSON.parse(localStorage.getItem("rw_account_active")) || "";
    const accountDictData =
      JSON.parse(localStorage.getItem("rw_account_dict")) || {};
    const networkData = JSON.parse(localStorage.getItem("rw_network")) || {};

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
  }, []);

  // useEffect(() => {
  //   localStorage.setItem("rw_account_active", JSON.stringify(account));
  //   localStorage.setItem("rw_account_dict", JSON.stringify(accountDict));
  //   localStorage.setItem("rw_network", JSON.stringify(network));
  // }, [account, accountDict, network]);

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
    //Should be clear accounts
    let addressToFilter;
    //
    setAccount(INITIAL);
  };

  const setNetworkTo = (networkValue = "goerli") => {
    console.log({ networkSet: network });
    setNetwork(networkDict[networkValue]);
  };

  const addToken = (newTokenName, newTokenAddr, network = "goerli") => {
    setAccount((state) => {
      state.ERC20Contracts[network][newTokenName] = newTokenAddr;
      return { ...state };
    });
  };

  const removeToken = (tokenNameToRemove, network = "goerli") => {
    setAccount((state) => {
      delete state.ERC20Contracts[network][tokenNameToRemove];
      return { ...state };
    });
  };

  return (
    <MyContext.Provider
      value={{
        account,
        setAccount,
        fullResetAccount,
        addToken,
        removeToken,
        network,
        setNetworkTo,
        accountDict,
      }}
    >
      {children}
    </MyContext.Provider>
  );
}

export { MyContextProvider, MyContext };
