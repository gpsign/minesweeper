import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Field from "../classes/Field";
import Mine from "../classes/Mine";
import Tile from "./Tile";

interface IMinefieldProps {
  width: number;
  height: number;
  mines: number;
}

type SetMineFunction = (
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

export function useMineField() {
  const context = useContext(FieldContext);
  if (!context)
    throw "O hook deve ser usado dentro do <FieldContext.Provider>!";
  return context;
}

export default function Minefield({ width, height, mines }: IMinefieldProps) {
  const [field, setField] = useState(new Field(width, height, mines));
  const [gameover, setGameover] = useState(false);

  const set: SetMineFunction = (x, y, callback) => {
    const newField = new Field(field);
    const mine = newField.at(x, y);
    if (!mine) return;

    callback.apply(mine);

    setField(newField);
  };

  const style = useMemo(
    function generateTemplates() {
      return {
        gridTemplateColumns: `repeat(${width}, 50px)`,
        gridTemplateRows: ` repeat(${height}, 50px)`,
      };
    },
    [width, height]
  );

  const endGame = () => setGameover(true);

  useEffect(
    function gameoverAlert() {
      if (!gameover) return;
      alert("BOOM! 💣");
    },
    [gameover]
  );

  return (
    <FieldContext.Provider value={{ set, gameover, endGame }}>
      <div className="minefield" style={style}>
        {field.grid.map((line, y) =>
          line.map((mine, x) => <Tile key={mine.id} mine={mine} x={x} y={y} />)
        )}
      </div>
    </FieldContext.Provider>
  );
}
