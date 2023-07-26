import React from "react";
import "./LatestEntrants.css";
import { f6l4 } from "../helpers/string";

const LatestEntrants = ({
  roundNumber,
  entrants,
  picks,
  previousWinners,
  previousPicks,
}) => {
  console.log({ roundNumber });
  console.log({ entrants });
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
      {rows?.map((e) => {
        return (
          <div className="address">
            {f6l4(e.entrant)}-{e.pick}
          </div>
        );
      })}
    </div>
  );
};

export default LatestEntrants;
