import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RoomList() {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("http://localhost:5005/api/snapshots");
        const data = await res.json();
        setRooms(data);
      } catch (err) {
        console.error("Failed to fetch rooms", err);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div
      style={{
        width: "260px",
        borderLeft: "1px solid #ddd",
        padding: "12px",
        background: "#fafafa",
      }}
    >
      <h3 style={{ marginBottom: "12px" }}>Saved Rooms</h3>

      {rooms.length === 0 && <p>No saved rooms</p>}

      {rooms.map((room) => (
        <div
          key={room}
          onClick={() => navigate(`/room/${room}`)}
          style={{
            padding: "10px",
            marginBottom: "8px",
            cursor: "pointer",
            background: "#fff",
            borderRadius: "6px",
            border: "1px solid #ddd",
          }}
        >
          {room}
        </div>
      ))}
    </div>
  );
}