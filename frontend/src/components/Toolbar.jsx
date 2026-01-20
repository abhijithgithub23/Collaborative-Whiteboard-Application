export default function Toolbar({ setColor, setTool, clear }) {
  return (
    <div>
      <input type="color" onChange={(e) => setColor(e.target.value)} />
      <button onClick={() => setTool("pen")}>Pen</button>
      <button onClick={() => setTool("eraser")}>Eraser</button>
      <button onClick={clear}>Clear</button>
    </div>
  );
}
