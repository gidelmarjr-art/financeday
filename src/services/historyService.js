/**
 * Histórico de preços (sempre em BRL por 1 unidade do ativo).
 * - Moedas do BCE: Frankfurter /timeseries (real).
 * - Moedas pareadas (AED, SAR…) e KWD: derivadas da âncora (USD/GBP) — real.
 * - ARS: amostras diárias da fawazahmed0/currency-api (real, 8 pontos).
 * - Cripto: CoinGecko /market_chart (real).
 * Se a rede falhar, devolve série sintética determinística e `estimated: true`
 * para a interface avisar que aquele gráfico é ilustrativo.
 */
import { LIVE_SYMBOLS } from "../utils/liveData";

const FRANK = "https://api.frankfurter.dev/v1";
const GECKO = "https://api.coingecko.com/api/v3";
const DAY = 86_400_000;
const TTL = 5 * 60_000;

const cache = new Map();
function cached(key, fn) {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.t < TTL) return hit.p;
  const p = fn().catch((e) => {
    cache.delete(key);
    throw e;
  });
  cache.set(key, { t: Date.now(), p });
  return p;
}

const iso = (d) => new Date(d).toISOString().slice(0, 10);

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

function downsample(points, max = 160) {
  if (points.length <= max) return points;
  const step = points.length / max;
  const out = [];
  for (let i = 0; i < max; i++) out.push(points[Math.floor(i * step)]);
  out.push(points[points.length - 1]);
  return out;
}

async function ecbSeries(code, days) {
  return cached(`ecb:${code}:${days}`, async () => {
    const end = Date.now();
    const data = await getJson(
      `${FRANK}/${iso(end - days * DAY)}..${iso(end)}?base=BRL&symbols=${code}`
    );
    return Object.entries(data.rates)
      .map(([date, r]) => ({ ts: Date.parse(`${date}T00:00:00Z`), v: 1 / r[code] }))
      .sort((a, b) => a.ts - b.ts);
  });
}

/**
 * Busca TODAS as moedas do BCE numa única requisição e povoa o cache de
 * `ecbSeries` — a tabela de moedas pede 14 históricos de uma vez.
 */
export async function prefetchEcb(days) {
  const end = Date.now();
  const data = await getJson(
    `${FRANK}/${iso(end - days * DAY)}..${iso(end)}?base=BRL&symbols=${LIVE_SYMBOLS.join(",")}`
  );
  const entries = Object.entries(data.rates).sort(([a], [b]) => (a < b ? -1 : 1));
  LIVE_SYMBOLS.forEach((code) => {
    const series = entries
      .filter(([, r]) => r[code] != null)
      .map(([date, r]) => ({ ts: Date.parse(`${date}T00:00:00Z`), v: 1 / r[code] }));
    cache.set(`ecb:${code}:${days}`, { t: Date.now(), p: Promise.resolve(series) });
  });
}

async function sampledSeries(code, days) {
  return cached(`fawaz:${code}:${days}`, async () => {
    const n = 8;
    const stamps = Array.from({ length: n }, (_, i) => Date.now() - ((n - 1 - i) / (n - 1)) * days * DAY);
    const lower = code.toLowerCase();
    const pts = await Promise.all(
      stamps.map(async (ts, i) => {
        const tag = i === n - 1 ? "latest" : iso(ts);
        const data = await getJson(
          `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${tag}/v1/currencies/brl.json`
        );
        return { ts, v: 1 / data.brl[lower] };
      })
    );
    return pts;
  });
}

async function cryptoSeries(id, days) {
  return cached(`gecko:${id}:${days}`, async () => {
    const data = await getJson(
      `${GECKO}/coins/${id}/market_chart?vs_currency=brl&days=${days}`
    );
    return downsample(data.prices.map(([ts, v]) => ({ ts, v })));
  });
}

// ---------- fallback sintético (determinístico) ----------
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function synthetic(asset, days) {
  let h = 0;
  for (const ch of asset.key) h = (h * 31 + ch.charCodeAt(0)) | 0;
  const rand = mulberry32(h >>> 0);
  const vol = asset.kind === "crypto" ? 0.035 : 0.006;
  const n = Math.min(days, 90);
  const pts = [];
  let v = asset.brl;
  for (let i = n; i >= 0; i--) {
    pts.unshift({ ts: Date.now() - i * (days / n) * DAY, v });
    v = v / (1 + (rand() - 0.5) * 2 * vol);
  }
  pts[pts.length - 1].v = asset.brl;
  return pts;
}

async function fetchReal(asset, days) {
  if (asset.code === "BRL" && asset.kind === "fiat") {
    return [
      { ts: Date.now() - days * DAY, v: 1 },
      { ts: Date.now(), v: 1 },
    ];
  }
  if (asset.kind === "crypto") return cryptoSeries(asset.id, days);

  if (asset.anchor) {
    const base = await ecbSeries(asset.anchor, days);
    return base.map((p) => ({ ts: p.ts, v: p.v * asset.anchorRatio }));
  }
  if (LIVE_SYMBOLS.includes(asset.code)) return ecbSeries(asset.code, days);
  return sampledSeries(asset.code, days);
}

/** → { points: [{ts, v}], estimated: boolean }  (v em BRL por 1 unidade) */
export function getSeries(asset, days) {
  return cached(`series:${asset.key}:${days}`, async () => {
    if (asset.live === false) return { points: synthetic(asset, days), estimated: true };
    try {
      const points = await fetchReal(asset, days);
      if (!points.length) throw new Error("vazio");
      return { points, estimated: false };
    } catch {
      return { points: synthetic(asset, days), estimated: true };
    }
  });
}

/**
 * Alinha uma série numa grade diária (UTC) dos últimos `days` dias, com
 * forward-fill (fins de semana / dia ainda não publicado pelo BCE).
 */
export function toDailyGrid(points, days) {
  const byDay = new Map();
  points.forEach((p) => byDay.set(iso(p.ts), p.v));
  const out = [];
  let last = points[0]?.v;
  for (let i = days; i >= 0; i--) {
    const ts = Date.now() - i * DAY;
    const key = iso(ts);
    if (byDay.has(key)) last = byDay.get(key);
    out.push({ ts, key, v: last });
  }
  return out;
}
