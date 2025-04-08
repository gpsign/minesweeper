import Field from "../classes/Field";
import Mine from "../classes/Mine";
import useUpdate from "./useUpdate";

export const updaters = new Map<string, VoidFunction>();

export function useMine(x: number, y: number) {
  const field = Field.instance;
  const update = useUpdate();

  const mine = field.at(x, y) || new Mine(x, y, field);
  updaters.set(mine.id, update);

  return mine;
}
