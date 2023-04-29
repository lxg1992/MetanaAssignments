import React, { useState, useEffect, createContext } from "react";

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

  // Local Storage: setting & getting data
  useEffect(() => {
    const accountData = JSON.parse(localStorage.getItem("rw_account_active"));
    const accountDictData =
      JSON.parse(localStorage.getItem("rw_account_dict")) || {};

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
  }, []);

  useEffect(() => {
    localStorage.setItem("rw_account_active", JSON.stringify(account));
    localStorage.setItem("rw_account_dict", JSON.stringify(accountDict));
  }, [account, accountDict]);

  //Whenever account changes, it will change the active account, and the account list

  const fullResetAccount = () => {
    //Should be clear accounts
    let addressToFilter;
    //
    setAccount(INITIAL);
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
      }}
    >
      {children}
    </MyContext.Provider>
  );
}

export { MyContextProvider, MyContext };
