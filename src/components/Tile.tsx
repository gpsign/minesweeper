import { memo, useMemo } from "react";
import Mine, { Status } from "../classes/Mine";
import { useMine, useMineField } from "./Minefield";

interface ITileProps {
  status: Mine["status"];
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

export default function Tile({ x, y }: ITileProps) {
  const { set, gameover, endGame } = useMineField();

  const mine = useMine(x, y);
  const status = mine.status;

  const flagged = status === Status.flagged;
  const opened = status === Status.open;
  const isMine = mine.isMine;

  const display = useMemo(() => {
    if (flagged) return "🚩";
    if (!opened) return "";
    if (isMine) return "💣";
    if (mine.value === 0) return "";
    return (
      <span style={{ color: COLORS[mine.value], fontWeight: 700 }}>
        {mine.value}
      </span>
    );
  }, [status]);

  const className = useMemo(() => {
    return "mine-tile " + (opened ? "open" : "closed");
  }, [opened]);

  const onClick = function openTile(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (flagged) return;
    if (!mine.field.initialized) mine.field.initialize(x, y);

    if (isMine) {
      mine.open();
      endGame();
    }

    set(x, y, mine.reveal);
  };

  const onContextMenu = function flagTile(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();

    if (opened) return;

    set(x, y, mine.flag);
  };

  return (
    <button
      key={mine.status}
      disabled={gameover}
      onContextMenu={onContextMenu}
      onClick={onClick}
      className={className}
    >
      {display}
    </button>
  );
}
