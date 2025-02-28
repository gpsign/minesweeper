import "./App.css";
import Minefield from "./components/Minefield";

const WIDTH = 99;
const HEIGHT = 99;
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
