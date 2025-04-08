import { createContext, FunctionComponent } from "react";
import { DialogID } from "./DialogControlsContext";

export enum DialogStatus {
  open,
  closed,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IDialog<T = any> {
  status: DialogStatus;
  id: DialogID;
  Component: FunctionComponent;
  confirm: (value: T) => void;
  close: VoidFunction;
}

const DialogDataContext = createContext<IDialog | null>(null);

export { DialogDataContext };
