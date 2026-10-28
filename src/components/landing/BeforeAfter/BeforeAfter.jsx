import { X, Check } from "lucide-react";
import SectionHead from "../../common/SectionHead";
import Reveal from "../../common/Reveal";
import "./BeforeAfter.css";

const BEFORE = [
  "Abrir um site ou aba para cada moeda",
  "Copiar cotações para uma planilha",
  "Conversões na calculadora, uma por vez",
  "Sem histórico à mão para comparar",
  "Cripto e moedas em lugares separados",
];
const AFTER = [
  "Moedas e criptos num só painel",
  "Conversor entre qualquer par, inclusive cripto",
  "Histórico de 7 dias a 1 ano em gráfico",
  "Atualização automática a cada 60 segundos",
  "Resumo das maiores altas e quedas do dia",
];

export default function BeforeAfter() {
  return (
    <section className="lp-section ba">
      <div className="container">
        <SectionHead index="04" eyebrow="Antes e depois" title={<>Acompanhar câmbio <em>sem atrito</em>.</>}>
          O que muda quando tudo está no mesmo lugar.
        </SectionHead>
        <div className="ba__grid">
          <Reveal as="div" className="ba__card ba__card--before">
            <h3>Na mão</h3>
            <ul>{BEFORE.map((t) => <li key={t}><X size={16} />{t}</li>)}</ul>
          </Reveal>
          <Reveal as="div" delay={100} className="ba__card ba__card--after">
            <h3>Com o FinanceDay</h3>
            <ul>{AFTER.map((t) => <li key={t}><Check size={16} />{t}</li>)}</ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
