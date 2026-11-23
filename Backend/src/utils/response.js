export function sendSuccess(res, { statusCode = 200, message = "Berhasil", data = null, meta = null } = {}) {
  const payload = {
    success: true,
    message,
    data,
  };

  if (meta) {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
}

export function sendError(res, { statusCode = 500, message = "Terjadi kesalahan pada server", code = "INTERNAL_ERROR", details = null } = {}) {
  const error = { code };
  if (details) {
    error.details = details;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    error,
  });
}
