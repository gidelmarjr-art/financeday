/** CoinGecko (API pública, sem chave): top 20 por valor de mercado, em BRL. */
const URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=brl&order=market_cap_desc" +
  "&per_page=20&page=1&sparkline=true&price_change_percentage=24h,7d";

export async function fetchTopCrypto() {
  const res = await fetch(URL);
  if (!res.ok) throw new Error(`CoinGecko respondeu ${res.status}`);
  const list = await res.json();
  return list.map((c) => ({
    key: `crypto:${c.id}`,
    kind: "crypto",
    id: c.id,
    code: c.symbol.toUpperCase(),
    name: c.name,
    image: c.image,
    brl: c.current_price,
    value: c.current_price,
    pct: c.price_change_percentage_24h_in_currency ?? c.price_change_percentage_24h ?? 0,
    pct7d: c.price_change_percentage_7d_in_currency ?? null,
    rank: c.market_cap_rank,
    marketCap: c.market_cap,
    volume: c.total_volume,
    high24: c.high_24h,
    low24: c.low_24h,
    spark: c.sparkline_in_7d?.price ?? null,
    live: true,
  }));
}
