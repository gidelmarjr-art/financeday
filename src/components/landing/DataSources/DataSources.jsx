import { ShieldCheck } from "lucide-react";
import SectionHead from "../../common/SectionHead";
import Reveal from "../../common/Reveal";
import { useMarket } from "../../../context/MarketContext";
import "./DataSources.css";

function Status({ state }) {
  if (!state) return <span className="lp-chip">fonte complementar</span>;
  const ok = state === "success";
  return (
    <span className={`lp-live ${ok ? "is-live" : ""}`}>
      <i />{ok ? "ao vivo agora" : state === "loading" ? "conectando…" : "indisponível agora"}
    </span>
  );
}

/** Transparência: de onde vem cada número, com o estado real de cada fonte. */
export default function DataSources() {
  const { fiatStatus, cryptoStatus, fiat, crypto } = useMarket();
  const SOURCES = [
    { name: "Frankfurter · BCE", text: "Referência diária de câmbio do Banco Central Europeu: moedas principais e todo o histórico dos gráficos.", meta: "diária", state: fiatStatus },
    { name: "CoinGecko", text: `Top ${crypto.length} criptomoedas em reais — preço, variação, volume, valor de mercado e linha de 7 dias.`, meta: "a cada 60 s", state: cryptoStatus },
    { name: "open.er-api.com", text: "Moedas sem referência do BCE, como o dinar kuwaitiano (KWD) e o peso argentino (ARS).", meta: "complementar", state: null },
    { name: "Paridades oficiais", text: "AED, SAR, BHD, OMR, JOD, KYD e GIP seguem a paridade oficial com o dólar ou a libra, então acompanham o mercado.", meta: "derivadas", state: null },
  ];
  return (
    <section id="fontes" className="lp-section ds">
      <div className="container">
        <SectionHead index="05" eyebrow="Fontes" title={<>Cada número tem <em>origem</em>.</>}>
          O FinanceDay usa fontes abertas e mostra o estado de cada uma — {fiat.length} moedas e {crypto.length} criptos, sem caixa-preta.
        </SectionHead>

        <div className="ds__grid">
          {SOURCES.map((s, i) => (
            <Reveal as="article" key={s.name} delay={i * 70} className="ds__card lp-card">
              <header><h3>{s.name}</h3><span className="lp-chip">{s.meta}</span></header>
              <p>{s.text}</p>
              <Status state={s.state} />
            </Reveal>
          ))}
        </div>

        <Reveal as="div" className="ds__note">
          <ShieldCheck size={20} />
          <p>
            <strong>Sem números escondidos.</strong> Se uma fonte falha, o painel avisa na tela e marca os valores como
            “ilustrativos” — nunca mostra um dado inventado como se fosse real. As cotações são de referência e podem
            diferir das praticadas por bancos e corretoras; não constituem recomendação de investimento.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
