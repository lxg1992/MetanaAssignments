import React, { useState, useEffect, createContext } from "react";

const MyContext = createContext();

const INITIAL = {
  isSet: false,
  priKey: "",
  pubKey: "",
  address: "",
  ERC20Balances: [],
};

function MyContextProvider({ children }) {
  const [account, setAccount] = useState(INITIAL);

  // Local Storage: setting & getting data
  useEffect(() => {
    const accountData = JSON.parse(localStorage.getItem("wallet_account"));

    if (accountData.isSet) {
      setAccount(accountData);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wallet_account", JSON.stringify(account));
  }, [account]);

  const resetAccount = () => {
    setAccount(INITIAL);
  };

  // function toggleFavorite(id) {
  //   const updatedArr = allPhotos.map((photo) => {
  //     if (photo.id === id) {
  //       return { ...photo, isFavorite: !photo.isFavorite };
  //     }
  //     return photo;
  //   });

  //   setAllPhotos(updatedArr);
  // }

  // function addToCart(newItem) {
  //   setAccount((prevItems) => [...prevItems, newItem]);
  // }

  // function removeFromCart(id) {
  //   setAccount((prevItems) => prevItems.filter((item) => item.id !== id));
  // }

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
