/**
 * Autenticación simplificada para la demo: el rol y el nombre del usuario
 * viajan en headers (en un sistema real vendrían de un JWT / sesión).
 *
 *   x-user-role: "creador" | "aprobador"
 *   x-user-name: string
 */
const VALID_ROLES = ["creador", "aprobador"];

function identify(req, res, next) {
  const role = req.header("x-user-role");
  const name = req.header("x-user-name") || "Usuario sin nombre";

  if (!role || !VALID_ROLES.includes(role)) {
    return res.status(401).json({
      error: "Header x-user-role faltante o inválido. Usa 'creador' o 'aprobador'.",
    });
  }

  req.user = { role, name };
  next();
}

module.exports = { identify, VALID_ROLES };
