import { Random } from "../utils/Random";
import Mine from "./Mine";
import { PositionSet } from "./PositionSet";
import Utils from "./Utils";

export type Position = [number, number];

type FieldCopyConstructor = [Field];
type FieldExplicitConstructor = [number, number, number];
type FieldConstructor = FieldCopyConstructor | FieldExplicitConstructor;

export default class Field {
  grid: Mine[][];
  width: number;
  height: number;
  affected: Position[] = [];
  mines: number;
  safeX: number;
  safeY: number;
  flagged: PositionSet = new PositionSet();

  private available: Position[] = [];
  private answers: Position[] = [];

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
    if (this.mines >= this.available.length) throw "Sem espaço!";

    for (let i = 0; i < this.mines; i++) {
      const [x, y] = Random.pop(this.available);
      const cell = this.at(x, y);
      if (!cell) continue;
      cell.isMine = true;
      this.arround(x, y, Mine.prototype.increment);
      this.answers.push([x, y]);
    }
  }

  get initialized() {
    return this.answers.length != 0;
  }

  initialize(safeX?: number, safeY?: number) {
    if (this.initialized) return;

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
    Utils.around(x, y).forEach(([j, i]) => {
      const cell = this.at(j, i);
      if (!cell) return;
      callback.apply(cell);
    });
  }

  isOpen(x: number, y: number) {
    const cell = this.at(x, y);
    if (!cell) return false;
    return cell.isOpen();
  }

  checkWin() {
    if (this.flagged.size !== this.answers.length) return false;
    return this.answers.every(([x, y]) => this.flagged.has(x, y));
  }

  reveal() {
    this.affected = [];
    for (const [x, y] of this.answers) {
      const cell = this.at(x, y);
      if (!cell) continue;
      cell.open();
      this.affected.push([x, y]);
    }
  }

  get remaining() {
    return this.mines - this.flagged.size;
  }
}
