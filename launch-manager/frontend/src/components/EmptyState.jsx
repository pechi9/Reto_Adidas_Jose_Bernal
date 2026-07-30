import { Rocket } from "lucide-react";

export default function EmptyState({ title, hint }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-ink-600 py-20 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-800 text-mist-400">
        <Rocket size={18} />
      </div>
      <div>
        <p className="font-display text-sm font-medium text-mist-50">{title}</p>
        <p className="mt-1 text-xs text-mist-400">{hint}</p>
      </div>
    </div>
  );
}
