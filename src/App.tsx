import "./App.css";
import { Store } from "./classes/Store";
import Utils from "./classes/Utils";
import Minefield from "./components/Minefield";
import Zoom from "./components/Zoom";

const WIDTH = Utils.nvv(16, Math.floor(window.innerWidth / 100))!;
const HEIGHT = Utils.nvv(30, Math.floor(window.innerHeight / 100))!;
const MINES = Utils.nvv(99, Math.floor((WIDTH * HEIGHT) / 5))!;
Store.set("remaining", MINES);

function App() {
  return (
    <Zoom>
      <Minefield width={WIDTH} height={HEIGHT} mines={MINES} />
    </Zoom>
  );
}

export default App;
