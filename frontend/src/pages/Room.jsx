import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Canvas from "../components/Canvas";
import RoomList from "../components/RoomList";
import socket from "../socket";

export default function Room() {
  const { roomId } = useParams();

  useEffect(() => {
    if (!roomId) return;

    socket.emit("join-room", roomId);

    return () => {
      socket.emit("leave-room", roomId);
    };
  }, [roomId]);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {/* Canvas area */}
      <div style={{ flex: 1, position: "relative" }}>
        <Canvas roomId={roomId} />
      </div>

      {/* Room list sidebar
      <div style={{ width: "260px", flexShrink: 0 }}>
        <RoomList />
      </div> */}
    </div>
  );
}