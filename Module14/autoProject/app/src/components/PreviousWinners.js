import React from "react";
import "./PreviousWinners.css";

const PreviousWinners = ({ previousWinners, previousPicks }) => {
  const rows = [];
  if (previousWinners && previousPicks) {
    for (let i = 0; i < previousWinners.length; i++) {
      rows.push({ winner: previousWinners[i], pick: previousPicks[i] });
    }
  }

  // Get the current address
  // const { provider } = useContext(EthereumContext);
  // console.log({ provider });
  // console.log(provider.getSigner());


  return (
    <div className="PreviousWinners">
      <h3>Previous Winners</h3>
      {rows?.map((r, i) => {
        if (r.pick === 255) {
          // 255 is a forced value outside of 0 - 99
          return <div key={i}>R: {i} - No Winner!</div>;
        }
        return (
          <div className="address" key={i}>
            R: {i} - {r.winner} picked {r.pick}
          </div>
        );
      })}
    </div>
  );
};

export default PreviousWinners;
