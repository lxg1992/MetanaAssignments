import React from "react";
import "./LatestEntrants.css";

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
    for (let i = 0; i < picks; i++) {}
  }
  return (
    <div className="LatestEntrants-Item">
      {entrants === undefined && <span>Loading..</span>}
      {entrants?.map((e) => {
        return <div className="address">{e}</div>;
      })}
    </div>
  );
};

export default LatestEntrants;
