import LaunchCard from "../components/LaunchCard.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function ListView({ launches, onOpen }) {
  if (launches.length === 0) {
    return (
      <EmptyState
        title="Ningún lanzamiento coincide con los filtros"
        hint="Ajusta la búsqueda, el mercado o el estado para ver más resultados."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {launches.map((l) => (
        <LaunchCard key={l.id} launch={l} onOpen={() => onOpen(l.id)} />
      ))}
    </div>
  );
}
