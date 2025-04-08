/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useCallback } from "react";
import Field from "../classes/Field";
import Mine, { Status } from "../classes/Mine";
import Position, { Horizontal, Vertical } from "../classes/Position";
import { Store } from "../classes/Store";
import Utils from "../utils/Utils";
import { useMineField } from "../hooks/useMineField";
import { useMine } from "../hooks/useMine";

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

const Tile = memo(function Tile({ x, y }: ITileProps) {
  const { set, gameover, endGame } = useMineField();
  const field = Field.instance;

  const mine = useMine(x, y);
  const status = mine.status;

  const flagged = status === Status.flagged;
  const opened = status === Status.open;
  const isMine = mine.isMine;

  const display = (() => {
    if (flagged && gameover && !isMine) return "❌";
    if (flagged) return "🚩";
    if (!opened) return "";
    if (isMine) return "💣";
    if (mine.value === 0) return "";
    return (
      <span style={{ color: COLORS[mine.value], fontWeight: 700 }}>
        {mine.value}
      </span>
    );
  })();

  const isOpenAt = useCallback(([x, y]: Position) => field.isOpen(x, y), []);

  const className = Utils.fabricate(() => {
    const base = ["mine-tile"];

    if (opened) base.push("open");
    else base.push("closed");

    if (flagged) base.push("flagged");

    if (opened) return base.join(" ");

    const topLeft = Utils.grid.corner(x, y, "top", "left");
    const topRight = Utils.grid.corner(x, y, "top", "right");
    const bottomLeft = Utils.grid.corner(x, y, "bottom", "left");
    const bottomRight = Utils.grid.corner(x, y, "bottom", "right");

    if (topLeft.every(isOpenAt)) base.push("tl");
    if (topRight.every(isOpenAt)) base.push("tr");
    if (bottomLeft.every(isOpenAt)) base.push("bl");
    if (bottomRight.every(isOpenAt)) base.push("br");

    return base.join(" ");
  });

  const onClick = function openTile(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (flagged) return;
    if (!mine.field.initialized) mine.field.initialize(x, y);

    if (mine.field.at(x, y)?.isMine) {
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
    Store.set("remaining", field.remaining);
  };

  return (
    <button
      disabled={gameover}
      onContextMenu={onContextMenu}
      onClick={onClick}
      className={className}
    >
      <Corner x={x} y={y} vertical="top" horizontal="left" />
      <Corner x={x} y={y} vertical="top" horizontal="right" />
      {display}
      <Corner x={x} y={y} vertical="bottom" horizontal="left" />
      <Corner x={x} y={y} vertical="bottom" horizontal="right" />
    </button>
  );
});

export default Tile;

function Corner({
  vertical,
  horizontal,
  x,
  y,
}: {
  vertical: Vertical;
  horizontal: Horizontal;
  x: number;
  y: number;
}) {
  const field = Field.instance;

  const isClosedAt = useCallback(
    ([x, y]: Position) => field.isClosed(x, y),
    []
  );

  const className = Utils.fabricate(() => {
    const base = ["corner", horizontal, vertical, "none"];

    if (field.isClosed(x, y)) return base.join(" ");
    const corners = [Position[vertical](x, y), Position[horizontal](x, y)];

    if (corners.every(isClosedAt)) base.pop();

    return base.join(" ");
  });

  return (
    <span className={className}>
      <span />
    </span>
  );
}
