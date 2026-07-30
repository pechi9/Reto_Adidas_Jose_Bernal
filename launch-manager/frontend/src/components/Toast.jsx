import { CheckCircle2, AlertTriangle } from "lucide-react";

export default function Toast({ toast }) {
  if (!toast) return null;
  const isError = toast.type === "error";
  return (
    <div
      className={`fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-medium shadow-panel animate-rise ${
        isError
          ? "border-signal-red/30 bg-signal-redSoft text-signal-red"
          : "border-signal-green/30 bg-signal-greenSoft text-signal-green"
      }`}
    >
      {isError ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
      {toast.message}
    </div>
  );
}
