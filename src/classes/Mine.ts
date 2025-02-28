import { Random } from "../utils/Random";
import Field from "./Field";

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
    if (this.isOpen()) return;
    this.status = this.isFlagged() ? Status.closed : Status.flagged;
  }

  open() {
    this.status = Status.open;
  }

  increment() {
    this.value++;
  }

  reveal() {
    if (this.isOpen() || this.isFlagged() || this.isMine) return;

    this.field.affected.push([this.x, this.y]);

    this.open();

    if (this.value != 0) return;

    this.field.arround(this.x, this.y, Mine.prototype.reveal);
  }
}
