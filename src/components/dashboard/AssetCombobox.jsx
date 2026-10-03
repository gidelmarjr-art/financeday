import { useMemo } from "react";
import Combobox from "../common/Combobox";
import { AssetIcon } from "../common/Flag";
import { formatBRL } from "../../utils/format";

/** Seletor pesquisável de moedas e criptomoedas (agrupado, com bandeira/logo e cotação). */
export default function AssetCombobox({ id, label, value, onChange, fiat, crypto }) {
  const items = useMemo(
    () => [
      ...fiat.map((a) => ({
        value: a.key, label: a.name, description: a.code, group: "Moedas",
        tag: a.code === "BRL" ? "moeda base" : formatBRL(a.brl),
        icon: <AssetIcon asset={a} size={24} />,
      })),
      ...crypto.map((a) => ({
        value: a.key, label: a.name, description: a.code, group: "Criptomoedas",
        tag: formatBRL(a.brl), icon: <AssetIcon asset={a} size={24} />,
      })),
    ],
    [fiat, crypto]
  );
  return (
    <Combobox
      id={id} label={label} items={items} value={value} onChange={onChange}
      placeholder="Buscar moeda ou cripto…" emptyMessage="Nenhuma moeda encontrada."
    />
  );
}
