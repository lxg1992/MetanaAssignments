import { useState } from "react";
import { useMetamask, useAddress } from "@thirdweb-dev/react";
import "./App.css";

function App() {
  const address = useAddress();
  const connectWithMM = useMetamask();
  return (
    <div className="App">
      <button onClick={() => connectWithMM()}>Connect with Metamask</button>
      <p>Address: {address ?? "none"}</p>
    </div>
  );
}

export default App;
