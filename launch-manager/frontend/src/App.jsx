import { useEffect, useMemo, useState, useCallback } from "react";
import TopBar from "./components/TopBar.jsx";
import ListView from "./views/ListView.jsx";
import RunwayView from "./views/RunwayView.jsx";
import DetailDrawer from "./components/DetailDrawer.jsx";
import LaunchFormModal from "./components/LaunchFormModal.jsx";
import ConfirmDialog from "./components/ConfirmDialog.jsx";
import Toast from "./components/Toast.jsx";
import { api } from "./lib/api.js";

const ACTORS = {
  creador: { role: "creador", name: "Camila Ríos" },
  aprobador: { role: "aprobador", name: "Ana Vega" },
};

export default function App() {
  const [role, setRole] = useState("creador");
  const actor = ACTORS[role];

  const [launches, setLaunches] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [view, setView] = useState("list");
  const [filters, setFilters] = useState({ q: "", market: "", status: "", sort: "date", from: "", to: "" });

  const [selectedId, setSelectedId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState(null);

  const notify = useCallback((message, type = "success") => {
    setToast({ message, type });
    window.clearTimeout(notify._t);
    notify._t = window.setTimeout(() => setToast(null), 3200);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const data = await api.listLaunches(filters, actor);
      setLaunches(data);
      setLoadError("");
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, role]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    api.markets(actor).then(setMarkets).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const selected = useMemo(() => launches.find((l) => l.id === selectedId) || null, [launches, selectedId]);

  // Si el drawer está abierto, mantenemos el detalle fresco tras cada acción.
  const refreshSelected = useCallback(
    async (id) => {
      try {
        const data = await api.getLaunch(id, actor);
        setLaunches((prev) => prev.map((l) => (l.id === id ? data : l)));
      } catch (err) {
        notify(err.message, "error");
      }
    },
    [actor, notify]
  );

  const handleCreate = () => {
    setEditing(null);
    setFormError("");
    setFormOpen(true);
  };

  const handleEdit = () => {
    setEditing(selected);
    setFormError("");
    setFormOpen(true);
  };

  const submitForm = async (data) => {
    setBusy(true);
    setFormError("");
    try {
      if (editing) {
        await api.updateLaunch(editing.id, data, actor);
        notify("Lanzamiento actualizado.");
      } else {
        await api.createLaunch(data, actor);
        notify("Lanzamiento creado en borrador.");
      }
      setFormOpen(false);
      await refresh();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    setBusy(true);
    try {
      await api.deleteLaunch(confirmDelete, actor);
      notify("Lanzamiento eliminado.");
      setConfirmDelete(null);
      setSelectedId(null);
      await refresh();
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  const handleTransition = async (toStatus, comment) => {
    setBusy(true);
    try {
      await api.transition(selected.id, toStatus, comment, actor);
      notify("Estado actualizado.");
      await refreshSelected(selected.id);
      await refresh();
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  const handleAddAsset = async (asset) => {
    try {
      await api.addAsset(selected.id, asset, actor);
      notify("Asset agregado.");
      await refreshSelected(selected.id);
    } catch (err) {
      notify(err.message, "error");
    }
  };

  const handleRemoveAsset = async (assetId) => {
    try {
      await api.removeAsset(selected.id, assetId, actor);
      notify("Asset eliminado.");
      await refreshSelected(selected.id);
    } catch (err) {
      notify(err.message, "error");
    }
  };

  return (
    <div className="min-h-screen bg-ink-900">
      <TopBar
        role={role}
        onRoleChange={(r) => {
          setRole(r);
          setSelectedId(null);
        }}
        view={view}
        onViewChange={setView}
        filters={filters}
        onFiltersChange={setFilters}
        markets={markets}
        onCreate={handleCreate}
      />

      <main className="mx-auto max-w-[1400px] px-6 py-6">
        {loading ? (
          <p className="py-16 text-center text-xs text-mist-400">Cargando lanzamientos…</p>
        ) : loadError ? (
          <p className="py-16 text-center text-xs text-signal-red">{loadError}</p>
        ) : view === "list" ? (
          <ListView launches={launches} onOpen={setSelectedId} />
        ) : (
          <RunwayView launches={launches} onOpen={setSelectedId} />
        )}
      </main>

      {selected && (
        <DetailDrawer
          launch={selected}
          busy={busy}
          onClose={() => setSelectedId(null)}
          onEdit={handleEdit}
          onDelete={() => setConfirmDelete(selected.id)}
          onTransition={handleTransition}
          onAddAsset={handleAddAsset}
          onRemoveAsset={handleRemoveAsset}
        />
      )}

      {formOpen && (
        <LaunchFormModal
          initial={editing}
          busy={busy}
          error={formError}
          onClose={() => setFormOpen(false)}
          onSubmit={submitForm}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Eliminar lanzamiento"
          message="Esta acción no se puede deshacer. Se eliminará el lanzamiento, sus assets y su historial."
          confirmLabel="Eliminar"
          danger
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
}
