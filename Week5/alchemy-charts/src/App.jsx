import { useState, useEffect, useRef } from "react";
import "./App.css";
import { ethers } from "ethers";
import ERC20Chart from "./components/ERC20Chart";
import ERC20BaseChart from "./components/ERC20BaseChart";
import { SHIBA_INU_TOKEN, TETHER_TOKEN } from "./constants/tokens";

function App() {
  return (
    <div className="App">

      {/* <ERC20Chart /> */}
      <ERC20BaseChart />
    </div>
  );
}

export default App;
