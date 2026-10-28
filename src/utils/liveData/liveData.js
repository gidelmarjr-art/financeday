// Moedas cobertas pela Frankfurter API (referência do BCE). As demais —
// Golfo, Gibraltar, Ilhas Cayman, ARS e bitcoin — não têm referência do
// BCE e continuam vindo de data/mock.js (ver services/exchangeService.js).
export const LIVE_SYMBOLS = [
  "USD", "EUR", "GBP", "CHF", "JPY", "CNY",
  "CAD", "SGD", "AUD", "NZD", "ILS", "NOK", "MXN", "TRY",
];

/**
 * Mescla, por código, o valor ao vivo (quando disponível) em cima da lista
 * mock — usada tanto no Dashboard quanto na landing page, para as duas
 * áreas do site mostrarem sempre o mesmo número.
 */
export function withLiveData(list, rates) {
  if (!rates) return list;
  return list.map((c) => {
    const live = rates[c.code];
    if (!live) return c;
    return {
      ...c,
      value: live.value.toLocaleString("pt-BR", {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      }),
      pct: live.pct,
      up: live.up,
    };
  });
}

/** "2026-08-21" -> "21/08" (formatado em UTC para não deslocar o dia). */
export function formatAsOfDate(iso) {
  if (!iso) return null;
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "UTC",
  });
}
