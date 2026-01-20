import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import { socketHandler } from "./socket/socket.js";

dotenv.config();
connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

socketHandler(io);

server.listen(process.env.PORT, () =>
  console.log(`Server running on ${process.env.PORT}`)
);
