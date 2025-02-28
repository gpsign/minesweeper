import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Field from "../classes/Field";
import Mine from "../classes/Mine";
import { Random } from "../utils/Random";
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
  field: Field;
}

const FieldContext = createContext<IFieldContext | null>(null);

export function useMineField() {
  const context = useContext(FieldContext);
  if (!context)
    throw "O hook deve ser usado dentro do <FieldContext.Provider>!";
  return context;
}

const updaters = new Map<string, VoidFunction>();

export function useMine(x: number, y: number) {
  const [index, setIndex] = useState(0);
  const { field } = useMineField();
  const update = () => {
    setIndex(index + 1);
    console.log(x, y);
  };

  update.index = index;

  const mine = field.at(x, y) || new Mine(x, y, field);
  updaters.set(mine.id, update);

  return mine;
}

function FieldProvider({
  width,
  height,
  mines,
  children,
}: IMinefieldProps & React.PropsWithChildren) {
  const field = useRef(new Field(width, height, mines)).current;

  const [gameover, setGameover] = useState(false);

  const set: SetMineFunction = (x, y, callback) => {
    field.affected = [];
    const mine = field.at(x, y);
    if (!mine) return;

    callback.apply(mine);

    for (const [x, y] of field.affected) {
      const affected = field.at(x, y);
      if (!affected) continue;
      const updater = updaters.get(affected.id);
      if (!updater) continue;
      updater();
    }
  };

  const endGame = () => setGameover(true);

  useEffect(
    function gameoverAlert() {
      if (!gameover) return;
      alert("BOOM! 💣");
    },
    [gameover]
  );

  return (
    <FieldContext.Provider value={{ set, gameover, endGame, field }}>
      {children}
    </FieldContext.Provider>
  );
}

export default function Minefield({ width, height, mines }: IMinefieldProps) {
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
    <FieldProvider width={width} height={height} mines={mines}>
      <div className="minefield" style={style}>
        <FieldGrid />
      </div>
    </FieldProvider>
  );
}

function FieldGrid() {
  const { field } = useMineField();
  return field.grid.map((line, y) =>
    line.map((mine, x) => (
      <Tile key={Random.uuid()} status={mine.status} x={x} y={y} />
    ))
  );
}
