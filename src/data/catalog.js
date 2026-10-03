import { CURRENCIES } from "./mock";

// "5,3241" -> 5.3241 | "648.900,00" -> 648900
function parseBR(str) {
  return parseFloat(String(str).replace(/\./g, "").replace(",", "."));
}

/**
 * Moedas pareadas (peg) a uma âncora cotada pelo BCE: o valor e o histórico
 * saem da âncora × paridade oficial, então acompanham o mercado de verdade.
 * `per` = unidades da moeda por 1 unidade da âncora.
 */
export const PEGS = {
  AED: { anchor: "USD", per: 3.6725 },
  SAR: { anchor: "USD", per: 3.75 },
  BHD: { anchor: "USD", per: 0.376 },
  OMR: { anchor: "USD", per: 0.3845 },
  JOD: { anchor: "USD", per: 0.709 },
  KYD: { anchor: "USD", per: 0.82 },
  GIP: { anchor: "GBP", per: 1 },
};

/** Moedas sem referência do BCE e sem peg exato (vêm de open.er-api.com). */
export const EXTRA_CODES = ["KWD", "ARS"];

// KWD acompanha uma cesta, muito próxima do dólar — usado só p/ histórico aproximado.
export const APPROX_ANCHOR = { KWD: "USD" };

/** Valor ilustrativo (fallback offline), em BRL por 1 unidade. */
export const FIAT_CATALOG = CURRENCIES.filter((c) => c.code !== "BTC").map((c) => {
  const unit = c.code === "JPY" ? 100 : 1;
  return {
    key: c.code,
    kind: "fiat",
    code: c.code,
    name: c.name.replace(" (¥100)", ""),
    flag: c.flag,
    unit,
    fallbackBrl: parseBR(c.value) / unit,
    fallbackPct: c.pct,
  };
});

export const BRL_ASSET = {
  key: "BRL",
  kind: "fiat",
  code: "BRL",
  name: "Real Brasileiro",
  flag: "🇧🇷",
  unit: 1,
  brl: 1,
  pct: 0,
  live: true,
};

// Top 20 por valor de mercado — usado SÓ se a CoinGecko estiver fora do ar.
// Valores ilustrativos (BRL).
const F = [
  ["bitcoin", "BTC", "Bitcoin", 648900, 3.11],
  ["ethereum", "ETH", "Ethereum", 22400, 2.2],
  ["tether", "USDT", "Tether", 5.32, 0.01],
  ["ripple", "XRP", "XRP", 12.6, -0.8],
  ["binancecoin", "BNB", "BNB", 3650, 0.6],
  ["solana", "SOL", "Solana", 940, 4.1],
  ["usd-coin", "USDC", "USDC", 5.32, 0],
  ["tron", "TRX", "TRON", 1.55, 0.4],
  ["dogecoin", "DOGE", "Dogecoin", 1.05, -1.4],
  ["cardano", "ADA", "Cardano", 3.4, 1.1],
  ["chainlink", "LINK", "Chainlink", 82, 2.7],
  ["avalanche-2", "AVAX", "Avalanche", 190, -0.9],
  ["stellar", "XLM", "Stellar", 1.7, 0.3],
  ["shiba-inu", "SHIB", "Shiba Inu", 0.000062, -2.1],
  ["sui", "SUI", "Sui", 19, 5.2],
  ["hedera-hashgraph", "HBAR", "Hedera", 1.2, 1.9],
  ["bitcoin-cash", "BCH", "Bitcoin Cash", 2650, -0.2],
  ["litecoin", "LTC", "Litecoin", 520, 0.9],
  ["the-open-network", "TON", "Toncoin", 17, -1.1],
  ["polkadot", "DOT", "Polkadot", 21, 1.4],
];
export const CRYPTO_FALLBACK = F.map(([id, code, name, brl, pct], i) => ({
  key: `crypto:${id}`,
  kind: "crypto",
  id,
  code,
  name,
  brl,
  value: brl,
  pct,
  pct7d: pct * 1.8,
  rank: i + 1,
  marketCap: null,
  volume: null,
  image: null,
  spark: null,
  live: false,
}));

// Ativos em destaque na Visão geral (troque aqui para mudar as criptos).
export const OVERVIEW_FIAT = ["USD", "EUR", "GBP", "CAD"];
export const OVERVIEW_CRYPTO = ["bitcoin", "ethereum", "solana"];
