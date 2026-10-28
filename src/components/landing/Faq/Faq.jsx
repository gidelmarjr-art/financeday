import { useState } from "react";
import { Plus } from "lucide-react";
import SectionHead from "../../common/SectionHead";
import "./Faq.css";

const ITEMS = [
  { q: "Os dados são em tempo real?", a: "As criptomoedas atualizam a cada 60 segundos, via CoinGecko. As moedas seguem a referência diária do Banco Central Europeu (Frankfurter), que muda uma vez por dia útil — por isso a variação das moedas compara com a referência anterior." },
  { q: "Preciso criar conta?", a: "Não. O painel abre direto, sem cadastro e sem custo." },
  { q: "De onde vêm os números?", a: "De fontes abertas: Frankfurter (BCE) para as moedas principais e o histórico, CoinGecko para criptomoedas e open.er-api.com para KWD e ARS. Algumas moedas pareadas (como AED e SAR) são calculadas pela paridade oficial com o dólar. A seção “Fontes” mostra o estado de cada uma." },
  { q: "O que significa “ilustrativo”?", a: "É o aviso de que a fonte daquele dado não respondeu e o painel está mostrando um valor de exemplo. Isso aparece como uma etiqueta no card ou na linha, e o gráfico avisa quando a série é ilustrativa." },
  { q: "Posso usar para decidir investimentos?", a: "O FinanceDay é um projeto de portfólio e mostra cotações de referência, que podem diferir das praticadas por bancos, casas de câmbio e corretoras. Não é recomendação de investimento." },
  { q: "Quais moedas e criptomoedas estão disponíveis?", a: "24 moedas frente ao real (dólar, euro, libra, dólar canadense, franco suíço, iene, entre outras) e o top 20 de criptomoedas por valor de mercado, incluindo Bitcoin, Ethereum e Solana." },
  { q: "Funciona no celular?", a: "Sim. O layout é responsivo e, no celular, o menu do painel vira uma barra inferior." },
];

/** Acordeão: abre um por vez; a altura anima via grid-template-rows (sem medir nada). */
export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="lp-section faq">
      <div className="container faq__grid">
        <SectionHead index="06" eyebrow="FAQ" title={<>Perguntas <em>frequentes</em>.</>}>
          O essencial sobre os dados, o que o painel faz e o que ele não faz.
        </SectionHead>

        <div className="faq__list">
          {ITEMS.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={it.q} className={`faq__item ${isOpen ? "is-open" : ""}`}>
                <h3>
                  <button id={`faq-q-${i}`} aria-expanded={isOpen} aria-controls={`faq-a-${i}`} onClick={() => setOpen(isOpen ? -1 : i)}>
                    {it.q}
                    <span className="faq__plus"><Plus size={18} /></span>
                  </button>
                </h3>
                <div className="faq__panel" id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`}>
                  <div><p>{it.a}</p></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
