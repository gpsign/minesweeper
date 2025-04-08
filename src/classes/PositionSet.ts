/* eslint-disable @typescript-eslint/no-explicit-any */
export class PositionSet extends Set {
  private toKey(x: number, y: number): string {
    return `${x}-${y}`;
  }

  add(value: any): this;
  add(x: number, y: number): this;
  add(x: number, y?: number): this {
    if (typeof x === "number" && typeof y === "number")
      super.add(this.toKey(x, y));

    return this;
  }

  delete(value: any): boolean;
  delete(x: number, y: number): boolean;
  delete(x: number, y?: number): boolean {
    if (typeof x === "number" && typeof y === "number")
      return super.delete(this.toKey(x, y));

    return super.delete(x);
  }

  has(value: any): boolean;
  has(x: number, y: number): boolean;
  has(x: number, y?: number): boolean {
    if (typeof x === "number" && typeof y === "number")
      return super.has(this.toKey(x, y));

    return super.has(x);
  }
}
