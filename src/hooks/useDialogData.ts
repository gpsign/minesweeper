import { useContext } from "react";
import { DialogDataContext } from "../context/DialogDataContext";

export function useDialogData() {
  const data = useContext(DialogDataContext);
  if (data === null) throw "Deve ser usado em um Dialog!";
  return data;
}
