import { useRef } from "react";
import "./App.css";
import Field from "./classes/Field";

const WIDTH = 10;
const HEIGHT = 10;
const MINES = 10;

const COLORS = [
  "white",
  "blue",
  "green",
  "red",
  "purple",
  "darkorange",
  "brown",
  "pink",
  "black",
];

function App() {
  const field = useRef(new Field(WIDTH, HEIGHT, MINES)).current;

  return (
    <>
      Minesweeper
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${WIDTH}, 50px)`,
          gridTemplateRows: ` repeat(${HEIGHT}, 50px)`,
        }}
      >
        {field.grid.map((line) =>
          line.map((mine) => (
            <div
              key={mine.id}
              style={{
                width: 50,
                height: 50,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 22,
                border: "1px solid black",
              }}
            >
              {mine.type === "MINE" ? (
                <div style={{ color: "black", fontSize: 40, fontWeight: 900 }}>
                  X
                </div>
              ) : mine.value > 0 ? (
                <div style={{ color: COLORS[mine.value], fontWeight: 700 }}>
                  {mine.value}
                </div>
              ) : (
                ""
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default App;
