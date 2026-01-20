import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Room from "./pages/Room";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/room/test123" />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
}