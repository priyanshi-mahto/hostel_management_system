import React from "react";

const StatsCards = ({ stats }) => {
  return (
    <div className="stats">
      <div className="card">
        <h3>{stats.total}</h3>
        <p>Total Items</p>
      </div>

      <div className="card">
        <h3>{stats.active}</h3>
        <p>Active Items</p>
      </div>

      <div className="card">
        <h3>{stats.claimed}</h3>
        <p>Claimed</p>
      </div>

      <div className="card">
        <h3>{stats.latestDate}</h3>
        <p>Latest</p>
      </div>
    </div>
  );
};

export default StatsCards;