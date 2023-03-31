import React, { useState, useEffect, createContext } from "react";

const MyContext = createContext();

const init = {
  isSet: false,
  priKey: "",
  pubKey: "",
  address: "",
};

function MyContextProvider({ children }) {
  const [account, setAccount] = useState(init);

  // Local Storage: setting & getting data
  useEffect(() => {
    const accountData = JSON.parse(localStorage.getItem("wallet_account"));

    if (accountData) {
      setAccount(accountData);
    } else {
      localStorage.setItem()
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wallet_account", JSON.stringify(account));
  }, [account]);

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
      }}
    >
      {children}
    </MyContext.Provider>
  );
}

export { MyContextProvider, MyContext };
