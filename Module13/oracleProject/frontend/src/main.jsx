import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import {
  ThirdwebProvider,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
} from "@thirdweb-dev/react";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThirdwebProvider
      activeChain="goerli"
      autoConnect={true}
      supportedWallets={[metamaskWallet(), coinbaseWallet(), walletConnect()]}
    >
      <App />
    </ThirdwebProvider>
  </React.StrictMode>
);
