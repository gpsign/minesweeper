import "./App.css";
import Utils from "./classes/Utils";
import Minefield from "./components/Minefield";

const WIDTH = Utils.nvv(16, Math.floor(window.innerWidth / 100))!;
const HEIGHT = Utils.nvv(30, Math.floor(window.innerHeight / 100))!;
const MINES = Utils.nvv(99, Math.floor((WIDTH * HEIGHT) / 5))!;

function App() {
  return (
    <>
      {/* Minesweeper */}
      <Minefield width={WIDTH} height={HEIGHT} mines={MINES} />
    </>
  );
}

export default App;
