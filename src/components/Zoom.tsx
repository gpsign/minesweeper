import { useCallback, useMemo, useRef, useState } from "react";
import Utils from "../classes/Utils";
import useEventListener from "../hooks/useEventListener";

function Zoom({ children }: React.PropsWithChildren) {
  const [zoom, setZoom] = useState(1);
  const [origin, setOrigin] = useState({ x: "50%", y: "50%" });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLElement | null>(null);
  const lastPinchDistance = useRef<number | null>(null);

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

  // Função para lidar com zoom no mobile (pinch-to-zoom)
  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!containerRef.current || e.touches.length !== 2) return; // Só ativa com dois dedos

      e.preventDefault();

      const touch1 = e.touches[0];
      const touch2 = e.touches[1];

      // Calcula a distância entre os dois dedos
      const pinchDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      if (lastPinchDistance.current !== null) {
        const delta = pinchDistance - lastPinchDistance.current;
        const newZoom = Math.max(0.5, Math.min(4, zoom + delta / 500)); // Ajuste do fator de zoom

        if (newZoom !== zoom) {
          const rect = containerRef.current.getBoundingClientRect();
          const offsetX =
            (((touch1.clientX + touch2.clientX) / 2 - rect.left) / rect.width) *
            100;
          const offsetY =
            (((touch1.clientY + touch2.clientY) / 2 - rect.top) / rect.height) *
            100;

          setOrigin((prevOrigin) => ({
            x: `${Number(prevOrigin.x.slice(0, -1)) * 0.7 + offsetX * 0.3}%`,
            y: `${Number(prevOrigin.y.slice(0, -1)) * 0.7 + offsetY * 0.3}%`,
          }));

          setZoom(newZoom);
        }
      }

      lastPinchDistance.current = pinchDistance;
    },
    [zoom]
  );

  // Reseta a distância ao soltar os dedos
  const onTouchEnd = () => {
    lastPinchDistance.current = null;
  };

  useEventListener("touchmove", onTouchMove, [], { passive: false });
  useEventListener("touchend", onTouchEnd, []);

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
