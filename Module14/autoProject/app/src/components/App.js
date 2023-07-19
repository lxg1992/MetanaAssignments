import { EthereumContext } from "../eth/context";
import { createProvider } from "../eth/provider";
import { createInstance } from "../eth/registry";

import "./App.css";
import Entries from "./Entries";
import Enter from "./Enter";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const provider = createProvider();
  const lottery = createInstance(provider);
  const ethereumContext = { provider, lottery };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AutoLottery</h1>
      </header>
      <section className="App-content">
        <EthereumContext.Provider value={ethereumContext}>
          <Enter />
          <Entries />
        </EthereumContext.Provider>
      </section>
      <ToastContainer hideProgressBar={true} />
    </div>
  );
}

export default App;
