import { useContext } from "react";
import { DialogControlsContext } from "../context/DialogControlsContext";

export default function useDialogControls() {
  const controls = useContext(DialogControlsContext);
  if (controls === null) throw "Deve ser usado dentro de um DialogProvider!";
  return controls;
}
