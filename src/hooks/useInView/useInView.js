import { useEffect, useRef, useState } from "react";

/**
 * Retorna [ref, isVisible]. Marca isVisible=true assim que o elemento
 * entra na viewport e desconecta o observer — a entrada só acontece uma vez.
 */
export function useInView(options = { threshold: 0.2 }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, isVisible];
}
