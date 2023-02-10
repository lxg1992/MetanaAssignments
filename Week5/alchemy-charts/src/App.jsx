import { useState, useEffect } from "react";
import "./App.css";
import { ethers } from "ethers";
import ERC20Chart from "./components/ERC20Chart";

function App() {
  return (
    <div className="App">
      <div className="card">
        <p>ShibaInuToken: 0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE</p>
      </div>
      <ERC20Chart />
    </div>
  );
}

export default App;
