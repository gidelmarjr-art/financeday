import { useEffect, useRef, useState } from "react";

/**
 * Detecta mudança de valor e devolve { dir: 1|-1|0, n } (n reinicia a animação).
 * `resetKey` diferente = novo contexto (outro par, outra moeda): vira a nova base, sem piscar.
 */
export function useFlash(value, resetKey) {
  const prev = useRef(value);
  const prevKey = useRef(resetKey);
  const [flash, setFlash] = useState({ dir: 0, n: 0 });

  useEffect(() => {
    const keyChanged = prevKey.current !== resetKey;
    const ok = Number.isFinite(value) && Number.isFinite(prev.current);
    if (!keyChanged && ok && value !== prev.current) {
      setFlash((s) => ({ dir: value > prev.current ? 1 : -1, n: s.n + 1 }));
    }
    prev.current = value;
    prevKey.current = resetKey;
  }, [value, resetKey]);

  return flash;
}
