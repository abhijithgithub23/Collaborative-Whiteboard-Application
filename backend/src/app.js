import express from "express";
import cors from "cors";
import snapshotRoutes from "./routes/snapshotRoutes.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/snapshots", snapshotRoutes);

export default app;