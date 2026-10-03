import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import "./StatCard.css";

export default function StatCard({ icon, label, value, pct, caption, active, onClick, tag }) {
  const up = (pct ?? 0) >= 0;
  const Tag = onClick ? "button" : "div";
  return (
    <Tag className={`stat-card ${active ? "is-active" : ""}`} onClick={onClick} type={onClick ? "button" : undefined}>
      <div className="stat-card__top">
        <span className="stat-card__icon">{icon}</span>
        {tag && <span className="stat-card__tag">{tag}</span>}
      </div>
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__row">
        <span className="stat-card__value">{value}</span>
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
