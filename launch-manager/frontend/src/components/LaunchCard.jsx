import { Paperclip, MapPin } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";
import StatusTrack from "./StatusTrack.jsx";
import { daysUntil, formatDate } from "../lib/states";

export default function LaunchCard({ launch, onOpen }) {
  const diff = daysUntil(launch.launchDate);
  const countdown =
    diff > 1 ? `Faltan ${diff} días` : diff === 1 ? "Mañana" : diff === 0 ? "Hoy" : `Hace ${Math.abs(diff)} días`;

  return (
    <button
      onClick={onOpen}
      className="group flex w-full flex-col gap-3 rounded-xl border border-ink-700 bg-ink-800 p-4 text-left shadow-panel transition-colors hover:border-ink-500 animate-rise"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-sm font-semibold text-mist-50 group-hover:text-signal-amber transition-colors">
            {launch.name}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-xs text-mist-400">
            <MapPin size={11} />
            {launch.market}
          </div>
        </div>
        <StatusBadge status={launch.status} size="sm" />
      </div>

      <StatusTrack status={launch.status} compact />

      <div className="flex items-center justify-between border-t border-ink-700 pt-3 text-xs">
        <div className="font-mono text-mist-200">{formatDate(launch.launchDate)}</div>
        <div className="text-mist-400">{countdown}</div>
      </div>

      <div className="flex items-center justify-between text-xs text-mist-400">
        <span>{launch.owner}</span>
        {launch.assets?.length > 0 && (
          <span className="flex items-center gap-1">
            <Paperclip size={11} />
            {launch.assets.length}
          </span>
        )}
      </div>
    </button>
  );
}
