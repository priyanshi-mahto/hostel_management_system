import {
  getAllItems,
  getStats,
  createItem,
  updateItemStatus
} from "../models/lostFound.model.js";

// GET ITEMS
export const fetchItems = async (req, res) => {
  try {
    const items = await getAllItems();

    const formatted = items.map(item => ({
      _id: item.item_id,
      title: item.item_name,
      status: item.status,
      type: item.type,
      date: item.date,
      description:
        item.type === "Found"
          ? "Please contact hostel office"
          : "Lost item reported"
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET STATS
export const fetchStats = async (req, res) => {
  try {
    const data = await getStats();

    res.json({
      total: Number(data?.total || 0),
      active: Number(data?.active || 0),
      claimed: Number(data?.claimed || 0),
      latestDate: data?.latest ? new Date(data.latest).toDateString() : "No data"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADD ITEM
export const addItem = async (req, res) => {
  try {
    const { item_name, type, hostel_id } = req.body;

    await createItem({
      item_name,
      type,
      hostel_id
    });

    res.json({ message: "Item added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CLAIM ITEM
export const claimItem = async (req, res) => {
  try {
    await updateItemStatus(req.params.itemId, "Claimed");

    res.json({ message: "Item claimed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};