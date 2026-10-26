import { useState } from "react";
import { FLAG_CC } from "../../data/catalog";
import "./Flag.css";

/** Bandeira em imagem (flagcdn). Se não houver país ou a imagem falhar, mostra `fallback`. */
export default function Flag({ code, fallback = "", size = 20 }) {
  const [failed, setFailed] = useState(false);
  const cc = FLAG_CC[code];
  if (!cc || failed) return <span className="flag flag--text" style={{ width: size }}>{fallback}</span>;
  return (
    <img
      className="flag" alt="" loading="lazy" width={size} height={Math.round(size * 0.75)}
      src={`https://flagcdn.com/w40/${cc}.png`}
      srcSet={`https://flagcdn.com/w40/${cc}.png 1x, https://flagcdn.com/w80/${cc}.png 2x`}
      onError={() => setFailed(true)}
    />
  );
}

/** Ícone de qualquer ativo: bandeira (moeda) ou logo (cripto). */
export function AssetIcon({ asset, size = 20 }) {
  if (asset.kind === "crypto") {
    return asset.image ? (
      <img className="flag flag--round" alt="" width={size} height={size} src={asset.image} />
    ) : (
      <span className="flag flag--letter" style={{ width: size, height: size }}>{asset.code[0]}</span>
    );
  }
  return <Flag code={asset.code} fallback={asset.flag} size={size} />;
}
