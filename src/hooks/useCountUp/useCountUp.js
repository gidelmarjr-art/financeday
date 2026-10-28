import { useEffect, useRef, useState } from "react";
import { intro } from "../../utils/intro";

const reducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * Número que sobe até `target` (ease-out) e, quando o alvo muda, continua de
 * onde parou. Com `animateKey`, só anima quando a chave muda (ex.: trocar o par
 * de moedas); mudanças do próprio valor (digitar, atualização de cotação)
 * entram na hora — movimento nunca atrasa o uso.
 */
export function useCountUp(target, { duration = 1100, animateKey, from } = {}) {
  const reduced = reducedMotion();
  const [value, setValue] = useState(
    reduced || !Number.isFinite(target) ? target : from !== undefined ? from : intro.played ? target : 0
  );
  const current = useRef(value);
  const lastKey = useRef(animateKey);
  const first = useRef(true);

  useEffect(() => {
    const sameKey = !first.current && animateKey !== undefined && lastKey.current === animateKey;
    first.current = false;
    lastKey.current = animateKey;
    if (reduced || sameKey || !Number.isFinite(target)) {
      current.current = target;
      setValue(target);
      return;
    }
    const start0 = current.current;
    const start = performance.now();
    let raf;
    const step = (t) => {
      const p = Math.min((t - start) / duration, 1);
      current.current = start0 + (target - start0) * (1 - (1 - p) ** 4);
      setValue(current.current);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, animateKey, reduced]);

  return value;
}
