import express from "express";
import Snapshot from "../models/Snapshot.js";

const router = express.Router();

// Save snapshot
router.post("/", async (req, res) => {
  try {
    const { roomId, image } = req.body;

    if (!roomId || !image) {
      return res.status(400).json({ message: "roomId and image required" });
    }

    const snapshot = await Snapshot.findOneAndUpdate(
      { roomId },                 // find by roomId
      { image },                  // update image
      {
        new: true,                // return updated doc
        upsert: true,             // create if not exists
      }
    );

    res.status(200).json(snapshot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save snapshot" });
  }
});

// Get latest snapshot
router.get("/:roomId", async (req, res) => {
  const snapshot = await Snapshot.findOne({ roomId: req.params.roomId })
    .sort({ createdAt: -1 });

  res.json(snapshot);
});

/* Get latest snapshot per room */
router.get("/rooms", async (req, res) => {
  try {
    const rooms = await Snapshot.aggregate([
      { $sort: { updatedAt: -1 } },
      {
        $group: {
          _id: "$roomId",
          updatedAt: { $first: "$updatedAt" },
        },
      },
      { $sort: { updatedAt: -1 } },
    ]);

    res.json(rooms.map(r => r._id));
  } catch (err) {
    res.status(500).json({ error: "Failed to load rooms" });
  }
});
// ✅ Get all available rooms
router.get("/", async (req, res) => {
  const rooms = await Snapshot.distinct("roomId");
  res.json(rooms);
});

export default router;
