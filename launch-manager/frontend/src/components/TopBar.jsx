import { LayoutList, Rocket, Search, SlidersHorizontal, Plus } from "lucide-react";
import RoleSwitch from "./RoleSwitch.jsx";
import { STATE_ORDER, STATE_META } from "../lib/states";

export default function TopBar({
  role,
  onRoleChange,
  view,
  onViewChange,
  filters,
  onFiltersChange,
  markets,
  onCreate,
}) {
  return (
    <header className="border-b border-ink-700 bg-ink-900/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-6 py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-signal-amber/15 text-signal-amber">
              <Rocket size={18} strokeWidth={2.2} />
            </div>
            <div>
              <h1 className="font-display text-lg font-semibold leading-tight text-mist-50">
                Torre de Control
              </h1>
              <p className="text-xs text-mist-400">Lanzamientos de producto · Marketing</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <RoleSwitch role={role} onChange={onRoleChange} />
            {role === "creador" && (
              <button
                onClick={onCreate}
                className="flex items-center gap-1.5 rounded-lg bg-signal-amber px-3.5 py-2 text-xs font-semibold text-ink-950 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus size={14} strokeWidth={2.6} />
                Nuevo lanzamiento
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-ink-600 bg-ink-800 p-1">
            <ViewTab active={view === "list"} onClick={() => onViewChange("list")} icon={LayoutList} label="Lista" />
            <ViewTab active={view === "runway"} onClick={() => onViewChange("runway")} icon={Rocket} label="Runway" />
          </div>

          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist-400"
            />
            <input
              value={filters.q}
              onChange={(e) => onFiltersChange({ ...filters, q: e.target.value })}
              placeholder="Buscar por nombre, mercado o responsable…"
              className="w-full rounded-lg border border-ink-600 bg-ink-800 py-2 pl-8 pr-3 text-sm text-mist-50 placeholder:text-mist-400/70 focus:border-signal-amber/60"
            />
          </div>

          <select
            value={filters.market}
            onChange={(e) => onFiltersChange({ ...filters, market: e.target.value })}
            className="rounded-lg border border-ink-600 bg-ink-800 px-3 py-2 text-sm text-mist-50 focus:border-signal-amber/60"
          >
            <option value="">Todos los mercados</option>
            {markets.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
            className="rounded-lg border border-ink-600 bg-ink-800 px-3 py-2 text-sm text-mist-50 focus:border-signal-amber/60"
          >
            <option value="">Todos los estados</option>
            {STATE_ORDER.map((s) => (
              <option key={s} value={s}>
                {STATE_META[s].label}
              </option>
            ))}
          </select>

          <button
            onClick={() =>
              onFiltersChange({ ...filters, sort: filters.sort === "recent" ? "date" : "recent" })
            }
            className="flex items-center gap-1.5 rounded-lg border border-ink-600 bg-ink-800 px-3 py-2 text-xs font-medium text-mist-400 hover:text-mist-50"
            title="Cambiar orden"
          >
            <SlidersHorizontal size={13} />
            {filters.sort === "recent" ? "Recientes" : "Por fecha"}
          </button>
        </div>
      </div>
    </header>
  );
}

function ViewTab({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
        active ? "bg-ink-600 text-mist-50" : "text-mist-400 hover:text-mist-50"
      }`}
    >
      <Icon size={13} />
      {label}
    </button>
  );
}
