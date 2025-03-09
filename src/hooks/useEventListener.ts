import { useCallback, useEffect } from "react";

export default function useEventListener<K extends keyof WindowEventMap>(
  type: K,
  listener: (this: Window, ev: WindowEventMap[K]) => any,
  dependecy: React.DependencyList,
  options?: boolean | AddEventListenerOptions
): void {
  const callback = useCallback(listener, dependecy);

  useEffect(() => {
    window.addEventListener(type, callback, options);
    return () => {
      window.removeEventListener(type, callback);
    };
  }, [callback]);
}
