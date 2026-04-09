import type { PaymentMethod } from "@/types/order";

interface Props {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
}

const methods: { id: PaymentMethod; label: string; icon: string }[] = [
  { id: "ccp", label: "CCP", icon: "🏦" },
  { id: "baridimob", label: "BARIDIMOB", icon: "🏧" },
  { id: "cash", label: "CASH ON DELIVERY", icon: "💵" },
];

export default function PaymentMethodSelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {methods.map((m) => (
        <button
          key={m.id}
          type="button"
          onClick={() => onChange(m.id)}
          className={`flex flex-col items-center gap-2 p-4 border transition-colors ${
            value === m.id
              ? "border-ink bg-white"
              : "border-stone hover:border-mist"
          }`}
        >
          <span className="text-2xl">{m.icon}</span>
          <span className="label-mono text-[0.6rem]">{m.label}</span>
        </button>
      ))}
    </div>
  );
}
