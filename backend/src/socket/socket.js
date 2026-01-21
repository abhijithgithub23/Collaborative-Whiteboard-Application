export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on("draw", (data) => {
      socket.to(data.roomId).emit("draw", data);
    });

    socket.on("clear-canvas", (roomId) => {
      socket.to(roomId).emit("clear-canvas");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};