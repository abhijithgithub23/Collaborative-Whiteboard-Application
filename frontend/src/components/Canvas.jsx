import { useEffect, useRef, useState } from "react";
import socket from "../socket";

export default function Canvas({ roomId }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#000");
  const [tool, setTool] = useState("pen");

  // Initialize canvas and load snapshot
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctxRef.current = canvas.getContext("2d");

    // Load latest snapshot from backend
    const loadSnapshot = async () => {
      try {
        const res = await fetch(`http://localhost:5005/api/snapshots/${roomId}`);
        const data = await res.json();
        if (data?.image) {
          const img = new Image();
          img.src = data.image;
          img.onload = () => {
            ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
            ctxRef.current.drawImage(img, 0, 0);
          };
        }
      } catch (err) {
        console.error("Failed to load snapshot:", err);
      }
    };
    loadSnapshot();

    // Listen for real-time drawing
    socket.on("draw", drawFromServer);
    socket.on("clear-canvas", clearCanvasFromServer);

    return () => socket.off();
  }, [roomId]);

  // Draw received from server
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

    socket.emit("draw", { roomId, x0, y0, x1, y1, color, tool });

    ctxRef.current.lastX = x1;
    ctxRef.current.lastY = y1;
  };

  const stopDraw = () => setDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    socket.emit("clear-canvas", roomId);
  };

  const clearCanvasFromServer = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSnapshot = async () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL();

    try {
      await fetch(`http://localhost:5005/api/snapshots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, image }),
      });
      alert("Snapshot saved!");
    } catch (err) {
      console.error("Failed to save snapshot:", err);
    }
  };

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
          alignItems: "center",
          padding: "10px 0",
          backgroundColor: "#1f2937",
          boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
          zIndex: 10,
        }}
      >
        <button
          onClick={() => setTool("pen")}
          style={{
            backgroundColor: tool === "pen" ? "#2563eb" : "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            padding: "8px 16px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Pen
        </button>

        <button
          onClick={() => setTool("eraser")}
          style={{
            backgroundColor: tool === "eraser" ? "#ef4444" : "#f87171",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            padding: "8px 16px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Eraser
        </button>

        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{ width: "40px", height: "40px", border: "none", borderRadius: "50%", cursor: "pointer" }}
        />

        <button
          onClick={clearCanvas}
          style={{
            backgroundColor: "#fbbf24",
            color: "#000",
            border: "none",
            borderRadius: "5px",
            padding: "8px 16px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Clear
        </button>

        <button
          onClick={saveSnapshot}
          style={{
            backgroundColor: "#10b981",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            padding: "8px 16px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Save
        </button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        style={{ display: "block", border: "2px solid black",  }}
      />
    </>
  );
}