/**
 * Camada de serviços — insights de IA.
 *
 * Ainda não conectado a um provedor real. A ideia é que esta função receba
 * as cotações do dia (já com variação calculada por `exchangeService`) e
 * devolva um pequeno resumo textual, gerado por um modelo de linguagem via
 * backend próprio (o ideal é nunca chamar uma API de IA com chave exposta
 * direto do frontend).
 *
 * Por enquanto, `generateInsights` devolve `data/mock.js#INSIGHTS` para que
 * a interface já funcione fim a fim.
 */
import { INSIGHTS } from "../data/mock";

export async function generateInsights(_ratesWithChange) {
  // TODO: substituir por uma chamada real, ex.:
  // const res = await fetch("/api/insights", {
  //   method: "POST",
  //   body: JSON.stringify({ rates: _ratesWithChange }),
  // });
  // return res.json();

  return new Promise((resolve) => {
    setTimeout(() => resolve(INSIGHTS), 400);
  });
}
