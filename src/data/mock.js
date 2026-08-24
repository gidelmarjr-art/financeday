export const FEATURED = [
  { code: "USD", label: "Dólar", value: "5,3241", pct: 0.42, up: true },
  { code: "EUR", label: "Euro", value: "5,7608", pct: 0.18, up: true },
  { code: "GBP", label: "Libra", value: "6,7215", pct: -0.25, up: false },
  { code: "BTC", label: "Bitcoin", value: "648.900", pct: 3.11, up: true },
];

// As 20 moedas mais valorizadas do mundo (fonte: Mitrade, "Top 20 Moedas
// Mais Valorizadas do Mundo em 2026") + as que já estavam no painel.
// Ordenadas por valor em BRL, da mais cara para a mais barata — a mesma
// lógica do ranking original —, com o bitcoin (categoria à parte) ao final.
export const CURRENCIES = [
  { code: "KWD", name: "Dinar Kuwaitiano", flag: "🇰🇼", value: "17,3033", pct: 0.03, up: true },
  { code: "BHD", name: "Dinar do Bahrein", flag: "🇧🇭", value: "14,1089", pct: 0.01, up: true },
  { code: "OMR", name: "Rial Omanense", flag: "🇴🇲", value: "13,8427", pct: 0.02, up: true },
  { code: "JOD", name: "Dinar Jordaniano", flag: "🇯🇴", value: "7,5070", pct: 0.04, up: true },
  { code: "GBP", name: "Libra Esterlina", flag: "🇬🇧", value: "6,7215", pct: -0.25, up: false },
  { code: "GIP", name: "Libra de Gibraltar", flag: "🇬🇮", value: "6,7215", pct: -0.25, up: false },
  { code: "KYD", name: "Dólar das Ilhas Cayman", flag: "🇰🇾", value: "6,3889", pct: 0.05, up: true },
  { code: "CHF", name: "Franco Suíço", flag: "🇨🇭", value: "6,1023", pct: 0.31, up: true },
  { code: "EUR", name: "Euro", flag: "🇪🇺", value: "5,7608", pct: 0.18, up: true },
  { code: "USD", name: "Dólar Americano", flag: "🇺🇸", value: "5,3241", pct: 0.42, up: true },
  { code: "CAD", name: "Dólar Canadense", flag: "🇨🇦", value: "3,9398", pct: 0.22, up: true },
  { code: "SGD", name: "Dólar de Singapura", flag: "🇸🇬", value: "3,9398", pct: 0.15, up: true },
  { code: "JPY", name: "Iene (¥100)", flag: "🇯🇵", value: "3,5510", pct: 0.05, up: true },
  { code: "AUD", name: "Dólar Australiano", flag: "🇦🇺", value: "3,5139", pct: -0.38, up: false },
  { code: "NZD", name: "Dólar Neozelandês", flag: "🇳🇿", value: "3,1945", pct: -0.41, up: false },
  { code: "AED", name: "Dirham dos EAU", flag: "🇦🇪", value: "1,4375", pct: 0.01, up: true },
  { code: "SAR", name: "Rial Saudita", flag: "🇸🇦", value: "1,4375", pct: 0.01, up: true },
  { code: "ILS", name: "Novo Shekel Israelense", flag: "🇮🇱", value: "1,4375", pct: -0.19, up: false },
  { code: "CNY", name: "Yuan Chinês", flag: "🇨🇳", value: "0,7402", pct: -0.08, up: false },
  { code: "NOK", name: "Coroa Norueguesa", flag: "🇳🇴", value: "0,5058", pct: -0.67, up: false },
  { code: "MXN", name: "Peso Mexicano", flag: "🇲🇽", value: "0,2768", pct: 0.29, up: true },
  { code: "TRY", name: "Lira Turca", flag: "🇹🇷", value: "0,1384", pct: -1.85, up: false },
  { code: "ARS", name: "Peso Argentino", flag: "🇦🇷", value: "0,0057", pct: -1.12, up: false },
  { code: "BTC", name: "Bitcoin", flag: "₿", value: "648.900,00", pct: 3.11, up: true },
];

