const nf = (min, max) =>
  new Intl.NumberFormat("pt-BR", { minimumFractionDigits: min, maximumFractionDigits: max });

/** Escolhe casas decimais conforme a magnitude (centavos de cripto, iene, etc.). */
export function smartDecimals(n) {
  const a = Math.abs(n);
  if (a === 0) return 2;
  if (a >= 1000) return 2;
  if (a >= 1) return 4;
  if (a >= 0.01) return 5;
  return 8;
}

export function formatNumber(n, decimals) {
  if (n == null || !Number.isFinite(n)) return "—";
  const d = decimals ?? smartDecimals(n);
  return nf(Math.min(2, d), d).format(n);
}

export function formatBRL(n, decimals) {
  if (n == null || !Number.isFinite(n)) return "—";
  return `R$ ${formatNumber(n, decimals ?? (Math.abs(n) >= 1000 ? 2 : smartDecimals(n)))}`;
}

export function formatCompact(n) {
  if (n == null || !Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(n);
}

export function formatPct(p, withSign = true) {
  if (p == null || !Number.isFinite(p)) return "—";
  const s = withSign && p > 0 ? "+" : "";
  return `${s}${nf(2, 2).format(p)}%`;
}

export function formatShortDate(ts) {
  return new Date(ts).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}
