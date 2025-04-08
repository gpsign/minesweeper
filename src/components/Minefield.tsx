/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Field from "../classes/Field";
import { Store } from "../classes/Store";
import { IMinefield } from "../context/FieldContext";
import useDialogControls from "../hooks/useDialogControls";
import { useDialogData } from "../hooks/useDialogData";
import { Random } from "../utils/Random";
import Counter from "./Counter";
import Tile from "./Tile";
import Timer from "./Timer";
import FieldProvider from "./FieldProvider";

export default function Minefield() {
  const [config, setConfig] = useState<IMinefield | null>(null);
  const isMounted = useRef(false);
  const dialog = useDialogControls();

  const ready = Boolean(config);

  const style = useMemo(
    function generateTemplates() {
      if (!config) return;
      return {
        gridTemplateColumns: `repeat(${config.width}, var(--tile-size))`,
        gridTemplateRows: ` repeat(${config.height}, var(--tile-size))`,
      };
    },
    [config]
  );

  const prompt = useCallback(async () => {
    if (isMounted.current) return;
    isMounted.current = true;
    const prompted = await dialog.open<IMinefield>(Config);
    setConfig(prompted);
    Store.set("remaining", prompted?.mines);
  }, [dialog, config, setConfig]);

  useEffect(() => {
    if (ready) return;
    prompt();
  }, [config]);

  if (!ready) return;

  return (
    <FieldProvider
      width={config!.width}
      height={config!.height}
      mines={config!.mines}
    >
      <header className="monitor">
        <Counter />
        <Timer />
      </header>
      <div className="minefield" style={style}>
        <FieldGrid />
      </div>
    </FieldProvider>
  );
}

function Config() {
  const { confirm } = useDialogData();
  const [args, setArgs] = useState<IMinefield>({
    width: 16,
    height: 30,
    mines: 99,
  });

  const minesMax = Math.round(args.width * args.height * 0.3);

  if (args.mines > minesMax) setArgs({ ...args, mines: minesMax });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        confirm(args);
      }}
      className="dialog-configuration"
    >
      <div>
        <label htmlFor="width">Width</label>
        <input
          value={args.width}
          onChange={(e) => setArgs({ ...args, width: Number(e.target.value) })}
          id="width"
          type="range"
          min={9}
          max={30}
        />
        {args.width}
      </div>
      <div>
        <label htmlFor="height">Height</label>
        <input
          value={args.height}
          onChange={(e) => setArgs({ ...args, height: Number(e.target.value) })}
          id="height"
          type="range"
          min={9}
          max={30}
        />
        {args.height}
      </div>
      <div>
        <label htmlFor="mines">Mines</label>
        <input
          value={args.mines}
          onChange={(e) => setArgs({ ...args, mines: Number(e.target.value) })}
          id="mines"
          type="range"
          min={10}
          max={minesMax}
        />
        {args.mines}
      </div>
      <button type="submit">OK</button>
    </form>
  );
}

function FieldGrid() {
  const field = Field.instance;
  return field.grid.map((line, y) =>
    line.map((mine, x) => (
      <Tile key={Random.uuid()} status={mine.status} x={x} y={y} />
    ))
  );
}
