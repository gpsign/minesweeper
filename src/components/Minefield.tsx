import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import Field from "../classes/Field";
import Mine from "../classes/Mine";
import { Random } from "../utils/Random";
import Tile from "./Tile";
import useUpdate from "../hooks/useUpdate";
import { PositionSet } from "../classes/PositionSet";

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
  const { field } = useMineField();
  const update = useUpdate();

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
  const [_isPending, startTransition] = useTransition();

  const set: SetMineFunction = (x, y, callback) => {
    field.affected = [];
    const mine = field.at(x, y);
    if (!mine) return;

    callback.apply(mine);

    field.affected.forEach(([x, y], index) => {
      const affected = field.at(x, y);
      if (!affected) return;
      const updater = updaters.get(affected.id);
      if (!updater) return;
      setTimeout(() => {
        updater();
      }, 10 * index);
    });
  };

  const endGame = () => {
    alert("BOOM! 💣");
    field.reveal();
    field.affected.forEach(([x, y]) => {
      const affected = field.at(x, y);
      if (!affected) return;
      const updater = updaters.get(affected.id);
      if (!updater) return;

      updater();
    });
    startTransition(() => setGameover(true));
  };

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
        gridTemplateColumns: `repeat(${width}, var(--tile-size))`,
        gridTemplateRows: ` repeat(${height}, var(--tile-size))`,
      };
    },
    [width, height]
  );

  return (
    <FieldProvider width={width} height={height} mines={mines}>
      {/* <Counter /> */}
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
