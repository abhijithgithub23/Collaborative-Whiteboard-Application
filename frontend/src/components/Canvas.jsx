import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "https://collaborative-whiteboard-application.onrender.com";

export default function Canvas({ roomId }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const socketRef = useRef(null);

  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#000");
  const [tool, setTool] = useState("pen");

  // ===============================
  // INIT CANVAS + SOCKET
  // ===============================
  useEffect(() => {
    if (!roomId) return;

    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctxRef.current = canvas.getContext("2d");

    // ---- SOCKET INIT (PER CLIENT) ----
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
    });

    socketRef.current.emit("join-room", roomId);

    socketRef.current.on("draw", drawFromServer);
    socketRef.current.on("clear-canvas", clearCanvasFromServer);

    loadSnapshot();

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  // ===============================
  // LOAD SNAPSHOT
  // ===============================
  const loadSnapshot = async () => {
    try {
      const res = await fetch(`/api/snapshots/${roomId}`);
      const data = await res.json();

      if (data?.image) {
        const img = new Image();
        img.src = data.image;
        img.onload = () => {
          ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctxRef.current.drawImage(img, 0, 0);
        };
      }
    } catch (err) {
      console.error("Failed to load snapshot", err);
    }
  };

  // ===============================
  // DRAW HELPERS
  // ===============================
  const drawFromServer = ({ x0, y0, x1, y1, color, tool }) => {
    drawLine(x0, y0, x1, y1, color, tool);
  };

  const drawLine = (x0, y0, x1, y1, color, tool) => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
    }

    ctx.stroke();
  };

  // ===============================
  // MOUSE EVENTS
  // ===============================
  const startDraw = (e) => {
    setDrawing(true);
    ctxRef.current.lastX = e.clientX;
    ctxRef.current.lastY = e.clientY;
  };

  const draw = (e) => {
    if (!drawing) return;

    const x0 = ctxRef.current.lastX;
    const y0 = ctxRef.current.lastY;
    const x1 = e.clientX;
    const y1 = e.clientY;

    drawLine(x0, y0, x1, y1, color, tool);

    socketRef.current.emit("draw", {
      roomId,
      x0,
      y0,
      x1,
      y1,
      color,
      tool,
    });

    ctxRef.current.lastX = x1;
    ctxRef.current.lastY = y1;
  };

  const stopDraw = () => setDrawing(false);

  // ===============================
  // CLEAR CANVAS
  // ===============================
  const clearCanvas = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    socketRef.current.emit("clear-canvas", roomId);
  };

  const clearCanvasFromServer = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  // ===============================
  // SAVE SNAPSHOT
  // ===============================
  const saveSnapshot = async () => {
    const image = canvasRef.current.toDataURL();

    try {
      await fetch(`/api/snapshots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, image }),
      });
      alert("Snapshot saved!");
    } catch (err) {
      console.error("Failed to save snapshot", err);
    }
  };

  // ===============================
  // RENDER
  // ===============================
  return (
    <>
      {/* Toolbar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
          padding: "10px",
          background: "#1f2937",
          zIndex: 10,
        }}
      >
        <button onClick={() => setTool("pen")}>Pen</button>
        <button onClick={() => setTool("eraser")}>Eraser</button>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <button onClick={clearCanvas}>Clear</button>
        <button onClick={saveSnapshot}>Save</button>
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        style={{ display: "block", border: "2px solid black" }}
      />
    </>
  );
}