import { STATE_ORDER, STATE_META } from "../lib/states";

/**
 * Pista de 4 segmentos que representa las etapas del flujo de aprobación,
 * inspirada en las luces de una pista de despegue: cada tramo se ilumina
 * a medida que el lanzamiento avanza.
 */
export default function StatusTrack({ status, compact = false }) {
  const currentIndex = STATE_ORDER.indexOf(status);

  return (
    <div className="flex items-center gap-1" aria-label={`Etapa: ${STATE_META[status].label}`}>
      {STATE_ORDER.map((stage, i) => {
        const meta = STATE_META[stage];
        const isPast = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <span
            key={stage}
            title={meta.label}
            className={`rounded-full transition-all ${compact ? "h-1 w-4" : "h-1.5 w-6"} ${
              isCurrent
                ? `${meta.dot} shadow-[0_0_8px_rgba(142,29,193,0.5)]`
                : isPast
                ? `${meta.dot} opacity-40`
                : "bg-ink-600"
            }`}
          />
        );
      })}
    </div>
  );
}
