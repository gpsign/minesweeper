import "./App.css";
import Minefield from "./components/Minefield";

const WIDTH = 10;
const HEIGHT = 10;
const MINES = 10;

function App() {
  return (
    <>
      Minesweeper
      <Minefield width={WIDTH} height={HEIGHT} mines={MINES} />
    </>
  );
}

export default App;
