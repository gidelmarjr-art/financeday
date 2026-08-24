import { useEffect, useState } from "react";
import { fetchRatesWithChange } from "../services/exchangeService";

const POLL_INTERVAL_MS = 60_000;

/**
 * Busca cotações reais (BRL como base) e mantém atualizado por polling.
 * Segue o ciclo descrito no escopo do projeto: busca inicial + atualização
 * periódica via setInterval, com limpeza garantida no desmonte.
 *
 * status: "loading" | "success" | "error"
 * asOf: data (YYYY-MM-DD) da cotação que a API devolveu — pode ficar igual
 * por horas, já que o BCE publica uma referência por dia útil, não um feed
 * contínuo. Isso é esperado; a interface usa `asOf` para deixar isso claro.
 * Em "error" (ex.: offline, CORS, rate limit), o chamador deve recorrer
 * aos dados mock — o dashboard nunca fica sem conteúdo para mostrar.
 */
export function useExchangeRates(symbols) {
  const [rates, setRates] = useState(null);
  const [asOf, setAsOf] = useState(null);
  const [status, setStatus] = useState("loading");
  const symbolsKey = symbols.join(",");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const result = await fetchRatesWithChange("BRL", symbols);
        if (!cancelled) {
          setRates(result.rates);
          setAsOf(result.asOf);
          setStatus("success");
        }
      } catch (err) {
        if (!cancelled) setStatus("error");
      }
    }

    load();
    const id = setInterval(load, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbolsKey]);

  return { rates, status, asOf };
}
