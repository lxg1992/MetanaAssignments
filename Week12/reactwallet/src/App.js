import logo from "./logo.svg";
import "./App.css";
import { useContext } from "react";
import { MyContext } from "./context/Ctx";
import Anonymous from "./components/Anonymous";
import Known from "./components/Known";

function App() {
  const ctx = useContext(MyContext);
  console.log(ctx);

  return ctx.account.isSet ? <Known /> : <Anonymous />;
}

export default App;
