import { MapPin } from "lucide-react";
import StatusBadge from "../components/StatusBadge.jsx";
import StatusTrack from "../components/StatusTrack.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { STATE_META, daysUntil } from "../lib/states";

const MONTH_FMT = new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" });
const DAY_FMT = new Intl.DateTimeFormat("es-ES", { day: "2-digit" });
const WEEKDAY_FMT = new Intl.DateTimeFormat("es-ES", { weekday: "short" });

export default function RunwayView({ launches, onOpen }) {
  if (launches.length === 0) {
    return (
      <EmptyState
        title="No hay lanzamientos en el radar"
        hint="Crea un lanzamiento o ajusta los filtros para verlo en la pista."
      />
    );
  }

  const sorted = [...launches].sort((a, b) => new Date(a.launchDate) - new Date(b.launchDate));
  const groups = [];
  sorted.forEach((l) => {
    const key = MONTH_FMT.format(new Date(l.launchDate + "T00:00:00"));
    let group = groups.find((g) => g.key === key);
    if (!group) {
      group = { key, items: [] };
      groups.push(group);
    }
    group.items.push(l);
  });

  return (
    <div className="rounded-xl border border-ink-700 bg-ink-800/60">
      {groups.map((group, gi) => (
        <div key={group.key}>
          <div className="sticky top-0 z-10 border-b border-ink-700 bg-ink-800 px-5 py-2 backdrop-blur">
            <span className="font-display text-xs font-semibold uppercase tracking-wider text-mist-400">
              {group.key}
            </span>
          </div>
          <div className="relative">
            {/* La línea de la pista */}
            <div className="absolute left-[52px] top-0 h-full w-px bg-ink-600" />
            {group.items.map((l, i) => {
              const date = new Date(l.launchDate + "T00:00:00");
              const meta = STATE_META[l.status];
              const diff = daysUntil(l.launchDate);
              return (
                <button
                  key={l.id}
                  onClick={() => onOpen(l.id)}
                  className="group relative flex w-full items-center gap-4 border-b border-ink-700/60 px-5 py-3.5 text-left last:border-b-0 hover:bg-ink-700/40"
                >
                  <div className="w-11 shrink-0 text-right">
                    <div className="font-mono text-sm leading-none text-mist-50">{DAY_FMT.format(date)}</div>
                    <div className="mt-0.5 text-[10px] uppercase text-mist-400">{WEEKDAY_FMT.format(date)}</div>
                  </div>

                  <span
                    className={`relative z-10 h-3 w-3 shrink-0 rounded-full border-2 border-ink-800 ${meta.dot}`}
                  />

                  <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="truncate font-display text-sm font-medium text-mist-50 group-hover:text-signal-amber">
                        {l.name}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-mist-400">
                        <MapPin size={10} />
                        {l.market}
                        <span className="mx-1 text-ink-600">·</span>
                        {diff >= 0 ? `en ${diff} días` : `hace ${Math.abs(diff)} días`}
                      </div>
                    </div>

                    <div className="hidden items-center gap-4 sm:flex">
                      <StatusTrack status={l.status} />
                      <StatusBadge status={l.status} size="sm" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
