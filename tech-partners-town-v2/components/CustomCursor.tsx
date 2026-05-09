"use client";

import { useEffect, useRef } from "react";

/**
 * 高級感のある光のドットのカスタムカーソル。
 * 内側ドット + 外側リング、リングは少し遅れて追従する。
 */
export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (dot.current) {
        dot.current.style.left = `${e.clientX}px`;
        dot.current.style.top = `${e.clientY}px`;
      }
    };
    const onDown = () => {
      if (dot.current) dot.current.style.transform = "translate(-50%, -50%) scale(1.6)";
    };
    const onUp = () => {
      if (dot.current) dot.current.style.transform = "translate(-50%, -50%) scale(1)";
    };

    let raf = 0;
    const tick = () => {
      ringPos.current.x += (target.current.x - ringPos.current.x) * 0.14;
      ringPos.current.y += (target.current.y - ringPos.current.y) * 0.14;
      if (ring.current) {
        ring.current.style.left = `${ringPos.current.x}px`;
        ring.current.style.top = `${ringPos.current.y}px`;
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dot} className="custom-cursor" />
      <div ref={ring} className="custom-cursor-ring" />
    </>
  );
}
