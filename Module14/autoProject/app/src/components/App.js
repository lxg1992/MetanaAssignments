import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { ethers } from "ethers";

import { EthereumContext } from "../eth/context";
import { createProvider } from "../eth/provider";
import { createInstance } from "../eth/registry";

import "./App.css";
import Entries from "./Entries";
import Enter from "./Enter";
import LatestEntrants from "./LatestEntrants";

import "react-toastify/dist/ReactToastify.css";
import PreviousWinners from "./PreviousWinners";

function App() {
  const provider = createProvider();
  const lottery = createInstance(provider);
  const ethereumContext = { provider, lottery };

  const [roundNumber, setRoundNumber] = useState(undefined);
  const [entrants, setEntrants] = useState(undefined);
  const [picks, setPicks] = useState(undefined);
  const [previousWinners, setPreviousWinners] = useState(undefined);
  const [previousPicks, setPreviousPicks] = useState(undefined);
  const [address, setAddress] = useState(undefined);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    lottery.roundNumber().then((rnum) => {
      setRoundNumber(rnum);
    });

    lottery.getLatestEntrants().then((entrants) => {
      setEntrants(entrants);
    });

    lottery.getLatestPicks().then((picks) => {
      setPicks(picks);
    });

    lottery.getPreviousWinners().then((previousWinners) => {
      setPreviousWinners(previousWinners);
    });

    lottery.getPreviousWinningPicks().then((previousPicks) => {
      setPreviousPicks(previousPicks);
    });
  }, [trigger]);

  useEffect(() => {
    async function getAddress() {
      await window.ethereum.enable();
      const userProvider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = userProvider.getSigner();
      const from = await signer.getAddress();
      setAddress(from);
    }
    getAddress();
  }, [trigger]);

  const props = {
    roundNumber,
    entrants,
    picks,
    previousWinners,
    previousPicks,
    setTrigger,
    address: address ? address : "0x",
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AutoLottery</h1>
      </header>
      <section className="App-content">
        <EthereumContext.Provider value={ethereumContext}>
          <Enter {...props} />
          <div className="Flex-row">
            {/* <div className="Flex-column"> */}
            <LatestEntrants {...props} />
            {/* </div> */}
            <PreviousWinners {...props} />
          </div>
          <Entries {...props} />
        </EthereumContext.Provider>
      </section>
      <ToastContainer hideProgressBar={true} />
    </div>
  );
}

export default App;
