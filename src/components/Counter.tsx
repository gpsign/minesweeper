import useStore from "../hooks/useStore";

export default function Counter() {
  const store = useStore();

  return <>{store.get("counter", 0)}</>;
}
