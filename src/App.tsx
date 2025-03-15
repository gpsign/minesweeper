import "./App.css";
import DialogProvider from "./components/DialogProvider";
import Minefield from "./components/Minefield";
import Zoom from "./components/Zoom";

function App() {
  return (
    <DialogProvider>
      <Zoom>
        <Minefield />
      </Zoom>
    </DialogProvider>
  );
}

export default App;
