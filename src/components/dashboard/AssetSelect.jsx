import "./AssetSelect.css";

const flagOf = (a) => (a.kind === "fiat" ? `${a.flag} ` : "");

/** <select> nativo agrupado (acessível e rápido em mobile) com moedas e criptos. */
export default function AssetSelect({ id, label, value, onChange, fiat, crypto }) {
  return (
    <label className="asset-select" htmlFor={id}>
      <span>{label}</span>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        <optgroup label="Moedas">
          {fiat.map((a) => (
            <option key={a.key} value={a.key}>
              {flagOf(a)}{a.code} — {a.name}
            </option>
          ))}
        </optgroup>
        <optgroup label="Criptomoedas">
          {crypto.map((a) => (
            <option key={a.key} value={a.key}>
              {a.code} — {a.name}
            </option>
          ))}
        </optgroup>
      </select>
    </label>
  );
}
