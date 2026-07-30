const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { identify } = require("./middleware/auth");
const launchesRouter = require("./routes/launches");
const { STATE_LABELS, STATE_ORDER } = require("./utils/stateMachine");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.get("/api/states", (req, res) =>
  res.json({ data: STATE_ORDER.map((value) => ({ value, label: STATE_LABELS[value] })) })
);

// Todas las rutas de negocio requieren identificar rol/usuario.
app.use("/api/launches", identify, launchesRouter);

app.use((req, res) => res.status(404).json({ error: "Ruta no encontrada." }));

// Manejador de errores centralizado.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor." });
});

app.listen(PORT, () => {
  console.log(`🚀 Launch Manager API escuchando en http://localhost:${PORT}`);
});
