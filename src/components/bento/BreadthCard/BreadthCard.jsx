import { useEffect, useState } from "react";
import CountValue from "../../common/CountValue";
import "./BreadthCard.css";

function Row({ label, up, total, delay }) {
  const pct = total ? (up / total) * 100 : 0;
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div className="breadth__row">
      <div className="breadth__line">
        <span>{label}</span>
        <span className="breadth__count">{up} de {total} em alta</span>
      </div>
      <div className="breadth__track" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label={`${label} em alta`}>
        <i style={{ transform: `scaleX(${ready ? pct / 100 : 0})`, transitionDelay: `${delay}ms` }} />
      </div>
    </div>
  );
}

/** "Termômetro": quantos ativos estão em alta nas últimas 24h (moedas e criptos). */
export default function BreadthCard({ fiat, crypto }) {
  const count = (list) => {
    const l = list.filter((a) => a.pct != null && Number.isFinite(a.pct));
    return { up: l.filter((a) => a.pct > 0).length, total: l.length };
  };
  const f = count(fiat);
  const c = count(crypto);
  const total = f.total + c.total;
  const share = total ? ((f.up + c.up) / total) * 100 : 0;

  return (
    <article className="bento-card breadth">
      <header>
        <h3>Termômetro do mercado</h3>
        <p>Quantos ativos sobem frente ao real</p>
      </header>
      <div className="breadth__big">
        <CountValue amount={share} format={(v) => `${Math.round(v)}%`} />
        <span>em alta agora</span>
      </div>
      <Row label="Moedas" up={f.up} total={f.total} delay={450} />
      <Row label="Criptomoedas" up={c.up} total={c.total} delay={600} />
    </article>
  );
}
