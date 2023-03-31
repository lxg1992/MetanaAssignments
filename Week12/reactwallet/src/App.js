import logo from "./logo.svg";
import "./App.css";
import { useContext } from "react";
import { MyContext } from "./context/Ctx";

function App() {
  const ctx = useContext(MyContext);
  console.log(ctx);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
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
