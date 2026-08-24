import { useInView } from "../../hooks/useInView";
import { useCountUp } from "../../hooks/useCountUp";
import { STATS } from "../../data/mock";
import "./StatsSection.css";

function StatItem({ value, suffix, label }) {
  const [ref, isVisible] = useInView({ threshold: 0.5 });
  const count = useCountUp(value, isVisible);

  return (
    <div ref={ref} className={`stat ${isVisible ? "is-visible" : ""}`}>
      <div className="stat__value">
        {count}
        {suffix}
      </div>
      <div className="stat__label">{label}</div>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="stats">
      <div className="container stats__grid">
        {STATS.map((s) => (
          <StatItem key={s.label} {...s} />
        ))}
      </div>
    </section>
  );
}
