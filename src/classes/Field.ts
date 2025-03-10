import { Random } from "../utils/Random";
import Mine from "./Mine";
import { PositionSet } from "./PositionSet";
import Utils from "./Utils";

export type Position = [number, number];

export default class Field {
  grid: Mine[][];
  static width: number;
  static height: number;
  static mines: number;
  width: number;
  height: number;
  mines: number;
  affected: Position[] = [];
  safeX: number;
  safeY: number;
  flagged: PositionSet = new PositionSet();

  static #instance: Field;

  private available: Position[] = [];
  private answers: Position[] = [];

  private constructor(width: number, height: number, mines: number) {
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

  static get instance() {
    if (Field.#instance) return Field.#instance;
    Field.#instance = new Field(Field.width, Field.height, Field.mines);
    return Field.#instance;
  }

  private isSafe(x: number, y: number) {
    if (!this.atWidthBounds(x) || !this.atHeightBounds(y)) return false;

    if (this.width <= 3 || this.height <= 3)
      return this.safeX != x && this.safeY != y;

    const nearX = Boolean(x >= this.safeX - 1 && x <= this.safeX + 1);
    const nearY = Boolean(y >= this.safeY - 1 && y <= this.safeY + 1);

    return !(nearX && nearY);
  }

  private placeMines() {
    if (this.mines > this.available.length) throw "Sem espaço!";

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

  isClosed(x: number, y: number) {
    const cell = this.at(x, y);
    if (!cell) return false;
    return !cell.isOpen();
  }

  checkWin() {
    if (this.flagged.size !== this.answers.length) return false;
    const allChecked = this.answers.every(([x, y]) => this.flagged.has(x, y));
    if (!allChecked) return false;

    for (const line of this.grid) {
      for (const mine of line) {
        if (mine.isMine) continue;
        if (!mine.isOpen()) return false;
      }
    }

    return true;
  }

  reveal() {
    this.affected = [];
    for (const [x, y] of this.answers) {
      const cell = this.at(x, y);
      if (!cell) continue;
      if (cell.isFlagged()) continue;
      cell.open();
      this.affected.push([x, y]);
    }
  }

  get remaining() {
    return this.mines - this.flagged.size;
  }
}
