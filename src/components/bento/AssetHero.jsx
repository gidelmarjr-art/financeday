import { ArrowLeftRight } from "lucide-react";
import CountValue from "../common/CountValue";
import Pill from "../common/Pill";
import { AssetIcon } from "../common/Flag";
import { formatBRL, smartDecimals } from "../../utils/format";
import "./AssetHero.css";

/** Card do ativo selecionado (Moedas e Criptomoedas): cotação em destaque + indicadores. */
export default function AssetHero({ asset, note, stats, onConvert }) {
  if (!asset) return null;
  return (
    <article className="bento-card asset-hero">
      <header>
        <AssetIcon asset={asset} size={30} />
        <div>
          <strong>{asset.name}</strong>
          <span>{asset.code}/BRL{asset.live === false ? " · ilustrativo" : ""}</span>
        </div>
      </header>

      <div className="asset-hero__value">
        <CountValue amount={asset.value} duration={900} format={(v) => formatBRL(v, smartDecimals(asset.value))} />
        <Pill pct={asset.pct} />
      </div>
      {note && <p className="asset-hero__note">{note}</p>}

      <dl className="asset-hero__stats">
        {stats.map((s) => (
          <div key={s.label}>
            <dt>{s.label}</dt>
            <dd>{s.node}</dd>
          </div>
        ))}
      </dl>

      <button className="btn btn--primary asset-hero__cta" onClick={onConvert}>
        <ArrowLeftRight size={15} /> Converter {asset.code}
      </button>
    </article>
  );
}
