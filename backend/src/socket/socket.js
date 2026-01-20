export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    socket.on("join-room", (roomId) => {
      socket.join(roomId);
    });

    socket.on("draw", (data) => {
      socket.to(data.roomId).emit("draw", data);
    });

    socket.on("clear-canvas", (roomId) => {
      socket.to(roomId).emit("clear-canvas");
    });
  });
};
