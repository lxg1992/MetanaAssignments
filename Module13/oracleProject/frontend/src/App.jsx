import { useState } from "react";
import {
  useMetamask,
  useAddress,
  useContract,
  useContractRead,
} from "@thirdweb-dev/react";
import { BigNumber } from "ethers";
import "./App.css";
import FlipCoinABI from "./abi/FlipCoinABI.json";

function App() {
  const address = useAddress();
  const connectWithMM = useMetamask();
  const {
    contract,
    isLoading: isContractLoading,
    error: contractError,
  } = useContract("0xEcaB45F0c93FB3bbA61aE8912090Ada9656E5E1e", FlipCoinABI);
  const {
    data: linkBalance,
    isLoading: isLinkBalanceLoading,
    error: linkBalanceError,
  } = useContractRead(contract, "getContractERC20Balance");

  console.log(contract);

  if (contractError) {
    return <p>{contractError.message}</p>;
  }

  if (isContractLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="App">
      <div className="App-header">
        {address ? (
          <p>{address} connected</p>
        ) : (
          <button onClick={() => connectWithMM()}>Connect with Metamask</button>
        )}
      </div>
      <div className="App-body">
        <p>Link Balance of Contract</p>
        {isLinkBalanceLoading ? (
          <p>Loading...</p>
        ) : (
          <p>{linkBalance.toString() / 10 ** 18}</p>
        )}
      </div>
    </div>
  );
}

export default App;
