import { formatPct } from "./format";

/** Resumos automáticos (regras sobre os dados ao vivo — não é um LLM). */
export function buildInsights(fiat, crypto) {
  const out = [];
  const withPct = (l) => l.filter((x) => x.pct != null && Number.isFinite(x.pct));
  const f = withPct(fiat);
  const c = withPct(crypto);

  const usd = fiat.find((x) => x.code === "USD");
  if (usd?.pct != null) {
    out.push(
      `USD/BRL ${usd.pct >= 0 ? "avança" : "recua"} ${formatPct(Math.abs(usd.pct), false)} na última referência — ` +
        (usd.pct >= 0 ? "o real perde força frente ao dólar." : "o real ganha força frente ao dólar.")
    );
  }
  if (f.length) {
    const top = [...f].sort((a, b) => Math.abs(b.pct) - Math.abs(a.pct))[0];
    out.push(`Entre as moedas, ${top.code}/BRL é a que mais se move: ${formatPct(top.pct)}.`);
  }
  if (c.length) {
    const top = [...c].sort((a, b) => Math.abs(b.pct) - Math.abs(a.pct))[0];
    const up = c.filter((x) => x.pct > 0).length;
    out.push(
      `${top.code} lidera as oscilações cripto em 24h (${formatPct(top.pct)}). ` +
        `${up} das ${c.length} maiores criptomoedas estão em alta.`
    );
  }
  return out.length ? out : ["Aguardando dados de mercado para gerar a leitura."];
}
