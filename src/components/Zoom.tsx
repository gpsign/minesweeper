import { useMemo, useRef, useState } from "react";
import Utils from "../classes/Utils";
import useEventListener from "../hooks/useEventListener";

function Zoom({ children }: React.PropsWithChildren) {
  const [zoom, setZoom] = useState(1);
  const [origin, setOrigin] = useState({ x: "50%", y: "50%" });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLElement | null>(null);

  const onMouseEnter = () => setIsHovering(true);
  const onMouseLeave = () => setIsHovering(false);

  useEventListener(
    "wheel",
    (e: WheelEvent) => {
      const container = containerRef.current;
      if (!isHovering || !container) return;

      e.preventDefault();

      const newZoom = Utils.clamp(zoom + Math.fround(e.deltaY / -1000), 0.5, 4);

      if (newZoom === zoom) return;

      const rect = container.getBoundingClientRect();
      const offsetX = ((e.clientX - rect.left) / rect.width) * 100;
      const offsetY = ((e.clientY - rect.top) / rect.height) * 100;

      setOrigin((prevOrigin) => ({
        x: `${Number(prevOrigin.x.slice(0, -1)) * 0.7 + offsetX * 0.3}%`,
        y: `${Number(prevOrigin.y.slice(0, -1)) * 0.7 + offsetY * 0.3}%`,
      }));

      setZoom(newZoom);
    },
    [zoom, isHovering],
    { passive: false }
  );

  const style = useMemo(
    () => ({
      transform: `scale(${zoom})`,
      transformOrigin: `${origin.x} ${origin.y}`,
      transition: "transform 0.2s ease-out, transform-origin 0.3s ease-out",
    }),
    [zoom, origin]
  );

  return (
    <section
      ref={containerRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={style}
    >
      {children}
    </section>
  );
}

export default Zoom;
