import { useCountUp } from "../../../hooks/useCountUp";
import FlashValue from "../FlashValue";

/** Valor que sobe até `amount` e pisca quando atualiza. `format` recebe o número animado. */
export default function CountValue({ amount, format, duration, animateKey }) {
  const v = useCountUp(amount ?? 0, { duration, animateKey });
  return <FlashValue value={amount}>{amount == null ? "—" : format(v)}</FlashValue>;
}
