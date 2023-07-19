import { useRef, useState, useContext } from "react";
import { registerName } from "../eth/register";
import { EthereumContext } from "../eth/context";
import { toast } from "react-toastify";
import "./Register.css";

function Register() {
  const guessInput = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const { lottery, provider } = useContext(EthereumContext);

  const sendTx = async (event) => {
    event.preventDefault();
    const guess = guessInput.current.value;
    setSubmitting(true);

    try {
      const response = await registerName(lottery, provider, guess);
      const hash = response.hash;
      const onClick = hash
        ? () => window.open(`https://goerli.etherscan.io/tx/${hash}`)
        : undefined;
      toast("Transaction sent!", { type: "info", onClick });
      guessInput.current.value = "";
    } catch (err) {
      toast(err.message || err, { type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="Container">
      <form onSubmit={sendTx}>
        <input
          required={true}
          placeholder="Register your guess here"
          ref={guessInput}
        ></input>
        <button type="submit" disabled={submitting}>
          {submitting ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}

export default Register;
