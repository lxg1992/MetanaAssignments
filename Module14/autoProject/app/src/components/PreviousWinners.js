import React from "react";
import "./PreviousWinners.css";

const PreviousWinners = ({ previousWinners, previousPicks }) => (
  <div className="PreviousWinners">
    <h3>PreviousWinners Component</h3>
    {previousWinners?.map((e) => (
      <div>{e}</div>
    ))}
    {previousPicks?.map((e) => (
      <div>{e}</div>
    ))}
  </div>
);

export default PreviousWinners;
