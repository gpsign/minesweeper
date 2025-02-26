import { Random } from "../utils/Random";
import Field from "./Field";

export default class Mine {
  value: number = 0;
  type: "MINE" | "CLEAR" = "CLEAR";
  flagged: boolean = false;
  opened: boolean = false;
  id = new Random().uuid();
  x: number;
  y: number;
  field: Field;

  constructor(x: number, y: number, field: Field) {
    this.x = x;
    this.y = y;
    this.field = field;
  }

  flag() {
    this.flagged = !this.flagged;
  }

  open() {
    this.opened = true;
  }

  increment() {
    this.value++;
  }

  flood() {
    if (this.opened || this.flagged) return;

    this.open();

    if (this.value != 0) return;

    this.field.arround(this.x, this.y, Mine.prototype.flood);
  }
}
