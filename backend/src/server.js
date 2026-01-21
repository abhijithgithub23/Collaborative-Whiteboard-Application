import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import dotenv from "dotenv";
import express from "express";

import app from "./app.js";
import connectDB from "./config/db.js";
import { socketHandler } from "./socket/socket.js";

dotenv.config();

// ES module dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"]
  }
});

// Socket events
socketHandler(io);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(
    express.static(path.join(__dirname, "../../frontend/dist"))
  );

  app.get("*", (req, res) => {
    res.sendFile(
      path.join(__dirname, "../../frontend/dist/index.html")
    );
  });
}

// Start server ONLY after DB connects
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Server failed to start:", err);
    process.exit(1);
  }
};

startServer();