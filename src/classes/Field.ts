import { Random } from "../utils/Random";
import Mine from "./Mine";

export default class Field {
  grid: Mine[][];
  width: number;
  height: number;
  mines: number;

  constructor(width: number, height: number, mines: number) {
    this.grid = [];
    this.width = width;
    this.height = height;
    this.mines = mines;

    const coordinates = [];

    for (let i = 0; i < height; i++) {
      const row: Mine[] = [];

      for (let j = 0; j < width; j++) {
        row.push(new Mine(j, i, this));
        coordinates.push([j, i]);
      }

      this.grid.push(row);
    }

    for (let i = 0; i < mines; i++) {
      const [x, y] = Random.pop(coordinates);
      const cell = this.at(x, y);
      if (!cell) continue;
      cell.type = "MINE";
      this.arround(x, y, Mine.prototype.increment);
    }
  }

  private atBounds(point: number, axis: "width" | "height") {
    const max = this[axis];
    if (point < 0 || point >= max) return false;
    return true;
  }

  atWidthBounds(point: number) {
    return this.atBounds(point, "width");
  }

  atHeightBounds(point: number) {
    return this.atBounds(point, "height");
  }

  at(x: number, y: number): Mine | undefined {
    if (!this.atWidthBounds(x) || !this.atHeightBounds(y)) return;
    const cell = this.grid[y][x];
    return cell;
  }

  arround(x: number, y: number, callback: (this: Mine) => void) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === y && j === x) continue;
        const cell = this.at(x + j, y + i);
        if (!cell) continue;
        callback.apply(cell);
      }
    }
  }
}
