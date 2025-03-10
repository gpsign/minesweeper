import useStore from "../hooks/useStore";

export default function Counter() {
  const store = useStore();

  return (
    <h1 className="counter">
      {String(store.get<number>("remaining", 0)).padStart(2, "0")}
    </h1>
  );
}
