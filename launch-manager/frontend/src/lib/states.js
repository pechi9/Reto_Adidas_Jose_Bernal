export const STATE_ORDER = ["borrador", "en_revision", "aprobado", "publicado"];

export const STATE_META = {
  borrador: {
    label: "Borrador",
    dot: "bg-signal-slate",
    text: "text-signal-slate",
    chip: "bg-signal-slateSoft text-signal-slate border-signal-slate/30",
  },
  en_revision: {
    label: "En revisión",
    dot: "bg-signal-amber",
    text: "text-signal-amber",
    chip: "bg-signal-amberSoft text-signal-amber border-signal-amber/30",
  },
  aprobado: {
    label: "Aprobado",
    dot: "bg-signal-green",
    text: "text-signal-green",
    chip: "bg-signal-greenSoft text-signal-green border-signal-green/30",
  },
  publicado: {
    label: "Publicado",
    dot: "bg-signal-greenDeep",
    text: "text-signal-greenDeep",
    chip: "bg-signal-greenDeepSoft text-signal-greenDeep border-signal-greenDeep/30",
  },
};

export function daysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + "T00:00:00");
  return Math.round((target - today) / 86400000);
}

export function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}
