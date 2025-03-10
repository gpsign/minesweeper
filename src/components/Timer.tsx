import { useEffect, useState } from "react";
import useStore from "../hooks/useStore";

export default function Timer() {
  const [isRunning, setIsRunning] = useState(true);
  const [time, setTime] = useState(0);
  const store = useStore();
  const endgame = store.get("endgame", false);

  useEffect(() => {
    let timer: number = -1;
    if (isRunning) {
      timer = setInterval(() => setTime((prevTime) => prevTime + 1), 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning) return;
    if (!endgame) return;
    setIsRunning(false);
  }, [endgame]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return <h1>{formatTime(time)}</h1>;
}
