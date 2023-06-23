import { useEffect, useState } from "react";
import {
  useMetamask,
  useAddress,
  useContract,
  useContractRead,
  useContractEvents,
  Web3Button,
  useSDK,
} from "@thirdweb-dev/react";
import "./App.css";
import FlipCoinABI from "./abi/FlipCoinABI.json";

const flipCoinAddress = "0x4b81DE9D5285c30ec7c9E769A30A41C0afb6C333";

const callOverride = {
  gasLimit: 500000,
};

function App() {
  const [block, setBlock] = useState(null);
  const address = useAddress();
  const connectWithMM = useMetamask();
  const thirdweb = useSDK();

  const fetchLatestBlock = async () => {
    console.log({ thirdweb });
    console.log(thirdweb.provider._emitted.block);
  };

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     fetchLatestBlock().then((block) => {
  //       const events = await contract.events.getEvents("CoinFlipRequest", {
  //         fromBlock: block - 300,
  //       })
  //     });
  //   }, 1000);
  //   return () => clearTimeout(timer);
  // });

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

  const {
    data: eventReqData,
    isLoading: isReqEventLoading,
    error: reqEventError,
  } = useContractEvents(contract, "CoinFlipRequest", {
    subscribe: true,
  });

  if (reqEventError) {
    console.log({ reqEventError });
  }

  const {
    data: eventResData,
    isLoading: isResEventLoading,
    error: resEventError,
  } = useContractEvents(contract, "CoinFlipResponse", {
    subscribe: true,
  });

  if (resEventError) {
    console.log({ resEventError });
  }

  if (contractError) {
    console.log({ contractError });
  }

  if (linkBalanceError) {
    return <p>{linkBalanceError.message}</p>;
  }

  if (isContractLoading) {
    return <p>Loading contract...</p>;
  }

  if (eventReqData) {
    console.log({ eventReqData });
  }

  if (eventResData) {
    console.log({ eventResData });
  }

  const flipAsync = async (choice) => {
    try {
      const data = await contract.call("flip", [choice], callOverride);
      console.log({ data });
    } catch (error) {
      console.log({ error });
    }
  };

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
        <p>FlipCoin address:</p>
        <h6>{flipCoinAddress}</h6>
      </div>
      <div>
        <p>Link Balance of Contract</p>
        {isLinkBalanceLoading ? (
          <p>Loading balance...</p>
        ) : (
          <p>{linkBalance.toString() / 10 ** 18}</p>
        )}
      </div>
      <div>
        {address && (
          <>
            <Web3Button
              contractAddress={flipCoinAddress}
              action={() => flipAsync(0)}
            >
              🎧
            </Web3Button>
            -
            <Web3Button
              contractAddress={flipCoinAddress}
              action={() => flipAsync(1)}
            >
              🦎
            </Web3Button>
          </>
        )}
      </div>
      <div className="container">
        <div className="column">
          {isReqEventLoading && <p>Requests loading...</p>}
          {eventReqData &&
            eventReqData.length &&
            eventReqData
              .filter((event) => event.data.sender === address)
              .map((event, i) => {
                return (
                  <div key={i}>
                    <p>Choice: {event.data.side === 0 ? "🎧" : "🦎"}</p>
                  </div>
                );
              })}
        </div>
        <div className="column">
          {isResEventLoading && <p>Responses loading...</p>}
          {eventResData &&
            eventResData.length &&
            eventResData
              .filter((event) => event.data.sender === address)
              .map((event, i) => {
                return (
                  <div key={i}>
                    <p>Won: {event.data.isWon ? "✔" : "❌"}</p>
                  </div>
                );
              })}
        </div>
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
