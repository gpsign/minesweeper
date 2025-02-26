import { useCallback, useMemo } from "react";
import Mine from "../classes/Mine";
import { useMineField } from "./Minefield";

interface ITileProps {
  mine: Mine;
  x: number;
  y: number;
}

const COLORS = [
  "white",
  "blue",
  "green",
  "red",
  "purple",
  "darkorange",
  "brown",
  "pink",
  "black",
];

export default function Tile({ mine, x, y }: ITileProps) {
  const { set } = useMineField();
  const { opened, flagged, value, type, field } = mine;
  const { gameover } = field;

  const display = useMemo(() => {
    if (flagged) return "🚩";
    if (!opened) return "";
    if (type === "MINE") return "💣";
    if (value === 0) return "";
    return (
      <span style={{ color: COLORS[value], fontWeight: 700 }}>{value}</span>
    );
  }, [flagged, opened]);

  const className = useMemo(() => {
    return "mine-tile " + (opened ? "open" : "closed");
  }, [opened]);

  const onClick = useCallback(
    function openTile(e: React.MouseEvent) {
      e.stopPropagation();
      e.preventDefault();
      if (flagged) return;
      if (!field.initialized) field.initialize(x, y);
      set(x, y, mine.flood);
    },
    [flagged, opened]
  );

  const onContextMenu = useCallback(
    function flagTile(e: React.MouseEvent) {
      e.stopPropagation();
      e.preventDefault();

      if (opened) return;

      set(x, y, mine.flag);
    },
    [opened]
  );

  return (
    <button
      disabled={gameover}
      onContextMenu={onContextMenu}
      onClick={onClick}
      className={className}
    >
      {display}
    </button>
  );
}
