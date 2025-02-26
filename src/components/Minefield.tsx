import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import Field from "../classes/Field";
import Tile from "./Tile";
import Mine from "../classes/Mine";

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

  const set: SetMineFunction = useCallback(
    (x, y, callback) => {
      const mine = field.at(x, y);
      if (!mine) return;

      const newField = new Field(width, height, mines);

      newField.grid = field.grid.map((line, fy) =>
        line.map((mine, fx) => {
          if (fx === x && fy === y) callback.apply(mine);
          return mine;
        })
      );

      setField(newField);
    },
    [field, setField]
  );

  const style = useMemo(
    function generateTemplates() {
      return {
        gridTemplateColumns: `repeat(${width}, 50px)`,
        gridTemplateRows: ` repeat(${height}, 50px)`,
      };
    },
    [width, height]
  );

  return (
    <FieldContext.Provider value={{ set }}>
      <div className="minefield" style={style}>
        {field.grid.map((line, y) =>
          line.map((mine, x) => <Tile key={mine.id} mine={mine} x={x} y={y} />)
        )}
      </div>
    </FieldContext.Provider>
  );
}
