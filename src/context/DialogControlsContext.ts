import { createContext } from "react";

export type DialogID = number;

export interface IDialogControls {
  open: <T = unknown>(component: React.FunctionComponent) => Promise<T | null>;
  close: (id: DialogID) => void;
}

const DialogControlsContext = createContext<IDialogControls | null>(null);

export { DialogControlsContext };
