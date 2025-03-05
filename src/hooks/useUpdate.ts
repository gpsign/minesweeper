import { useId, useMemo, useState } from "react";

export interface UpdateFunction {
  (): void;
  id: string;
  index: number;
}

export default function useUpdate(): UpdateFunction {
  const [index, setIndex] = useState(0);
  const id = useId();

  const update: UpdateFunction = useMemo(() => {
    const func = () => setIndex(index + 1);
    func.id = id;
    func.index = index;
    return func;
  }, [index, setIndex, id]);

  return update;
}
