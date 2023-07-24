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

function Entries({
  roundNumber,
  entrants,
  picks,
  previousWinners,
  previousPicks,
}) {
  const { lottery } = useContext(EthereumContext);
  const [entriesEv, setEntriesEv] = useState(undefined);

  console.log("Filters", lottery.filters);

  // Entered Events
  useEffect(() => {
    const filter = lottery.filters.Entered();
    console.log("Filter", filter);

    const listener = (...args) => {
      const event = args[args.length - 1];
      setEntriesEv((rs) => [mapEvent(event), ...(rs || [])]);
    };

    const subscribe = async () => {
      const past = await lottery.queryFilter(filter);
      console.log({ past });
      setEntriesEv((past.reverse() || []).map(mapEvent));
      lottery.on(filter, listener);
    };

    subscribe();
    return () => lottery.off(filter, listener);
  }, []);

  return (
    <div className="Registrations">
      <h3>Last entries 📝</h3>
      {entriesEv === undefined && <span>Loading..</span>}
      {entriesEv && (
        <ul>
          {entriesEv.map((e) => (
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
