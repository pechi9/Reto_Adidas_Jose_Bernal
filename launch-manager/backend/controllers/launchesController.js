const { nanoid } = require("nanoid");
const { launches, assets, statusHistory } = require("../data/db");
const {
  STATES,
  STATE_LABELS,
  validateTransition,
  availableTransitions,
  canEdit,
  canDelete,
} = require("../utils/stateMachine");

function serializeLaunch(launch, { withRole } = {}) {
  const launchAssets = [...assets.values()].filter((a) => a.launchId === launch.id);
  const history = [...statusHistory.values()]
    .filter((h) => h.launchId === launch.id)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return {
    ...launch,
    assets: launchAssets,
    history,
    permissions: withRole
      ? {
          canEdit: canEdit(launch.status, withRole),
          canDelete: canDelete(launch.status, withRole),
          transitions: availableTransitions(launch.status, withRole).map((t) => ({
            action: t.action,
            to: t.to,
            label: t.label,
            requiresComment: !!t.requiresComment,
          })),
        }
      : undefined,
  };
}

function list(req, res) {
  const { market, status, q, from, to, sort } = req.query;
  let result = [...launches.values()];

  if (market) result = result.filter((l) => l.market.toLowerCase() === String(market).toLowerCase());
  if (status) result = result.filter((l) => l.status === status);
  if (q) {
    const needle = String(q).toLowerCase();
    result = result.filter(
      (l) =>
        l.name.toLowerCase().includes(needle) ||
        l.market.toLowerCase().includes(needle) ||
        l.owner.toLowerCase().includes(needle)
    );
  }
  if (from) result = result.filter((l) => l.launchDate >= from);
  if (to) result = result.filter((l) => l.launchDate <= to);

  result.sort((a, b) =>
    sort === "recent"
      ? new Date(b.updatedAt) - new Date(a.updatedAt)
      : new Date(a.launchDate) - new Date(b.launchDate)
  );

  res.json({
    data: result.map((l) => serializeLaunch(l, { withRole: req.user.role })),
    meta: { total: result.length, role: req.user.role },
  });
}

function get(req, res) {
  const launch = launches.get(req.params.id);
  if (!launch) return res.status(404).json({ error: "Lanzamiento no encontrado." });
  res.json({ data: serializeLaunch(launch, { withRole: req.user.role }) });
}

function create(req, res) {
  if (req.user.role !== "creador") {
    return res.status(403).json({ error: "Solo un creador puede crear lanzamientos." });
  }
  const { name, market, launchDate, description } = req.body;
  if (!name || !market || !launchDate) {
    return res.status(400).json({ error: "Faltan campos requeridos: name, market, launchDate." });
  }

  const id = nanoid(8);
  const now = new Date().toISOString();
  const launch = {
    id,
    name,
    market,
    launchDate,
    status: STATES.BORRADOR,
    owner: req.user.name,
    description: description || "",
    createdAt: now,
    updatedAt: now,
  };
  launches.set(id, launch);

  const histId = nanoid(8);
  statusHistory.set(histId, {
    id: histId,
    launchId: id,
    fromStatus: null,
    toStatus: STATES.BORRADOR,
    actorRole: req.user.role,
    actorName: req.user.name,
    comment: "Lanzamiento creado.",
    timestamp: now,
  });

  res.status(201).json({ data: serializeLaunch(launch, { withRole: req.user.role }) });
}

function update(req, res) {
  const launch = launches.get(req.params.id);
  if (!launch) return res.status(404).json({ error: "Lanzamiento no encontrado." });

  if (!canEdit(launch.status, req.user.role)) {
    return res.status(403).json({
      error: `No puedes editar un lanzamiento en estado "${STATE_LABELS[launch.status]}".`,
    });
  }

  const { name, market, launchDate, description } = req.body;
  if (name !== undefined) launch.name = name;
  if (market !== undefined) launch.market = market;
  if (launchDate !== undefined) launch.launchDate = launchDate;
  if (description !== undefined) launch.description = description;
  launch.updatedAt = new Date().toISOString();

  res.json({ data: serializeLaunch(launch, { withRole: req.user.role }) });
}

function remove(req, res) {
  const launch = launches.get(req.params.id);
  if (!launch) return res.status(404).json({ error: "Lanzamiento no encontrado." });

  if (!canDelete(launch.status, req.user.role)) {
    return res.status(403).json({
      error: `No puedes eliminar un lanzamiento en estado "${STATE_LABELS[launch.status]}".`,
    });
  }

  launches.delete(launch.id);
  [...assets.values()].filter((a) => a.launchId === launch.id).forEach((a) => assets.delete(a.id));
  [...statusHistory.values()].filter((h) => h.launchId === launch.id).forEach((h) => statusHistory.delete(h.id));

  res.status(204).send();
}

function transition(req, res) {
  const launch = launches.get(req.params.id);
  if (!launch) return res.status(404).json({ error: "Lanzamiento no encontrado." });

  const { toStatus, comment } = req.body;
  const validation = validateTransition({
    fromState: launch.status,
    toState: toStatus,
    role: req.user.role,
  });

  if (!validation.ok) {
    return res.status(422).json({ error: validation.reason });
  }
  if (validation.transition.requiresComment && !comment?.trim()) {
    return res.status(400).json({
      error: `La acción "${validation.transition.label}" requiere un comentario explicando el motivo.`,
    });
  }

  const fromStatus = launch.status;
  launch.status = toStatus;
  launch.updatedAt = new Date().toISOString();

  const histId = nanoid(8);
  statusHistory.set(histId, {
    id: histId,
    launchId: launch.id,
    fromStatus,
    toStatus,
    actorRole: req.user.role,
    actorName: req.user.name,
    comment: comment?.trim() || null,
    timestamp: launch.updatedAt,
  });

  res.json({ data: serializeLaunch(launch, { withRole: req.user.role }) });
}

function addAsset(req, res) {
  const launch = launches.get(req.params.id);
  if (!launch) return res.status(404).json({ error: "Lanzamiento no encontrado." });
  if (!canEdit(launch.status, req.user.role)) {
    return res.status(403).json({ error: "Solo se pueden agregar assets mientras el lanzamiento está en borrador." });
  }
  const { name, type, url } = req.body;
  if (!name || !url) return res.status(400).json({ error: "Faltan campos requeridos: name, url." });

  const id = nanoid(8);
  const asset = { id, launchId: launch.id, name, type: type || "otro", url, createdAt: new Date().toISOString() };
  assets.set(id, asset);
  launch.updatedAt = asset.createdAt;

  res.status(201).json({ data: serializeLaunch(launch, { withRole: req.user.role }) });
}

function removeAsset(req, res) {
  const launch = launches.get(req.params.id);
  if (!launch) return res.status(404).json({ error: "Lanzamiento no encontrado." });
  if (!canEdit(launch.status, req.user.role)) {
    return res.status(403).json({ error: "Solo se pueden quitar assets mientras el lanzamiento está en borrador." });
  }
  const asset = assets.get(req.params.assetId);
  if (!asset || asset.launchId !== launch.id) {
    return res.status(404).json({ error: "Asset no encontrado en este lanzamiento." });
  }
  assets.delete(asset.id);
  launch.updatedAt = new Date().toISOString();

  res.json({ data: serializeLaunch(launch, { withRole: req.user.role }) });
}

function markets(req, res) {
  const set = new Set([...launches.values()].map((l) => l.market));
  res.json({ data: [...set].sort() });
}

module.exports = {
  list,
  get,
  create,
  update,
  remove,
  transition,
  addAsset,
  removeAsset,
  markets,
};
