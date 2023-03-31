import React, { createContext, useEffect, useReducer } from "react";
import { accountReducer, initializer } from "../helpers/accountReducer";

export const AccountCtx = createContext();

export const AccountProvider = ({ children }) => {
  const [account, dispatch] = useReducer(accountReducer, {}, initializer);

  useEffect(() => {
    console.log("Storage updated, persisting to local", account);
    localStorage.setItem("wallet_account_storage", JSON.stringify(account));
  }, [account]);

  return (
    <AccountCtx.Provider
      value={{
        account,
        dispatch,
      }}
    >
      {children}
    </AccountCtx.Provider>
  );
};
