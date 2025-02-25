import { Random } from "../utils/Random";

export default class Cell {
  value: number = 0;
  type: "MINE" | "CLEAR" = "CLEAR";
  flagged: boolean = false;
  open: boolean = false;
  id = new Random().uuid();

  increment() {
    this.value++;
  }
}
