import "./App.css";
import Minefield from "./components/Minefield";

const WIDTH = 16;
const HEIGHT = 30;
const MINES = 99;

function App() {
  return (
    <>
      Minesweeper
      <Minefield width={WIDTH} height={HEIGHT} mines={MINES} />
    </>
  );
}

export default App;
