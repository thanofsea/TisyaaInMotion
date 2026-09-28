import { useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const pointerX = useMotionValue(-100);
  const pointerY = useMotionValue(-100);
  useEffect(() => {
    const media = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 768px)",
    );
    const update = () => setEnabled(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;
    document.body.classList.add("has-custom-cursor");
    const move = (event) => {
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
    };
  }, [enabled, pointerX, pointerY]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="cursor-layer">
      <motion.span
        className="cursor-trail"
        style={{ x: pointerX, y: pointerY }}
      />
      <motion.span
        className="cursor-core"
        style={{ x: pointerX, y: pointerY }}
      />
    </div>
  );
}
