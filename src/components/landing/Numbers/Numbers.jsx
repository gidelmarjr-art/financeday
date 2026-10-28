import CountValue from "../../common/CountValue";
import { useMarket } from "../../../context/MarketContext";
import { useInView } from "../../../hooks/useInView";
import "./Numbers.css";

/** Números reais do produto (contagens vêm dos próprios dados), sobem ao entrar na tela. */
export default function Numbers() {
  const { fiat, crypto } = useMarket();
  const [ref, visible] = useInView({ threshold: 0.35 });
  const items = [
    { value: fiat.length, label: "moedas", sub: "frente ao real" },
    { value: crypto.length, label: "criptomoedas", sub: "top por valor de mercado" },
    { value: 60, label: "segundos", sub: "entre atualizações", suffix: " s" },
    { value: 365, label: "dias de histórico", sub: "nos gráficos (7D a 1A)" },
  ];
  return (
    <section className="lp-section numbers" ref={ref} aria-label="O painel em números">
      <div className="container numbers__grid">
        {items.map((it) => (
          <div key={it.label} className="numbers__item">
            <strong>{visible ? <CountValue amount={it.value} from={0} duration={1400} format={(v) => `${Math.round(v)}${it.suffix ?? ""}`} /> : `0${it.suffix ?? ""}`}</strong>
            <span>{it.label}</span>
            <small>{it.sub}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
