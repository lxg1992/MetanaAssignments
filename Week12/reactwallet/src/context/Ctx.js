import React, { useState, useEffect, createContext } from "react";

const MyContext = createContext();

const INITIAL = {
  isSet: false,
  privateKey: "",
  privateKeyBuffer: "",
  publicKey: "",
  address: "",
  lastTx: "",
  ERC20Contracts: {
    USDC: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
    CHAINLINK: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
  },
};

function MyContextProvider({ children }) {
  const [account, setAccount] = useState(INITIAL);

  // Local Storage: setting & getting data
  useEffect(() => {
    const accountData = JSON.parse(localStorage.getItem("wallet_account"));

    if (accountData && accountData.isSet) {
      setAccount(accountData);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wallet_account", JSON.stringify(account));
  }, [account]);

  const resetAccount = () => {
    setAccount(INITIAL);
  };
  return (
    <MyContext.Provider
      value={{
        account,
        setAccount,
        resetAccount,
      }}
    >
      {children}
    </MyContext.Provider>
  );
}

export { MyContextProvider, MyContext };
