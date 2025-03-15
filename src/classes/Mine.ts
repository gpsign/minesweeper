import { Random } from "../utils/Random";
import Field from "./Field";
import Position from "./Position";

export enum Status {
  open,
  closed,
  flagged,
}
export default class Mine {
  value: number = 0;
  isMine = false;
  status = Status.closed;
  id = new Random().uuid();
  x: number;
  y: number;
  field: Field;

  constructor(x: number, y: number, field: Field) {
    this.x = x;
    this.y = y;
    this.field = field;
  }

  isOpen() {
    return this.status === Status.open;
  }

  isFlagged() {
    return this.status === Status.flagged;
  }

  flag() {
    const { status, method } = (
      this.isFlagged()
        ? { status: Status.closed, method: "delete" }
        : { status: Status.flagged, method: "add" }
    ) as { status: Status; method: "add" | "delete" };

    this.status = status;

    this.field.flagged[method](this.x, this.y);

    this.field.affected.push(new Position([this.x, this.y]));
  }

  open() {
    this.status = Status.open;
  }

  increment() {
    this.value++;
  }

  reveal() {
    this.field.affected.push(new Position([this.x, this.y]));
    if (this.isOpen() || this.isFlagged() || this.isMine) {
      return;
    }

    this.open();

    if (this.value != 0) return;

    this.field.arround(this.x, this.y, Mine.prototype.reveal);
  }
}
