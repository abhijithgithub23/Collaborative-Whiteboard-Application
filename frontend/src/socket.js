// // frontend/src/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = "https://collaborative-whiteboard-application.onrender.com";

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
});

export default socket;  // ✅ default export