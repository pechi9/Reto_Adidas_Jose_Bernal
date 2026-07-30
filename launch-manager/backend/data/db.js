const { nanoid } = require("nanoid");
const { STATES } = require("../utils/stateMachine");

/**
 * Modelo de datos relacional simulado en memoria:
 *
 *   launches (1) ──< assets (N)          -- assets.launchId -> launches.id
 *   launches (1) ──< status_history (N)  -- statusHistory.launchId -> launches.id
 *
 * En una versión productiva esto sería PostgreSQL con FKs reales;
 * aquí se modela igual para que el traspaso a SQL sea directo.
 */

const launches = new Map();
const assets = new Map();
const statusHistory = new Map();

function seedLaunch({ name, market, launchDate, status, owner, assetsData, historyOffsetDays }) {
  const id = nanoid(8);
  const now = new Date();
  const createdAt = new Date(now.getTime() - historyOffsetDays * 86400000).toISOString();
  launches.set(id, {
    id,
    name,
    market,
    launchDate,
    status,
    owner,
    description: `Lanzamiento de "${name}" dirigido al mercado ${market}.`,
    createdAt,
    updatedAt: createdAt,
  });

  (assetsData || []).forEach((a) => {
    const assetId = nanoid(8);
    assets.set(assetId, {
      id: assetId,
      launchId: id,
      name: a.name,
      type: a.type,
      url: a.url,
      createdAt,
    });
  });

  const histId = nanoid(8);
  statusHistory.set(histId, {
    id: histId,
    launchId: id,
    fromStatus: null,
    toStatus: STATES.BORRADOR,
    actorRole: "creador",
    actorName: owner,
    comment: "Lanzamiento creado.",
    timestamp: createdAt,
  });

  return id;
}

// --- Datos semilla ---
seedLaunch({
  name: "Aurora Wireless Earbuds",
  market: "México",
  launchDate: "2026-08-14",
  status: STATES.BORRADOR,
  owner: "Camila Ríos",
  historyOffsetDays: 3,
  assetsData: [
    { name: "Brief creativo", type: "documento", url: "https://assets.example.com/aurora-brief.pdf" },
    { name: "Hero banner", type: "imagen", url: "https://assets.example.com/aurora-hero.png" },
  ],
});

seedLaunch({
  name: "Nimbus App v3.2",
  market: "Colombia",
  launchDate: "2026-08-05",
  status: STATES.EN_REVISION,
  owner: "Camila Ríos",
  historyOffsetDays: 6,
  assetsData: [
    { name: "Guion de video", type: "documento", url: "https://assets.example.com/nimbus-script.pdf" },
    { name: "Video teaser", type: "video", url: "https://assets.example.com/nimbus-teaser.mp4" },
  ],
});

seedLaunch({
  name: "Solstice Running Shoes",
  market: "Chile",
  launchDate: "2026-07-31",
  status: STATES.APROBADO,
  owner: "Diego Fernández",
  historyOffsetDays: 10,
  assetsData: [
    { name: "Kit de prensa", type: "documento", url: "https://assets.example.com/solstice-press.pdf" },
    { name: "Fotografía producto", type: "imagen", url: "https://assets.example.com/solstice-product.png" },
  ],
});

seedLaunch({
  name: "Bloom Skincare Line",
  market: "Perú",
  launchDate: "2026-07-29",
  status: STATES.PUBLICADO,
  owner: "Diego Fernández",
  historyOffsetDays: 20,
  assetsData: [
    { name: "Landing page", type: "enlace", url: "https://bloom.example.com" },
    { name: "Post de Instagram", type: "imagen", url: "https://assets.example.com/bloom-ig.png" },
  ],
});

seedLaunch({
  name: "Vertex Gaming Laptop",
  market: "Argentina",
  launchDate: "2026-08-20",
  status: STATES.BORRADOR,
  owner: "Camila Ríos",
  historyOffsetDays: 1,
  assetsData: [{ name: "Brief creativo", type: "documento", url: "https://assets.example.com/vertex-brief.pdf" }],
});

seedLaunch({
  name: "Orbit Smartwatch S2",
  market: "México",
  launchDate: "2026-08-02",
  status: STATES.EN_REVISION,
  owner: "Diego Fernández",
  historyOffsetDays: 4,
  assetsData: [
    { name: "Copy de campaña", type: "documento", url: "https://assets.example.com/orbit-copy.pdf" },
  ],
});

module.exports = { launches, assets, statusHistory };
