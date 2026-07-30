import { PenLine, ShieldCheck } from "lucide-react";

const ROLES = [
  { value: "creador", label: "Creador", icon: PenLine, hint: "Crea y edita lanzamientos" },
  { value: "aprobador", label: "Aprobador", icon: ShieldCheck, hint: "Revisa, aprueba y publica" },
];

export default function RoleSwitch({ role, onChange }) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-ink-600 bg-ink-800 p-1">
      {ROLES.map((r) => {
        const Icon = r.icon;
        const active = role === r.value;
        return (
          <button
            key={r.value}
            onClick={() => onChange(r.value)}
            title={r.hint}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              active
                ? "bg-signal-amber text-ink-950"
                : "text-mist-400 hover:text-mist-50"
            }`}
          >
            <Icon size={13} strokeWidth={2.4} />
            {r.label}
          </button>
        );
      })}
    </div>
  );
}
