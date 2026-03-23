import React from "react";

const ItemCard = ({ item }) => {
  return (
    <div className="item-card">
      <div className="item-header">
        <h4>{item.title}</h4>
        <span className={`status ${(item.status || "").toLowerCase()}`}>
          {item.status}
        </span>
      </div>

      <p>ID: {item._id}</p>
      <p className="date">{new Date(item.date).toDateString()}</p>

      <div className="desc">
        {item.description}
      </div>
    </div>
  );
};

export default ItemCard;