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

  const display = useMemo(() => {
    if (mine.flagged) return "🚩";
    if (!mine.opened) return "";
    if (mine.type === "MINE") return "💣";
    if (mine.value === 0) return "";
    return (
      <span style={{ color: COLORS[mine.value], fontWeight: 700 }}>
        {mine.value}
      </span>
    );
  }, [mine.flagged, mine.opened]);

  const className = useMemo(() => {
    return "mine-tile " + (mine.opened ? "open" : "closed");
  }, [mine.opened]);

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (mine.flagged) return;
      set(x, y, mine.flood);
    },
    [mine.flagged, mine.opened]
  );

  const onContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      console.log(e.button);

      if (e.button != 2) return;

      if (mine.opened) return;

      set(x, y, mine.flag);
    },
    [mine.opened]
  );

  return (
    <button
      onContextMenu={onContextMenu}
      onClick={onClick}
      className={className}
    >
      {display}
    </button>
  );
}
