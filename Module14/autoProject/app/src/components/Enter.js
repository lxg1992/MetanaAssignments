import { useRef, useState, useContext } from "react";
import { registerName } from "../eth/register";
import { EthereumContext } from "../eth/context";
import { toast } from "react-toastify";
import "./Enter.css";

function Enter({ roundNumber, entrants, picks }) {
  const guessInput = useRef(null);
  const [relayTx, setRelayTx] = useState(false);

  const [isSubmissionAllowed, setSubmissionAllowed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { lottery, provider } = useContext(EthereumContext);

  const handleRelayCheckboxChange = (event) => {
    setRelayTx(event.target.checked);
  };

  const handleInputChange = (event) => {
    const curVal = guessInput.current.value;
    if (picks.includes(Number(curVal)) || curVal < 0 || curVal > 99) {
      setSubmissionAllowed(false);
      return;
    }
    setSubmissionAllowed(true);
  };

  const sendTx = async (event) => {
    event.preventDefault();
    const guess = guessInput.current.value;
    setSubmitting(true);

    try {
      const response = await registerName(lottery, provider, guess, relayTx);
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
      <h3 className="centered">Round: {roundNumber}</h3>
      <form onSubmit={sendTx}>
        <input
          required={true}
          placeholder="Enter your guess here"
          ref={guessInput}
          onChange={handleInputChange}
        ></input>
        <button type="submit" disabled={submitting || !isSubmissionAllowed}>
          {submitting ? "Entering..." : "Enter"}
        </button>
      </form>
      <label className="form-switch">
        <input
          type="checkbox"
          checked={relayTx}
          onChange={handleRelayCheckboxChange}
        />
        <i></i>
        Relay Tx?
      </label>
    </div>
  );
}

export default Enter;
