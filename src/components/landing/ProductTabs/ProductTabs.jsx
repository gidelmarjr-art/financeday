import { useState } from "react";
import { Link } from "react-router-dom";
import { Gauge, ArrowLeftRight, Coins, Bitcoin, ArrowRight, Check } from "lucide-react";
import SectionHead from "../../common/SectionHead";
import OverviewPreview from "../previews/OverviewPreview";
import ConverterPreview from "../previews/ConverterPreview";
import MoedasPreview from "../previews/MoedasPreview";
import CriptoPreview from "../previews/CriptoPreview";
import "./ProductTabs.css";

const TABS = [
  {
    id: "geral", label: "Visão geral", icon: Gauge, to: "/dashboard", Preview: OverviewPreview,
    title: "O mercado inteiro numa tela",
    text: "Dólar, euro, libra, real e dólar canadense, mais Bitcoin, Ethereum e Solana — com variação do dia, desempenho comparado e termômetro de alta e queda.",
    points: ["Cards com números que sobem e piscam quando o preço muda", "Gráfico de desempenho comparado de 7 a 90 dias", "Maiores altas e quedas das últimas 24h"],
  },
  {
    id: "cambio", label: "Câmbio", icon: ArrowLeftRight, to: "/dashboard/cambio", Preview: ConverterPreview,
    title: "Converta qualquer par em segundos",
    text: "Escolha duas moedas — ou criptomoedas — e veja quanto vale o valor informado, com o histórico do par logo abaixo.",
    points: ["Busca por nome ou código, com bandeira e cotação", "Resultado atualiza enquanto você digita", "Máxima, mínima e variação do período"],
  },
  {
    id: "moedas", label: "Moedas", icon: Coins, to: "/dashboard/moedas", Preview: MoedasPreview,
    title: "Todas as moedas, lado a lado",
    text: "Cotação, variação em 24h, 7 e 30 dias, máxima e mínima do mês e mini-gráfico — ordenável e com busca.",
    points: ["24 moedas frente ao real", "Tendência de 7 e 30 dias a partir do histórico real", "Clique numa linha para abrir o gráfico completo"],
  },
  {
    id: "cripto", label: "Criptomoedas", icon: Bitcoin, to: "/dashboard/criptomoedas", Preview: CriptoPreview,
    title: "O top 20 do mercado cripto",
    text: "Ranking por valor de mercado, em reais, com variação, volume, dominância do Bitcoin e a linha dos últimos 7 dias.",
    points: ["Atualização automática a cada 60 segundos", "Valor de mercado, volume e posição no ranking", "Gráfico de 7 dias a 1 ano para cada moeda"],
  },
];

export default function ProductTabs() {
  const [i, setI] = useState(0);
  const tab = TABS[i];
  const Preview = tab.Preview;

  return (
    <section id="produto" className="lp-section pt">
      <div className="container">
        <SectionHead index="01" eyebrow="Produto" title={<>Quatro telas. <em>Um painel.</em></>}>
          Tudo o que você precisa para acompanhar câmbio e cripto, sem abrir uma aba por moeda.
        </SectionHead>

        <div className="pt__nav" role="tablist" aria-label="Telas do painel" style={{ "--i": i }}>
          <span className="pt__indicator" aria-hidden="true" />
          {TABS.map((t, n) => (
            <button key={t.id} role="tab" id={`tab-${t.id}`} aria-selected={i === n} aria-controls="pt-panel"
              className={`pt__tab ${i === n ? "is-active" : ""}`} onClick={() => setI(n)}>
              <t.icon size={16} /><span>{t.label}</span>
            </button>
          ))}
        </div>

        <div className="pt__stage" id="pt-panel" role="tabpanel" aria-labelledby={`tab-${tab.id}`}>
          <div className="pt__info" key={`info-${tab.id}`}>
            <h3>{tab.title}</h3>
            <p>{tab.text}</p>
            <ul>{tab.points.map((p) => <li key={p}><Check size={15} />{p}</li>)}</ul>
            <Link to={tab.to} className="pt__link">Abrir {tab.label} <ArrowRight size={15} /></Link>
          </div>

          <div className="pt__frame">
            <div className="pt__chrome"><i /><i /><i /><span>financeday · {tab.to}</span><span className="lp-live is-live pt__liveTag"><i />ao vivo</span></div>
            <div className="pt__body" key={tab.id} aria-hidden="true" inert="">
              <Preview />
            </div>
            <div className="pt__fade" />
          </div>
        </div>
      </div>
    </section>
  );
}
