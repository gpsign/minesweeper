import Utils from "../utils/Utils";

export type Vertical = "top" | "bottom";
export type Horizontal = "left" | "right";

export type Coordinates = [number, number];
type PositionConstructor = Coordinates | [Coordinates] | [Position];

function getCoordinates(...args: PositionConstructor): Coordinates {
  return typeof args[0] === "number"
    ? [args[0], args[1]!]
    : (args[0] as Coordinates);
}

export default class Position {
  private 0: number;
  private 1: number;

  width = Infinity;
  height = Infinity;

  constructor(x: number, y: number);
  constructor(position: Coordinates);
  constructor(position: Position);
  constructor(...args: PositionConstructor);
  constructor(...args: PositionConstructor) {
    const [x, y] = getCoordinates(...args);
    this[0] = x;
    this[1] = y;

    const first = args[0];

    if (first instanceof Position) {
      this.width = first.width;
      this.height = first.height;
    }
  }

  static top(...args: PositionConstructor) {
    return new Position(...args).top;
  }

  static bottom(...args: PositionConstructor) {
    return new Position(...args).bottom;
  }

  static left(...args: PositionConstructor) {
    return new Position(...args).left;
  }

  static right(...args: PositionConstructor) {
    return new Position(...args).right;
  }

  get top() {
    this.y = this.y - 1;
    return this;
  }

  get bottom() {
    this.y = this.y + 1;
    return this;
  }

  get left() {
    this.x = this.x - 1;
    return this;
  }

  get right() {
    this.x = this.x + 1;
    return this;
  }

  get x() {
    return this[0];
  }

  get y() {
    return this[1];
  }

  set x(value) {
    value = Utils.number.clamp(value, 0, this.width);
    this[0] = value;
  }

  set y(value) {
    value = Utils.number.clamp(value, 0, this.width);
    this[1] = value;
  }

  *[Symbol.iterator](): Generator<number, void> {
    yield this[0];
    yield this[1];
  }
}
