import "./App.css";
import Minefield from "./components/Minefield";

const WIDTH = Math.floor(window.innerWidth / 100);
const HEIGHT = Math.floor(window.innerHeight / 100);
const MINES = Math.floor((WIDTH * HEIGHT) / 5);

function App() {
  return (
    <>
      {/* Minesweeper */}
      <Minefield width={WIDTH} height={HEIGHT} mines={MINES} />
    </>
  );
}

export default App;
