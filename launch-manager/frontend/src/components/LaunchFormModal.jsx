import { useState } from "react";
import { X } from "lucide-react";

export default function LaunchFormModal({ initial, onClose, onSubmit, busy, error }) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    market: initial?.market || "",
    launchDate: initial?.launchDate || "",
    description: initial?.description || "",
  });

  const isEdit = !!initial;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md rounded-xl border border-ink-600 bg-ink-800 p-6 shadow-panel animate-rise"
      >
        <div className="mb-5 flex items-start justify-between">
          <h2 className="font-display text-base font-semibold text-mist-50">
            {isEdit ? "Editar lanzamiento" : "Nuevo lanzamiento"}
          </h2>
          <button type="button" onClick={onClose} className="text-mist-400 hover:text-mist-50">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <Field label="Nombre del lanzamiento">
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ej. Aurora Wireless Earbuds"
              className="input"
            />
          </Field>

          <Field label="Mercado">
            <input
              required
              value={form.market}
              onChange={(e) => setForm({ ...form, market: e.target.value })}
              placeholder="Ej. México"
              className="input"
            />
          </Field>

          <Field label="Fecha de lanzamiento">
            <input
              required
              type="date"
              value={form.launchDate}
              onChange={(e) => setForm({ ...form, launchDate: e.target.value })}
              className="input font-mono"
            />
          </Field>

          <Field label="Descripción (opcional)">
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Contexto breve del lanzamiento…"
              className="input resize-none"
            />
          </Field>
        </div>

        {error && <p className="mt-3 text-xs text-signal-red">{error}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3.5 py-2 text-xs font-medium text-mist-400 hover:text-mist-50"
          >
            Cancelar
          </button>
          <button
            disabled={busy}
            className="rounded-lg bg-signal-amber px-3.5 py-2 text-xs font-semibold text-mist-50 disabled:opacity-50"
          >
            {isEdit ? "Guardar cambios" : "Crear lanzamiento"}
          </button>
        </div>

        <style>{`
          .input {
            width: 100%;
            border-radius: 0.5rem;
            border: 1px solid #4C2A87;
            background: #240046;
            padding: 0.55rem 0.7rem;
            font-size: 0.8rem;
            color: #F5F1FB;
          }
          .input:focus { outline: none; border-color: rgba(142,29,193,0.6); }
        `}</style>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-mist-400">{label}</span>
      {children}
    </label>
  );
}
