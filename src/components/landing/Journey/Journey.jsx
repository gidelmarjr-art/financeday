import SectionHead from "../../common/SectionHead";
import Reveal from "../../common/Reveal";
import "./Journey.css";

const STEPS = [
  { n: "01", title: "Coleta nas fontes", text: "O painel consulta fontes abertas: a referência de câmbio do Banco Central Europeu (via Frankfurter), a CoinGecko para criptomoedas e a open.er-api para moedas sem referência do BCE.", chips: ["Frankfurter", "CoinGecko", "open.er-api"] },
  { n: "02", title: "Tudo em reais", text: "Cada cotação vira reais por 1 unidade — inclusive as criptos. É isso que permite comparar, ordenar e converter qualquer par entre si.", chips: ["base BRL", "24 moedas", "top 20 cripto"] },
  { n: "03", title: "Atualização contínua", text: "A cada 60 segundos os dados são renovados. O número continua de onde parou e pisca em verde ou vermelho quando o preço muda.", chips: ["60 s", "variação animada"] },
  { n: "04", title: "Histórico e leitura", text: "Gráficos de 7 dias a 1 ano, comparação de desempenho entre ativos e um resumo automático das maiores altas e quedas.", chips: ["7D", "30D", "90D", "1A"] },
];

export default function Journey() {
  return (
    <section id="como-funciona" className="lp-section journey">
      <div className="container journey__grid">
        <div className="journey__side">
          <SectionHead index="02" eyebrow="Como funciona" title={<>Do dado à <em>decisão</em>.</>}>
            Quatro etapas entre a fonte e a sua tela — todas visíveis, nenhuma escondida.
          </SectionHead>
        </div>

        <ol className="journey__list">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 60} className="journey__step">
              <span className="journey__dot" aria-hidden="true" />
              <span className="journey__n">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <div>{s.chips.map((c) => <span key={c} className="lp-chip">{c}</span>)}</div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
