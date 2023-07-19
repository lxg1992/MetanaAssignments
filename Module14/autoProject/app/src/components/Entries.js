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

function Entries() {
  const { lottery } = useContext(EthereumContext);
  const [registrations, setRegistrations] = useState(undefined);

  useEffect(() => {
    const filter = lottery.filters.Entered();

    const listener = (...args) => {
      const event = args[args.length - 1];
      setRegistrations((rs) => [mapEvent(event), ...(rs || [])]);
    };

    const subscribe = async () => {
      const past = await lottery.queryFilter(filter);
      setRegistrations((past.reverse() || []).map(mapEvent));
      lottery.on(filter, listener);
    };

    subscribe();
    return () => lottery.off(filter, listener);
  }, [lottery]);

  return (
    <div className="Registrations">
      <h3>Last registrations 📝</h3>
      {registrations === undefined && <span>Loading..</span>}
      {registrations && (
        <ul>
          {registrations.map((r) => (
            <li key={r.id}>
              <span className="address">{r.who}</span> {r.guess}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Entries;
