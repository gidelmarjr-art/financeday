import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeftRight, ArrowRight } from "lucide-react";
import SectionHead from "../../common/SectionHead";
import Reveal from "../../common/Reveal";
import AssetCombobox from "../../dashboard/AssetCombobox";
import PriceChart from "../../dashboard/PriceChart";
import CountValue from "../../common/CountValue";
import { useMarket } from "../../../context/MarketContext";
import { usePairSeries } from "../../../hooks/usePairSeries";
import { formatNumber, smartDecimals, parseAmount } from "../../../utils/format";
import "./LiveConverter.css";

const QUICK = [["BRL", "USD"], ["EUR", "BRL"], ["USD", "BRL"], ["BRL", "crypto:bitcoin"]];

/** Demonstração funcional: o visitante converte de verdade, com os mesmos dados do painel. */
export default function LiveConverter() {
  const { fiat, crypto, brl, byKey } = useMarket();
  const [from, setFrom] = useState("BRL");
  const [to, setTo] = useState("USD");
  const [text, setText] = useState("100");
  const [days, setDays] = useState(30);
  const [spin, setSpin] = useState(0);

  const options = useMemo(() => [brl, ...fiat], [brl, fiat]);
  const a = byKey[from];
  const b = byKey[to];
  const amount = parseAmount(text);
  const rate = a && b ? a.brl / b.brl : null;
  const result = rate != null && Number.isFinite(amount) ? amount * rate : null;
  const pair = usePairSeries(a, b, days);
  const dec = rate != null ? smartDecimals(rate) : 4;
  const key = `${from}>${to}`;

  return (
    <section id="demo" className="lp-section demo">
      <div className="container">
        <SectionHead index="03" eyebrow="Demo" title={<>Experimente <em>agora</em>.</>}>
          É o conversor de verdade, com as cotações de agora. Troque os valores e as moedas — nada é salvo.
        </SectionHead>

        <Reveal as="div" className="demo__card lp-card">
          <div className="demo__form">
            <label className="demo__amount">
              <span>Valor</span>
              <input inputMode="decimal" value={text} onChange={(e) => setText(e.target.value)} aria-invalid={!Number.isFinite(amount)} placeholder="0,00" />
            </label>
            <AssetCombobox id="demo-from" label="De" value={from} onChange={setFrom} fiat={options} crypto={crypto} />
            <button className="demo__swap" style={{ "--spin": spin }} aria-label="Inverter moedas" onClick={() => { setFrom(to); setTo(from); setSpin((n) => n + 1); }}>
              <ArrowLeftRight size={17} />
            </button>
            <AssetCombobox id="demo-to" label="Para" value={to} onChange={setTo} fiat={options} crypto={crypto} />

            <div className="demo__quick">
              {QUICK.map(([f, t]) => (
                <button key={`${f}-${t}`} className={from === f && to === t ? "is-active" : ""} onClick={() => { setFrom(f); setTo(t); }}>
                  {byKey[f]?.code} → {byKey[t]?.code}
                </button>
              ))}
            </div>
          </div>

          <div className="demo__out">
            <div className="demo__result" aria-live="polite">
              {result == null ? (
                <span className="demo__hint">Digite um valor válido.</span>
              ) : (
                <>
                  <span>{formatNumber(amount)} {a.code} =</span>
                  <strong><CountValue amount={result} animateKey={key} duration={800} format={(v) => formatNumber(v, smartDecimals(result))} /> <em>{b.code}</em></strong>
                  <small>1 {a.code} = {formatNumber(rate, dec)} {b.code}</small>
                </>
              )}
            </div>
            {a && b && a.key !== b.key && (
              <PriceChart
                title={`${a.code}/${b.code}`} subtitle="Histórico do par" data={pair.points} loading={pair.loading}
                estimated={pair.estimated} days={days} onDays={setDays} decimals={dec} height={190}
              />
            )}
            <Link to="/dashboard/cambio" state={{ from }} className="demo__more">Abrir o conversor completo <ArrowRight size={15} /></Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
