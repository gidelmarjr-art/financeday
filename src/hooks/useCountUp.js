import { useEffect, useRef, useState } from "react";

/**
 * Anima um número de 0 até `target` quando `start` se torna true.
 * Usado pelas estatísticas da landing page — a mesma ideia de "dígitos
 * chegando ao valor final" do painel split-flap, só que em números maiores.
 */
export function useCountUp(target, start, duration = 1200) {
  const [value, setValue] = useState(0);
  const frame = useRef(null);

  useEffect(() => {
    if (!start) return;

    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(Math.round(target * eased));
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    }

    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [start, target, duration]);

  return value;
}
