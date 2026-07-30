import { useState } from "react";
import { X, MapPin, Paperclip, Trash2, Pencil, Clock, Link2, FileText, Image, Video } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";
import StatusTrack from "./StatusTrack.jsx";
import { formatDate } from "../lib/states";

const ASSET_ICON = { documento: FileText, imagen: Image, video: Video, enlace: Link2 };

export default function DetailDrawer({ launch, onClose, onEdit, onDelete, onTransition, onAddAsset, onRemoveAsset, busy }) {
  const [pendingAction, setPendingAction] = useState(null); // acción que requiere comentario
  const [comment, setComment] = useState("");
  const [newAsset, setNewAsset] = useState({ name: "", type: "documento", url: "" });
  const [showAssetForm, setShowAssetForm] = useState(false);

  if (!launch) return null;

  const runTransition = (t) => {
    if (t.requiresComment && pendingAction !== t.action) {
      setPendingAction(t.action);
      setComment("");
      return;
    }
    onTransition(t.to, comment);
    setPendingAction(null);
    setComment("");
  };

  const submitAsset = (e) => {
    e.preventDefault();
    if (!newAsset.name || !newAsset.url) return;
    onAddAsset(newAsset);
    setNewAsset({ name: "", type: "documento", url: "" });
    setShowAssetForm(false);
  };

  return (
    <div className="fixed inset-0 z-30 flex justify-end">
      <div className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-ink-700 bg-ink-900 shadow-2xl animate-rise">
        <div className="flex items-start justify-between gap-3 border-b border-ink-700 p-5">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <StatusBadge status={launch.status} />
            </div>
            <h2 className="font-display text-lg font-semibold text-mist-50">{launch.name}</h2>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-mist-400">
              <MapPin size={12} />
              {launch.market}
              <span className="mx-1 text-ink-600">·</span>
              <span className="font-mono">{formatDate(launch.launchDate)}</span>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-mist-400 hover:bg-ink-700 hover:text-mist-50">
            <X size={18} />
          </button>
        </div>

        <div className="border-b border-ink-700 p-5">
          <StatusTrack status={launch.status} />
          {launch.description && <p className="mt-4 text-sm leading-relaxed text-mist-200">{launch.description}</p>}
          <p className="mt-3 text-xs text-mist-400">Responsable: {launch.owner}</p>
        </div>

        {/* Acciones de flujo */}
        <div className="border-b border-ink-700 p-5">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-mist-400">Acciones</h3>
          {launch.permissions.transitions.length === 0 ? (
            <p className="text-xs text-mist-400">No tienes acciones disponibles para este lanzamiento en tu rol actual.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {launch.permissions.transitions.map((t) => (
                <div key={t.action}>
                  <button
                    disabled={busy}
                    onClick={() => runTransition(t)}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors disabled:opacity-50 ${
                      t.action === "rechazar" || t.action === "reabrir"
                        ? "border border-signal-red/30 bg-signal-redSoft text-signal-red hover:bg-signal-red/20"
                        : "bg-signal-amber text-ink-950 hover:brightness-105"
                    }`}
                  >
                    {t.label}
                  </button>
                  {pendingAction === t.action && (
                    <div className="mt-2 flex flex-col gap-2 rounded-lg border border-ink-600 bg-ink-800 p-3">
                      <label className="text-xs text-mist-400">Motivo (obligatorio)</label>
                      <textarea
                        autoFocus
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={2}
                        placeholder="Explica qué debe corregirse…"
                        className="rounded-md border border-ink-600 bg-ink-900 p-2 text-xs text-mist-50 focus:border-signal-amber/60"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setPendingAction(null)}
                          className="rounded-md px-2.5 py-1 text-xs text-mist-400 hover:text-mist-50"
                        >
                          Cancelar
                        </button>
                        <button
                          disabled={!comment.trim() || busy}
                          onClick={() => runTransition(t)}
                          className="rounded-md bg-signal-red px-2.5 py-1 text-xs font-semibold text-ink-950 disabled:opacity-40"
                        >
                          Confirmar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {(launch.permissions.canEdit || launch.permissions.canDelete) && (
            <div className="mt-3 flex gap-2 border-t border-ink-700 pt-3">
              {launch.permissions.canEdit && (
                <button
                  onClick={onEdit}
                  className="flex items-center gap-1.5 rounded-lg border border-ink-600 px-3 py-1.5 text-xs font-medium text-mist-200 hover:border-ink-500"
                >
                  <Pencil size={12} /> Editar
                </button>
              )}
              {launch.permissions.canDelete && (
                <button
                  onClick={onDelete}
                  className="flex items-center gap-1.5 rounded-lg border border-signal-red/30 px-3 py-1.5 text-xs font-medium text-signal-red hover:bg-signal-redSoft"
                >
                  <Trash2 size={12} /> Eliminar
                </button>
              )}
            </div>
          )}
        </div>

        {/* Assets */}
        <div className="border-b border-ink-700 p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-mist-400">
              <Paperclip size={12} /> Assets ({launch.assets.length})
            </h3>
            {launch.permissions.canEdit && (
              <button
                onClick={() => setShowAssetForm((s) => !s)}
                className="text-xs font-medium text-signal-amber hover:underline"
              >
                {showAssetForm ? "Cancelar" : "+ Agregar"}
              </button>
            )}
          </div>

          {showAssetForm && (
            <form onSubmit={submitAsset} className="mb-3 flex flex-col gap-2 rounded-lg border border-ink-600 bg-ink-800 p-3">
              <input
                required
                placeholder="Nombre del asset"
                value={newAsset.name}
                onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                className="rounded-md border border-ink-600 bg-ink-900 p-2 text-xs text-mist-50"
              />
              <div className="flex gap-2">
                <select
                  value={newAsset.type}
                  onChange={(e) => setNewAsset({ ...newAsset, type: e.target.value })}
                  className="rounded-md border border-ink-600 bg-ink-900 p-2 text-xs text-mist-50"
                >
                  <option value="documento">Documento</option>
                  <option value="imagen">Imagen</option>
                  <option value="video">Video</option>
                  <option value="enlace">Enlace</option>
                </select>
                <input
                  required
                  placeholder="URL"
                  value={newAsset.url}
                  onChange={(e) => setNewAsset({ ...newAsset, url: e.target.value })}
                  className="flex-1 rounded-md border border-ink-600 bg-ink-900 p-2 text-xs text-mist-50"
                />
              </div>
              <button className="self-end rounded-md bg-signal-amber px-3 py-1.5 text-xs font-semibold text-ink-950">
                Guardar asset
              </button>
            </form>
          )}

          <ul className="flex flex-col gap-2">
            {launch.assets.map((a) => {
              const Icon = ASSET_ICON[a.type] || FileText;
              return (
                <li
                  key={a.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-ink-700 bg-ink-800 px-3 py-2"
                >
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-w-0 items-center gap-2 text-xs text-mist-200 hover:text-signal-amber"
                  >
                    <Icon size={13} className="shrink-0 text-mist-400" />
                    <span className="truncate">{a.name}</span>
                  </a>
                  {launch.permissions.canEdit && (
                    <button onClick={() => onRemoveAsset(a.id)} className="text-mist-400 hover:text-signal-red">
                      <Trash2 size={12} />
                    </button>
                  )}
                </li>
              );
            })}
            {launch.assets.length === 0 && <p className="text-xs text-mist-400">Sin assets todavía.</p>}
          </ul>
        </div>

        {/* Historial */}
        <div className="p-5">
          <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-mist-400">
            <Clock size={12} /> Historial de estado
          </h3>
          <ul className="flex flex-col gap-3 border-l border-ink-700 pl-4">
            {launch.history.map((h) => (
              <li key={h.id} className="relative text-xs">
                <span className="absolute -left-[19px] top-1 h-2 w-2 rounded-full bg-signal-amber" />
                <div className="text-mist-200">
                  {h.fromStatus ? (
                    <>
                      <StatusBadge status={h.fromStatus} size="sm" /> → <StatusBadge status={h.toStatus} size="sm" />
                    </>
                  ) : (
                    <StatusBadge status={h.toStatus} size="sm" />
                  )}
                </div>
                <div className="mt-1 text-mist-400">
                  {h.actorName} · {h.actorRole} · {new Date(h.timestamp).toLocaleString("es-ES")}
                </div>
                {h.comment && <div className="mt-1 italic text-mist-400">"{h.comment}"</div>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
