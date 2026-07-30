export default function ConfirmDialog({ title, message, confirmLabel = "Confirmar", onConfirm, onCancel, danger }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-xl border border-ink-600 bg-ink-800 p-5 shadow-panel animate-rise">
        <h3 className="font-display text-sm font-semibold text-mist-50">{title}</h3>
        <p className="mt-2 text-xs leading-relaxed text-mist-400">{message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onCancel} className="rounded-lg px-3 py-1.5 text-xs font-medium text-mist-400 hover:text-mist-50">
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold text-ink-950 ${
              danger ? "bg-signal-red" : "bg-signal-amber"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
