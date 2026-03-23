import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import StatsCards from "../../components/StatsCard";
import Tabs from "../../components/Tabs";
import SearchBar from "../../components/SearchBar";
import ItemCard from "../../components/ItemCard";
import { getAllItems, getStats } from "../../api/lostFound";
import "../../styles/lostfound.css";

const LostFound = () => {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({});
  const [activeTab, setActiveTab] = useState("Active");
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  let storedUser = {};
  try {
    storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  } catch (error) {
    console.error("Failed to parse stored user", error);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [itemsData, statsData] = await Promise.all([getAllItems(), getStats()]);
      setItems(itemsData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load lost and found data", error);
      setItems([]);
      setStats({ total: 0, active: 0, claimed: 0, latestDate: "No data" });
    }
  };

  const filteredItems = items
    .filter((item) =>
      activeTab === "All"
        ? true
        : (item.status || "").toLowerCase() === activeTab.toLowerCase()
    )
    .filter((item) =>
      (item.title || "").toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="container">
      <Header
        onMenuClick={() => setMenuOpen(true)}
        user={storedUser}
        profileOpen={profileOpen}
        setProfileOpen={setProfileOpen}
      />

      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        user={storedUser}
      />

      <h2>Lost and Found</h2>

      <StatsCards stats={stats} />

      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <SearchBar search={search} setSearch={setSearch} />

      <div className="list">
        {filteredItems.map((item) => (
          <ItemCard key={item._id} item={item} />
        ))}
        {filteredItems.length === 0 && (
          <p className="empty-text">No lost and found items found.</p>
        )}
      </div>
    </div>
  );
};

export default LostFound;