# Torre de Control — Panel de Gestión de Lanzamientos de Producto

Aplicación para que el equipo de marketing cree lanzamientos de producto y los
lleve a través de un flujo de aprobación de 4 etapas, con vistas conectadas de
lista, timeline ("runway") y detalle.

```
Borrador ──(enviar a revisión · creador)──▶ En revisión
En revisión ──(rechazar · aprobador)──▶ Borrador
En revisión ──(aprobar · aprobador)──▶ Aprobado
Aprobado ──(reabrir · aprobador)──▶ Borrador
Aprobado ──(publicar · aprobador)──▶ Publicado   (estado final)
```

## Estructura del proyecto

```
launch-manager/
├── backend/                 API REST (Node.js + Express)
│   ├── server.js            punto de entrada
│   ├── data/db.js           "base de datos" en memoria + datos semilla
│   ├── utils/stateMachine.js  reglas de transición de estados por rol
│   ├── controllers/         lógica de negocio
│   ├── middleware/auth.js   identidad simplificada (rol vía headers)
│   └── routes/launches.js   definición de endpoints
└── frontend/                 UI (React + Vite + Tailwind)
    └── src/
        ├── App.jsx            orquestador de estado y vistas
        ├── views/             ListView.jsx, RunwayView.jsx
        ├── components/        TopBar, DetailDrawer, formularios, etc.
        └── lib/                cliente API y utilidades de estado
```

## Modelo de datos (relacional)

```
launches (1) ──< assets (N)          assets.launchId → launches.id
launches (1) ──< status_history (N)  statusHistory.launchId → launches.id
```

En esta demo vive en memoria (`Map` en `backend/data/db.js`); el esquema está
pensado para migrar directo a tablas SQL con esas mismas claves foráneas.

## Roles y permisos

| Acción                         | Creador | Aprobador |
|--------------------------------|:-------:|:---------:|
| Crear lanzamiento              | ✅      | ❌        |
| Editar / eliminar (en borrador)| ✅      | ❌        |
| Enviar a revisión              | ✅      | ❌        |
| Aprobar / rechazar             | ❌      | ✅        |
| Publicar / reabrir             | ❌      | ✅        |

El backend valida cada transición según `utils/stateMachine.js`; el frontend
solo *refleja* esos permisos (los que llegan en `permissions` en cada
lanzamiento), así que la fuente de verdad de los permisos es siempre la API.

## Cómo correrlo

Requiere Node.js 18+.

**1. Backend**
```bash
cd backend
npm install
npm start          # http://localhost:4000
```

**2. Frontend** (en otra terminal)
```bash
cd frontend
npm install
npm run dev         # http://localhost:5173
```

Abre `http://localhost:5173`. El proxy de Vite reenvía `/api/*` al backend en
el puerto 4000, así que no necesitas configurar CORS ni URLs manualmente.

## Endpoints principales

| Método | Ruta                                   | Descripción                          |
|--------|-----------------------------------------|---------------------------------------|
| GET    | `/api/launches?market=&status=&q=&from=&to=&sort=` | Listar con filtros           |
| GET    | `/api/launches/:id`                    | Detalle (assets + historial)          |
| POST   | `/api/launches`                        | Crear (rol: creador)                  |
| PUT    | `/api/launches/:id`                    | Editar (solo en borrador)             |
| DELETE | `/api/launches/:id`                    | Eliminar (solo en borrador)           |
| POST   | `/api/launches/:id/transition`         | Cambiar de estado `{ toStatus, comment }` |
| POST   | `/api/launches/:id/assets`             | Agregar asset                         |
| DELETE | `/api/launches/:id/assets/:assetId`    | Quitar asset                          |
| GET    | `/api/launches/markets`                | Mercados existentes (para filtros)    |

Todas las rutas de negocio requieren los headers `x-user-role` (`creador` o
`aprobador`) y `x-user-name`. Es una autenticación simplificada a propósito
para el alcance del reto; en producción se reemplazaría por JWT/sesión.

## Decisiones de diseño (UI/UX)

- **Paleta:** fondo tinta (`ink-900 #0F1420`), superficies `ink-800`, acentos
  ámbar (`en revisión` / acción principal) y verde (`aprobado` / `publicado`),
  rojo para acciones destructivas o de rechazo.
- **Tipografía:** Space Grotesk (títulos), Inter (texto), JetBrains Mono
  (fechas y datos), para que el panel se sienta como una consola operativa.
- **Elemento distintivo — "Runway":** en vez de un calendario genérico de
  cuadrícula, los lanzamientos se muestran en una pista vertical tipo pista de
  aterrizaje, agrupada por mes, con un nodo de color por estado y una barrita
  de 4 segmentos que se ilumina según la etapa — coherente con la idea de
  "lanzamiento".
- Los formularios, confirmaciones y mensajes de error usan voz activa y
  explican qué pasó y por qué (p. ej. "No puedes editar un lanzamiento en
  estado 'En revisión'"), no solo un genérico "no autorizado".

## Qué falta para producción

- Reemplazar el store en memoria por Postgres/MySQL con las FKs descritas arriba.
- Autenticación real (JWT/OAuth) en vez de headers de rol.
- Subida real de archivos para assets (hoy se guardan como URL).
- Paginación en `GET /api/launches` si el volumen de lanzamientos crece mucho.
