import { io } from "socket.io-client";

const socket = io(); // automatically connects to the same origin
export default socket;