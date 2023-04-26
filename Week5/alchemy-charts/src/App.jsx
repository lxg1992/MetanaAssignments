import { useState, useEffect, useRef } from "react";
import "./App.css";
import { ethers } from "ethers";
import ERC20Chart from "./components/ERC20Chart";
import BaseFeeChart from "./components/BaseFeeChart";
import GasChart from "./components/GasChart";

function App() {
  return (
    <div className="App">
      <ERC20Chart />
      <BaseFeeChart />
      <GasChart />
    </div>
  );
}

export default App;
