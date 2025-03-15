import { createContext } from "react";

export type DialogID = number;

export interface IDialogControls {
  open: (component: React.FunctionComponent) => DialogID;
  close: (id: DialogID) => void;
}

const DialogControlsContext = createContext<IDialogControls | null>(null);

export { DialogControlsContext };
