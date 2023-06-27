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
  const [requests, setRequests] = useState([]);
  const [responses, setResponses] = useState([]);
  const [times, setTimes] = useState([]);
  const [intervalTimer, setIntervalTimer] = useState(0);
  const [reqTx, setReqTxData] = useState({});
  const [resTx, setResTxData] = useState({});
  const address = useAddress();
  const connectWithMM = useMetamask();

  const isAwaitingResponse = requests.length !== responses.length;
  console.log({ waiting: isAwaitingResponse });

  const timerRender = () => {
    switch (intervalTimer) {
      case 0:
        return "🕛";
      case 11:
        return "🕚";
      case 10:
        return "🕙";
      case 9:
        return "🕘";
      case 8:
        return "🕗";
      case 7:
        return "🕖";
      case 6:
        return "🕕";
      case 5:
        return "🕔";
      case 4:
        return "🕓";
      case 3:
        return "🕒";
      case 2:
        return "🕑";
      case 1:
        return "🕐";
      default:
        return "🕛";
    }
  };

  const {
    contract,
    isLoading: isContractLoading,
    error: contractError,
  } = useContract(flipCoinAddress, FlipCoinABI);

  useEffect(() => {
    const interval = setInterval(() => {
      setIntervalTimer((prev) => {
        if (prev <= 11) {
          return prev + 1;
        }
        return 0;
      });
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const unsubReq = contract?.events?.addEventListener(
      "CoinFlipRequest",
      (event) => {
        console.log("triggering");

        setReqTxData({});
        setRequests((prev) => [...prev, event]);
        setTimes((prev) => [...prev, new Date().toLocaleTimeString("en-US")]);
        setIntervalTimer(0);
        // setReqTxData(event.transaction);
        console.log({ eventReq: event });
      }
    );
    const unsubRes = contract?.events?.addEventListener(
      "CoinFlipResponse",
      (event) => {
        setResTxData({});
        setResponses((prev) => [...prev, event]);
        setIntervalTimer(0);
        // setResTxData(event.transaction);
        console.log({ eventRes: event });
      }
    );

    return () => {
      if (typeof unsubReq === "function") {
        unsubReq();
      }
      if (typeof unsubRes === "function") {
        unsubRes();
      }
    };
  }, [contract]);

  const {
    data: linkBalance,
    isLoading: isLinkBalanceLoading,
    error: linkBalanceError,
  } = useContractRead(contract, "getContractERC20Balance");

  if (contractError) {
    console.log({ contractError });
  }

  if (linkBalanceError) {
    return <p>{linkBalanceError.message}</p>;
  }

  if (isContractLoading) {
    return <p>Loading contract...</p>;
  }

  const flipAsync = async (choice) => {
    try {
      const data = await contract.call("flip", [choice], callOverride);
      console.log({ data });
    } catch (error) {
      console.log({ error });
    }
  };

  console.log(intervalTimer);

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
      <div className="centered">
        {address && !isAwaitingResponse ? (
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
        ) : (
          <>
            <Web3Button action={() => alert("Please wait")}>
              Waiting for response
            </Web3Button>
          </>
        )}
      </div>
      {/* <div className="centered">stuff</div> */}
      <div className="container">
        <div className="column">
          {requests.length > 0 &&
            requests
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
          {times.map((time, i) => (
            <p key={i}>{time}</p>
          ))}
        </div>
        <div className="column">
          {responses.length > 0 &&
            responses
              .filter((event) => event.data.sender === address)
              .map((event, i) => {
                return (
                  <div key={i}>
                    <p>Won: {event.data.isWon ? "✔" : "❌"}</p>
                  </div>
                );
              })}
          {isAwaitingResponse && (
            <div>
              <h3>Wait...{timerRender()}</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

/**
 * // SUBSCRIBE TO EVENT Request and Response
 * ? SHOW THE REQUEST ID
 *
 * // ON FLIP REQUEST, SHOW LOADING (prevent further flips)
 * * FILTER EVENTS BASED ON THE REQUEST ID AND ADDRESS
 * * SHOW THE RESULT OF THE FLIP
 * ? LOCAL HISTORY
 */
