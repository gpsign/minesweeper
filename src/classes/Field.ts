import { Random } from "../utils/Random";
import Mine from "./Mine";

type Position = [number, number];

type FieldCopyConstructor = [Field];
type FieldExplicitConstructor = [number, number, number];
type FieldConstructor = FieldCopyConstructor | FieldExplicitConstructor;

export default class Field {
  grid: Mine[][];
  width: number;
  height: number;
  mines: number;
  safeX: number;
  safeY: number;
  initialized: boolean = false;
  private available: Position[] = [];

  constructor(field: Field);
  constructor(width: number, height: number, mines: number);
  constructor(...args: FieldConstructor) {
    const field = args[0];

    if (this.isField(field)) {
      Object.assign(this, { ...field });
    }

    const [width, height, mines] = args as FieldExplicitConstructor;

    this.grid ??= [];
    this.width ??= width;
    this.height ??= height;
    this.mines ??= mines;
    this.safeX ??= Math.floor(width / 2);
    this.safeY ??= Math.floor(height / 2);

    if (this.grid.length === 0)
      for (let y = 0; y < height; y++) {
        const row: Mine[] = [];

        for (let x = 0; x < width; x++) {
          row.push(new Mine(x, y, this));
        }

        this.grid.push(row);
      }
  }

  private isField(value: unknown): value is Field {
    return value instanceof Field;
  }

  private isSafe(x: number, y: number) {
    if (!this.atWidthBounds(x) || !this.atHeightBounds(y)) return false;

    const nearX = Boolean(x >= this.safeX - 1 && x <= this.safeX + 1);
    const nearY = Boolean(y >= this.safeY - 1 && y <= this.safeY + 1);

    return !(nearX && nearY);
  }

  private placeMines() {
    if (this.mines >= this.available.length - 9) throw "Sem espaço!";

    for (let i = 0; i < this.mines; i++) {
      const [x, y] = Random.pop(this.available);
      const cell = this.at(x, y);
      if (!cell) continue;
      cell.type = "MINE";
      this.arround(x, y, Mine.prototype.increment);
    }
  }

  initialize(safeX?: number, safeY?: number) {
    if (this.initialized) return;
    this.initialized = true;

    this.safeX = safeX ?? this.safeX;
    this.safeY = safeY ?? this.safeY;

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (!this.isSafe(x, y)) continue;
        this.available.push([x, y]);
      }
    }
    this.placeMines();
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
