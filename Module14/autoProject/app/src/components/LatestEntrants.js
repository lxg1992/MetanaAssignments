import React, { useContext } from "react";

import { EthereumContext } from "../eth/context";
import "./LatestEntrants.css";
import { f6l4 } from "../helpers/string";

const LatestEntrants = ({
  roundNumber,
  entrants,
  picks,
  previousWinners,
  previousPicks,
  address,
}) => {
  const rows = [];
  if (picks && entrants) {
    for (let i = 0; i < picks.length; i++) {
      rows.push({ pick: picks[i], entrant: entrants[i] });
    }
  }
  return (
    <div className="LatestEntrants-Item">
      <h3> Latest Round Entrants-Picks</h3>
      {rows.length === 0 && <span>Loading..</span>}
      {rows?.map((r, i) => {
        return (
          <div key={i} className={address === r.entrant ? "pseudo-You" : ""}>
            {f6l4(r.entrant)} picked {r.pick}
          </div>
        );
      })}
    </div>
  );
};

export default LatestEntrants;