// --------------------------------------------------------------------
// Histórico do gráfico
// --------------------------------------------------------------------
// As 4 moedas mais acompanhadas têm uma série "curada" à mão. Para as
// demais (as novas moedas da Mitrade), a série é GERADA a partir do valor
// atual e da variação do dia — assim, qualquer moeda da lista pode ser
// clicada e aparece no gráfico, não só as que já tinham histórico fixo.
const CURATED_HISTORY = {
  USD: [5.31, 5.29, 5.33, 5.3, 5.34, 5.32, 5.3241],
  EUR: [5.74, 5.76, 5.73, 5.78, 5.75, 5.77, 5.7608],
  GBP: [6.75, 6.73, 6.7, 6.74, 6.71, 6.69, 6.7215],
  BTC: [612, 620, 631, 640, 635, 645, 648.9],
};

// "5,3241" -> 5.3241 / "648.900,00" -> 648900 (formato numérico BR -> float)
function parseBRL(str) {
  return parseFloat(String(str).replace(/\./g, "").replace(",", "."));
}

// PRNG determinístico (mulberry32) semeado pelo código da moeda: a mesma
// moeda sempre gera a mesma série, então o gráfico não "pula" ao trocar
// de aba e voltar.
function seedFromCode(code) {
  let h = 0;
  for (let i = 0; i < code.length; i++) h = (h * 31 + code.charCodeAt(i)) | 0;
  return h >>> 0;
}

function mulberry32(seed) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const generatedHistoryCache = new Map();

function generateHistory(code) {
  const currency = CURRENCIES.find((c) => c.code === code);
  if (!currency) return CURATED_HISTORY.USD;

  const target = parseBRL(currency.value);
  const rand = mulberry32(seedFromCode(code));
  const points = 7;
  const dailyDrift = currency.pct / 100 / points;

  const series = [];
  let value = target;
  for (let i = points - 1; i > 0; i--) {
    series.unshift(Number(value.toFixed(6)));
    const noise = (rand() - 0.5) * target * 0.012;
    value = value / (1 + dailyDrift) - noise;
  }
  series.push(target); // o último ponto é sempre o valor exibido no card

  return series;
}

/** Devolve a série de 7 pontos (BRL) para qualquer código de moeda. */
export function getHistoryForCode(code) {
  if (CURATED_HISTORY[code]) return CURATED_HISTORY[code];
  if (!generatedHistoryCache.has(code)) {
    generatedHistoryCache.set(code, generateHistory(code));
  }
  return generatedHistoryCache.get(code);
}

export const CAPABILITIES = [
  {
    icon: "Activity",
    title: "Cotações em tempo real",
    description:
      "Painel principal com atualização periódica das principais moedas frente ao real, sem precisar recarregar a página.",
  },
  {
    icon: "LineChart",
    title: "Histórico de volatilidade",
    description:
      "Clique em qualquer moeda do painel para ver sua tendência dos últimos dias — não só as mais comuns.",
  },
  {
    icon: "Sparkles",
    title: "Leitura por IA",
    description:
      "Resumos automáticos apontando quais moedas mais se moveram e por que isso pode estar acontecendo.",
  },
  {
    icon: "Coins",
    title: "Múltiplas moedas",
    description:
      "Do dinar kuwaitiano ao bitcoin — as moedas mais valorizadas do mundo, lado a lado, em um único painel.",
  },
  {
    icon: "BellRing",
    title: "Variações em destaque",
    description:
      "Indicadores visuais claros de alta e queda, para identificar movimentos relevantes rapidamente.",
  },
  {
    icon: "Plug",
    title: "Arquitetura aberta",
    description:
      "Camada de serviços desacoplada, pronta para trocar ou combinar fontes de dados de câmbio.",
  },
];

export const STATS = [
  { value: 24, suffix: "", label: "moedas monitoradas" },
  { value: 60, suffix: "s", label: "intervalo de atualização" },
  { value: 24, suffix: "/7", label: "leitura de IA em segundo plano" },
  { value: 100, suffix: "%", label: "dados de fontes abertas" },
];

export const INSIGHTS = [
  "USD/BRL avança 0,42% nas últimas 24h — quarta sessão consecutiva de alta, impulsionada por dados de emprego nos EUA acima do esperado.",
  "BTC/BRL lidera as oscilações do dia (+3,11%), com volume de negociação 18% acima da média das últimas duas semanas.",
  "TRY/BRL segue pressionada (-1,85%), refletindo a inflação elevada da Turquia e ampliando o spread frente às moedas do Golfo.",
];
