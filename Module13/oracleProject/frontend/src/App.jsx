import { useState } from "react";
import {
  useMetamask,
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
  Web3Button,
} from "@thirdweb-dev/react";
import { BigNumber } from "ethers";
import "./App.css";
import FlipCoinABI from "./abi/FlipCoinABI.json";

const flipCoinAddress = "0xb5Fe9D933E248f4C7740D754FE7Aa44Dbcc90EE7";

function App() {
  const address = useAddress();
  const connectWithMM = useMetamask();

  const [choice, setChoice] = useState(0);

  const {
    contract,
    isLoading: isContractLoading,
    error: contractError,
  } = useContract(flipCoinAddress, FlipCoinABI);

  const {
    data: linkBalance,
    isLoading: isLinkBalanceLoading,
    error: linkBalanceError,
  } = useContractRead(contract, "getContractERC20Balance");

  console.log(choice);

  const {
    mutateAsync: flipAsync,
    isLoading: isFlipLoading,
    error: flipError,
  } = useContractWrite(contract, "flip");

  if (contractError) {
    return <p>{contractError.message}</p>;
  }

  if (linkBalanceError) {
    return <p>{linkBalanceError.message}</p>;
  }

  if (isContractLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="App">
      <div className="App-header">
        <h1>Flip Coin</h1>
        <h2>Guess the choice!</h2>
        {address ? (
          <h6>{address} connected</h6>
        ) : (
          <button onClick={() => connectWithMM()}>Connect with Metamask</button>
        )}
      </div>
      <div>
        <p>Link Balance of Contract</p>
        {isLinkBalanceLoading ? (
          <p>Loading...</p>
        ) : (
          <p>{linkBalance.toString() / 10 ** 18}</p>
        )}
      </div>
      {/* <div>
        <label>Side:</label>
        <select value={choice} onChange={handleChoiceChange}>
          <option value={-1}>Select</option>
          <option value={0}>Heads</option>
          <option value={1}>Tails</option>
        </select>
      </div> */}
      <div>
        {isFlipLoading ? <p>Loading...</p> : null}
        <Web3Button
          isDisabled={choice === -1}
          contractAddress={flipCoinAddress}
          action={() => flipAsync({ args: [0] })}
        >
          🎧
        </Web3Button>
        <Web3Button
          isDisabled={choice === -1}
          contractAddress={flipCoinAddress}
          action={() => flipAsync({ args: [1] })}
        >
          🦎
        </Web3Button>
      </div>
    </div>
  );
}

export default App;

/**
 * TODO: SUBSCRIBE TO EVENT Request and Response
 * TODO: SHOW THE REQUEST ID
 *
 * TODO: ON FLIP REQUEST, SHOW LOADING (prevent further flips)
 * TODO: FILTER EVENTS BASED ON THE REQUEST ID AND ADDRESS
 * TODO: SHOW THE RESULT OF THE FLIP
 * TODO: LOCAL HISTORY?
 */
