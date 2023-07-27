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

function Entries({ setTrigger }) {
  const { lottery } = useContext(EthereumContext);
  const [entriesEv, setEntriesEv] = useState(undefined);

  // Entered Events
  useEffect(() => {
    const filter = lottery.filters.Entered();

    const listener = (...args) => {
      const event = args[args.length - 1];
      setEntriesEv((rs) => [mapEvent(event), ...(rs || [])]);
      setTrigger((t) => t + 1);
    };

    const subscribe = async () => {
      const past = await lottery.queryFilter(filter);
      setEntriesEv((past.reverse() || []).map(mapEvent));
      lottery.on(filter, listener);
    };

    subscribe();
    return () => lottery.off(filter, listener);
  }, []);

  return (
    <div className="Entrants-Item">
      <h3>Last entries logged (guess, address, isPaid)</h3>
      {entriesEv === undefined && <span>Loading..</span>}
      {entriesEv && (
        <ul>
          {entriesEv.map((e) => (
            <li key={e.id}>
              <div className="address">
                {e.guess} {e.who}
                &nbsp;
                {e.isPaid.toString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Entries;
