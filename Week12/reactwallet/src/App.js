import logo from "./logo.svg";
import "./App.css";
import { useContext } from "react";
import { AccountCtx } from "./context/AccountCtx";

function App() {
  const ctx = useContext(AccountCtx);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Is set {ctx.account.isSet}</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
