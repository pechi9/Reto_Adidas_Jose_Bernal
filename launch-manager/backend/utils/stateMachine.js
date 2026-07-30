/**
 * Máquina de estados del flujo de aprobación de lanzamientos.
 *
 *   BORRADOR --(enviar a revisión · creador)--> EN_REVISION
 *   EN_REVISION --(rechazar · aprobador)--> BORRADOR
 *   EN_REVISION --(aprobar · aprobador)--> APROBADO
 *   APROBADO --(publicar · aprobador)--> PUBLICADO
 *   APROBADO --(reabrir · aprobador)--> BORRADOR
 *
 * Un lanzamiento PUBLICADO es un estado final: no admite transiciones.
 */

const STATES = Object.freeze({
  BORRADOR: "borrador",
  EN_REVISION: "en_revision",
  APROBADO: "aprobado",
  PUBLICADO: "publicado",
});

const STATE_ORDER = [
  STATES.BORRADOR,
  STATES.EN_REVISION,
  STATES.APROBADO,
  STATES.PUBLICADO,
];

const STATE_LABELS = {
  [STATES.BORRADOR]: "Borrador",
  [STATES.EN_REVISION]: "En revisión",
  [STATES.APROBADO]: "Aprobado",
  [STATES.PUBLICADO]: "Publicado",
};

// Cada transición declara quién puede ejecutarla y qué acción representa.
const TRANSITIONS = [
  {
    from: STATES.BORRADOR,
    to: STATES.EN_REVISION,
    action: "enviar_a_revision",
    label: "Enviar a revisión",
    allowedRoles: ["creador"],
  },
  {
    from: STATES.EN_REVISION,
    to: STATES.BORRADOR,
    action: "rechazar",
    label: "Rechazar y devolver",
    allowedRoles: ["aprobador"],
    requiresComment: true,
  },
  {
    from: STATES.EN_REVISION,
    to: STATES.APROBADO,
    action: "aprobar",
    label: "Aprobar",
    allowedRoles: ["aprobador"],
  },
  {
    from: STATES.APROBADO,
    to: STATES.BORRADOR,
    action: "reabrir",
    label: "Reabrir como borrador",
    allowedRoles: ["aprobador"],
    requiresComment: true,
  },
  {
    from: STATES.APROBADO,
    to: STATES.PUBLICADO,
    action: "publicar",
    label: "Publicar",
    allowedRoles: ["aprobador"],
  },
];

function isValidState(state) {
  return STATE_ORDER.includes(state);
}

function availableTransitions(fromState, role) {
  return TRANSITIONS.filter(
    (t) => t.from === fromState && (!role || t.allowedRoles.includes(role))
  );
}

/**
 * Valida si una transición de `fromState` a `toState` es legal para `role`.
 * Devuelve { ok: true, transition } o { ok: false, reason }.
 */
function validateTransition({ fromState, toState, role }) {
  if (!isValidState(toState)) {
    return { ok: false, reason: `Estado destino desconocido: ${toState}` };
  }
  const match = TRANSITIONS.find(
    (t) => t.from === fromState && t.to === toState
  );
  if (!match) {
    return {
      ok: false,
      reason: `No existe una transición de "${STATE_LABELS[fromState]}" a "${STATE_LABELS[toState]}".`,
    };
  }
  if (!match.allowedRoles.includes(role)) {
    return {
      ok: false,
      reason: `El rol "${role}" no tiene permiso para "${match.label}".`,
    };
  }
  return { ok: true, transition: match };
}

function canEdit(state, role) {
  // Solo se puede editar contenido mientras el lanzamiento está en borrador,
  // y solo el creador lo edita. Una vez enviado a revisión queda congelado.
  return role === "creador" && state === STATES.BORRADOR;
}

function canDelete(state, role) {
  return role === "creador" && state === STATES.BORRADOR;
}

module.exports = {
  STATES,
  STATE_ORDER,
  STATE_LABELS,
  TRANSITIONS,
  isValidState,
  availableTransitions,
  validateTransition,
  canEdit,
  canDelete,
};
