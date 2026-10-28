import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useCountUp } from "../../../hooks/useCountUp";
import FlashValue from "../common/FlashValue";
import "./StatCard.css";

/**
 * `amount` + `format` => o valor sobe até o número e pisca quando atualiza.
 * Sem `amount`, mostra `value` (texto) como está.
 */
export default function StatCard({
  icon,
  label,
  value,
  amount,
  format,
  pct,
  caption,
  active,
  onClick,
  tag,
  index,
}) {
  const counted = useCountUp(amount ?? 0);
  const display = amount != null && format ? format(counted) : value;
  const up = (pct ?? 0) >= 0;
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      className={`stat-card ${active ? "is-active" : ""}`}
      onClick={onClick}
      type={onClick ? "button" : undefined}
      style={index != null ? { "--i": index } : undefined}
    >
      <div className="stat-card__top">
        <span className="stat-card__icon">{icon}</span>
        {tag && <span className="stat-card__tag">{tag}</span>}
      </div>
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__row">
        <span className="stat-card__value">
          <FlashValue value={amount}>{display}</FlashValue>
        </span>
        {pct != null && (
          <span className={`stat-card__pill ${up ? "is-up" : "is-down"}`}>
            {up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
            {Math.abs(pct).toFixed(2)}%
          </span>
        )}
      </div>
      <div className="stat-card__caption">{caption}</div>
    </Tag>
  );
}
