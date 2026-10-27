import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import "./Pill.css";

/** Pílula de variação: verde/seta para cima quando sobe, vermelha/seta para baixo quando cai. */
export default function Pill({ pct, className = "" }) {
  if (pct == null || !Number.isFinite(pct)) return null;
  const up = pct >= 0;
  return (
    <span className={`pill ${up ? "is-up" : "is-down"} ${className}`.trim()}>
      {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
      {Math.abs(pct).toFixed(2)}%
    </span>
  );
}
