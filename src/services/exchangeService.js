/**
 * Camada de serviços — câmbio.
 * Consome a Frankfurter API (https://frankfurter.dev), uma API pública e
 * gratuita de taxas de câmbio baseada nas referências diárias do BCE.
 *
 * Observação: a Frankfurter cobre moedas fiduciárias "de referência do BCE"
 * (USD, EUR, GBP, CHF, JPY, CNY, CAD, SGD, AUD, NZD, ILS, NOK, MXN, TRY...).
 * Ela não cobre moedas atreladas/regionais como as do Golfo (KWD, BHD, OMR,
 * SAR, AED, JOD), Gibraltar (GIP) ou Ilhas Cayman (KYD), nem ARS ou
 * criptomoedas — esses pares continuam vindo de `data/mock.js` até que uma
 * fonte dedicada seja plugada.
 *
 * IMPORTANTE sobre "tempo real": o BCE publica UMA cotação de referência
 * por dia útil (por volta das 16h de Brasília), não um feed contínuo. Ou
 * seja, o valor pode ficar idêntico por horas — isso é esperado, não é bug.
 * Por isso toda resposta aqui carrega o campo `asOf`, com a data real da
 * cotação, para a interface deixar isso claro para quem está usando.
 */

const BASE_URL = "https://api.frankfurter.dev/v1";

function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

// 1 BRL = 0,1878 USD → inverte para 1 USD = 5,32 BRL, que é o formato do painel.
function invert(rates) {
  return Object.fromEntries(
    Object.entries(rates).map(([code, rate]) => [code, 1 / rate])
  );
}

async function fetchJson(path, base, symbols) {
  const query = symbols.length ? `&symbols=${symbols.join(",")}` : "";
  const res = await fetch(`${BASE_URL}/${path}?base=${base}${query}`);
  if (!res.ok) {
    throw new Error(`Frankfurter API respondeu ${res.status}`);
  }
  return res.json();
}

/** Cotações mais recentes, já invertidas para "1 unidade estrangeira = X BRL". */
export async function fetchLatestRates(base = "BRL", symbols = []) {
  const data = await fetchJson("latest", base, symbols);
  return invert(data.rates);
}

/** Cotações de uma data específica, no mesmo formato de fetchLatestRates. */
export async function fetchRatesOnDate(date, base = "BRL", symbols = []) {
  const data = await fetchJson(toIsoDate(date), base, symbols);
  return invert(data.rates);
}

/**
 * Combina a cotação mais recente com a do "dia útil anterior" para devolver
 * valor em BRL + variação percentual por moeda, além de `asOf` (a data real
 * da cotação, segundo a própria API — não a data de hoje no relógio local).
 *
 * O "dia anterior" é calculado a partir da data REAL da última cotação
 * (não da data de hoje no navegador). Isso corrige um bug: se hoje é
 * segunda-feira e a cotação mais recente ainda é a de sexta (porque o BCE
 * só publica a de segunda à tarde), pedir "ontem" (domingo) devolveria a
 * MESMA sexta-feira de novo — a Frankfurter cai para o último dia útil
 * disponível em vez de dar erro — e todas as variações sairiam zeradas.
 * Por isso: se a última cotação é de uma segunda, comparamos com a sexta
 * anterior (3 dias); nos demais dias, com o dia anterior (1 dia).
 */
export async function fetchRatesWithChange(base = "BRL", symbols = []) {
  const latest = await fetchJson("latest", base, symbols);
  const latestDate = new Date(`${latest.date}T00:00:00Z`);

  const offsetDays = latestDate.getUTCDay() === 1 ? 3 : 1;
  const previousDate = new Date(latestDate);
  previousDate.setUTCDate(previousDate.getUTCDate() - offsetDays);

  const [today, previous] = [
    invert(latest.rates),
    await fetchRatesOnDate(previousDate, base, symbols),
  ];

  const rates = symbols.reduce((acc, code) => {
    const current = today[code];
    const past = previous[code];
    if (current == null || past == null) return acc;

    const pct = past === current ? 0 : ((current - past) / past) * 100;
    acc[code] = { value: current, pct, up: pct >= 0 };
    return acc;
  }, {});

  return { asOf: latest.date, rates };
}
