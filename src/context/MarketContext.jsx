import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchRatesWithChange, fetchExtraRates } from "../services/exchangeService";
import { fetchTopCrypto } from "../services/cryptoService";
import { LIVE_SYMBOLS } from "../utils/liveData";
import {
  FIAT_CATALOG, PEGS, EXTRA_CODES, APPROX_ANCHOR, BRL_ASSET, CRYPTO_FALLBACK,
} from "../data/catalog";

const POLL_MS = 60_000;
const MarketContext = createContext(null);

function buildFiat(ecb, extra) {
  const live = (code) => ecb?.rates?.[code];
  const out = FIAT_CATALOG.map((c) => {
    let brl = c.fallbackBrl;
    let pct = c.fallbackPct;
    let isLive = false;
    let anchor = null;
    let anchorRatio = null;

    const peg = PEGS[c.code];
    if (LIVE_SYMBOLS.includes(c.code) && live(c.code)) {
      brl = live(c.code).value;
      pct = live(c.code).pct;
      isLive = true;
    } else if (peg && live(peg.anchor)) {
      anchorRatio = 1 / peg.per;
      brl = live(peg.anchor).value * anchorRatio;
      pct = live(peg.anchor).pct;
      anchor = peg.anchor;
      isLive = true;
    } else if (EXTRA_CODES.includes(c.code) && extra?.[c.code]) {
      brl = extra[c.code];
      pct = c.code === "KWD" && live("USD") ? live("USD").pct : null;
      isLive = true;
      if (APPROX_ANCHOR[c.code] && live("USD")) {
        anchor = APPROX_ANCHOR[c.code];
        anchorRatio = brl / live("USD").value;
      }
    }
    return { ...c, brl, value: brl * c.unit, pct, up: (pct ?? 0) >= 0, live: isLive, anchor, anchorRatio };
  });
  return out;
}

export function MarketProvider({ children }) {
  const [ecb, setEcb] = useState(null);
  const [extra, setExtra] = useState(null);
  const [crypto, setCrypto] = useState(CRYPTO_FALLBACK);
  const [fiatStatus, setFiatStatus] = useState("loading");
  const [cryptoStatus, setCryptoStatus] = useState("loading");
  const [updatedAt, setUpdatedAt] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [e, x, c] = await Promise.allSettled([
        fetchRatesWithChange("BRL", LIVE_SYMBOLS),
        fetchExtraRates(EXTRA_CODES),
        fetchTopCrypto(),
      ]);
      if (cancelled) return;
      if (e.status === "fulfilled") { setEcb(e.value); setFiatStatus("success"); }
      else setFiatStatus((s) => (s === "success" ? s : "error"));
      if (x.status === "fulfilled") setExtra(x.value);
      if (c.status === "fulfilled") { setCrypto(c.value); setCryptoStatus("success"); }
      else setCryptoStatus((s) => (s === "success" ? s : "error"));
      setUpdatedAt(new Date());
    }
    load();
    const id = setInterval(load, POLL_MS);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  const value = useMemo(() => {
    const fiat = buildFiat(ecb, extra);
    const usd = fiat.find((f) => f.code === "USD");
    // Real exibido em dólar: 1 BRL = X USD, com variação invertida.
    const brlPct = usd ? (1 / (1 + (usd.pct ?? 0) / 100) - 1) * 100 : 0;
    const brl = { ...BRL_ASSET, pct: brlPct, up: brlPct >= 0, usdValue: usd ? 1 / usd.brl : null };
    const assets = [brl, ...fiat, ...crypto];
    const byKey = Object.fromEntries(assets.map((a) => [a.key, a]));
    return {
      fiat, crypto, brl, assets, byKey,
      asOf: ecb?.asOf ?? null,
      fiatStatus, cryptoStatus, updatedAt,
    };
  }, [ecb, extra, crypto, fiatStatus, cryptoStatus, updatedAt]);

  return <MarketContext.Provider value={value}>{children}</MarketContext.Provider>;
}

export function useMarket() {
  const ctx = useContext(MarketContext);
  if (!ctx) throw new Error("useMarket precisa estar dentro de <MarketProvider>");
  return ctx;
}
