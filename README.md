#  Collaborative Whiteboard Application

A real-time collaborative whiteboard built using **MERN stack** and **Socket.IO**, allowing multiple users to draw simultaneously on a shared canvas and persist drawings for later access.

---

##  Features

- Real-time drawing synchronization using **Socket.IO**
- Multiple users can join the same whiteboard room
- Canvas tools:
  - Pen
  - Eraser
  - Color picker
  - Clear canvas
- Persistent canvas state using **MongoDB**
- Saved whiteboards can be reopened later
- Unique room-based collaboration
- Late joiners see the latest saved canvas state

---

##  Architecture Overview

This application separates **real-time communication** and **data persistence**:

- **Socket.IO** handles live drawing events (no database involvement)
- **MongoDB** stores the latest canvas snapshot per room
- Frontend restores canvas state when a room is opened

  ---

##  Tech Stack

### Frontend
- React (Vite)
- Canvas API
- Socket.IO Client
- React Router
- Plain CSS

### Backend
- Node.js
- Express.js
- Socket.IO
- MongoDB + Mongoose

---


##  Socket.IO Flow (Backend)

- Client connects → `connection`
- Client joins room → `join-room`
- Drawing data broadcasted → `draw`
- Canvas cleared → `clear-canvas`
- Room-based isolation using `socket.join(roomId)`

---



##  Setup Instructions

1. Clone the repository
   -git clone https://github.com/abhijithgithub23/Collaborative-Whiteboard-Application.git
   -cd Collaborative-Whiteboard-Application

2. Backend setup
   -cd backend
-npm install
-npm run dev

3. Frontend setup
   -cd frontend
-npm install
-npm run dev
