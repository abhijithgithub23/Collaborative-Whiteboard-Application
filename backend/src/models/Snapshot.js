import mongoose from "mongoose";

const snapshotSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true },
    image: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Snapshot", snapshotSchema);
