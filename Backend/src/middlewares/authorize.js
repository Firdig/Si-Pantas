import { ForbiddenError, UnauthorizedError } from "../utils/app-error.js";

export function authorize(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError("Autentikasi diperlukan"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError("Anda tidak memiliki hak akses untuk endpoint ini"));
    }

    return next();
  };
}
