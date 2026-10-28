import { Link } from "react-router-dom";
import { ArrowRight, ArrowDown, Check } from "lucide-react";
import FlapBoard from "../../dashboard/FlapBoard";
import { useMarket } from "../../../context/MarketContext";
import { formatAsOfDate } from "../../../utils/liveData";
import "./Hero.css";

export default function Hero({ featured, asOf }) {
  const { fiat, crypto, fiatStatus, cryptoStatus } = useMarket();
  const live = fiatStatus === "success" || cryptoStatus === "success";
  const seq = (n) => ({ "--s": n });

  return (
    <section className="hero" id="inicio">
      <div className="hero__bg" aria-hidden="true"><span /><span /></div>

      <div className="container hero__inner">
        <a href="#fontes" className={`hero__badge hero__seq lp-live ${live ? "is-live" : ""}`} style={seq(0)}>
          <i />
          {live ? "Dados ao vivo" : "Dados ilustrativos"} · BCE + CoinGecko
          <ArrowRight size={13} />
        </a>

        <h1 className="hero__seq" style={seq(1)}>
          Câmbio e cripto
          <br />
          <em>em tempo real</em>,
          <br />
          num só painel.
        </h1>

        <p className="hero__lead hero__seq" style={seq(2)}>
          Acompanhe {fiat.length} moedas e o top {crypto.length} de criptomoedas frente ao real, com histórico,
          conversor entre qualquer par e leitura automática das maiores altas e quedas.
        </p>

        <div className="hero__actions hero__seq" style={seq(3)}>
          <Link to="/dashboard" className="btn btn--primary">
            Abrir dashboard <ArrowRight size={16} />
          </Link>
          <a href="#produto" className="btn btn--ghost">
            Ver o produto <ArrowDown size={16} />
          </a>
        </div>

        <ul className="hero__trust hero__seq" style={seq(4)}>
          <li><Check size={14} /> Sem cadastro</li>
          <li><Check size={14} /> Gratuito</li>
          <li><Check size={14} /> Fontes abertas</li>
        </ul>

        <div className="hero__stage hero__seq" style={seq(5)}>
          <div className="hero__panel">
            <div className="hero__panel-status">
              <span className="hero__dot" />
              {asOf ? `referência do BCE de ${formatAsOfDate(asOf)}` : "carregando cotações…"}
            </div>
            <FlapBoard items={featured} />
          </div>
        </div>
      </div>
    </section>
  );
}
