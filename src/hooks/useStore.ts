import { useRef } from "react";
import useUpdate from "./useUpdate";
import { Store } from "../classes/Store";

export default function useStore() {
  const update = useUpdate();
  const store = useRef(new Store(update));
  store.current.updater = update;
  return store.current;
}
