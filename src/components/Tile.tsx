import { memo, useCallback } from "react";
import Field, { Position } from "../classes/Field";
import Mine, { Status } from "../classes/Mine";
import { Store } from "../classes/Store";
import Utils from "../classes/Utils";
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

const Tile = memo(function Tile({ x, y }: ITileProps) {
  const { set, gameover, endGame } = useMineField();
  const field = Field.instance;

  const mine = useMine(x, y);
  const status = mine.status;

  const flagged = status === Status.flagged;
  const opened = status === Status.open;
  const isMine = mine.isMine;

  const display = (() => {
    if (flagged && gameover) return "❌";
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

    const topLeft = Utils.topLeft(x, y);
    const topRight = Utils.topRight(x, y);
    const bottomLeft = Utils.bottomLeft(x, y);
    const bottomRight = Utils.bottomRight(x, y);

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
    Store.set("counter", field.remaining);
  };

  return (
    <button
      disabled={gameover}
      onContextMenu={onContextMenu}
      onClick={onClick}
      className={className}
    >
      <Corner x={x} y={y} position="topLeft" />
      <Corner x={x} y={y} position="topRight" />
      {display}
      <Corner x={x} y={y} position="bottomLeft" />
      <Corner x={x} y={y} position="bottomRight" />
    </button>
  );
});

export default Tile;

function getCorners(
  x: number,
  y: number,
  position: `${"top" | "bottom"}${"Left" | "Right"}`
): Position[] {
  switch (position) {
    case "topLeft":
      return [
        [x, y - 1],
        [x - 1, y],
      ];
    case "topRight":
      return [
        [x, y - 1],
        [x + 1, y],
      ];
    case "bottomLeft":
      return [
        [x - 1, y],
        [x, y + 1],
      ];
    case "bottomRight":
      return [
        [x + 1, y],
        [x, y + 1],
      ];
  }
}

function Corner({
  position,
  x,
  y,
}: {
  position: `${"top" | "bottom"}${"Left" | "Right"}`;
  x: number;
  y: number;
}) {
  const field = Field.instance;

  const isClosedAt = useCallback(
    ([x, y]: Position) => field.isClosed(x, y),
    []
  );

  const className = Utils.fabricate(() => {
    const base = ["corner", Utils.normalize(position), "none"];

    if (field.isClosed(x, y)) return base.join(" ");
    const corners = getCorners(x, y, position);

    if (corners.every(isClosedAt)) base.pop();

    return base.join(" ");
  });

  return (
    <span className={className}>
      <span />
    </span>
  );
}
