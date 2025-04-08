import { createContext } from "react";
import Mine from "../classes/Mine";

export interface IMinefield {
  width: number;
  height: number;
  mines: number;
}

export type SetMineFunction = (
  x: number,
  y: number,
  callback: (this: Mine) => void
) => void;

interface IFieldContext {
  set: SetMineFunction;
  gameover: boolean;
  endGame: VoidFunction;
}

const FieldContext = createContext<IFieldContext | null>(null);

export { FieldContext };
