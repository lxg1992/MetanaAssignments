import { useContext, useState, useEffect } from "react";
import { EthereumContext } from "../eth/context";
import "./Entries.css";

const mapEvent = (event) => ({
  blockNumber: event.blockNumber,
  who: event.args.who,
  guess: event.args.guess,
  isPaid: event.args.isPaid,
  // name: event.args.name,
  id: `${event.blockHash}/${event.transactionIndex}/${event.logIndex}`,
});

function Entries({ roundNumber }) {
  const { lottery } = useContext(EthereumContext);
  const [entries, setEntries] = useState(undefined);

  console.log("Filters", lottery.filters);

  // Entered Events
  useEffect(() => {
    const filter = lottery.filters.Entered();

    const listener = (...args) => {
      const event = args[args.length - 1];
      setEntries((rs) => [mapEvent(event), ...(rs || [])]);
    };

    const subscribe = async () => {
      const past = await lottery.queryFilter(filter);
      console.log({ past });
      setEntries((past.reverse() || []).map(mapEvent));
      lottery.on(filter, listener);
    };

    subscribe();
    return () => lottery.off(filter, listener);
  }, [lottery]);

  return (
    <div className="Registrations">
      <h3>Last entries 📝</h3>
      {entries === undefined && <span>Loading..</span>}
      {entries && (
        <ul>
          {entries.map((e) => (
            <li key={e.id}>
              {console.log(e)}
              <span className="address">
                {e.guess} {e.who}
                &nbsp;
                {e.isPaid.toString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Entries;
