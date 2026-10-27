import { useFlash } from "../../hooks/useFlash";
import "./FlashValue.css";

/** Envolve um valor e faz um brilho verde/vermelho quando ele sobe/desce. */
export default function FlashValue({ value, resetKey, children, className = "" }) {
  const { dir, n } = useFlash(value, resetKey);
  return (
    <span className={`flash ${className}`.trim()}>
      {dir !== 0 && <i key={n} className={`flash__glow ${dir > 0 ? "is-up" : "is-down"}`} aria-hidden="true" />}
      {children}
    </span>
  );
}
