// import { Position } from "../classes/Field";
import Position, { Horizontal, Vertical } from "../classes/Position";

export default class GridUtils {
  static around(x: number, y: number): Position[] {
    const top = Position.top(x, y);
    const bottom = Position.bottom(x, y);
    const left = Position.left(x, y);
    const right = Position.right(x, y);

    const tl = Position.left(top);
    const tr = Position.right(top);

    const bl = Position.left(bottom);
    const br = Position.right(bottom);

    return [tl, top, tr, left, right, bl, bottom, br];
  }

  static corner(
    x: number,
    y: number,
    vertical: Vertical,
    horizontal: Horizontal
  ) {
    const pos = new Position(x, y);
    const hSide = Position[horizontal](pos);
    const vSide = Position[vertical](pos);
    const corner = pos[vertical][horizontal];

    return [corner, hSide, vSide];
  }
}
