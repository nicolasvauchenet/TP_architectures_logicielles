export class DomainError extends Error {
  constructor(code, message) {
    super(message ?? code);
    this.code = code;
  }
}

export function errorMiddleware(err, req, res, _next) {
  if (err instanceof DomainError) {
    const map = {
      CONCERT_NOT_FOUND: 404,
      ARTIST_NOT_FOUND: 404,
      RESERVATION_EXISTS: 409,
      CAPACITY_EXCEEDED: 422,
      VALIDATION: 400,
    };
    return res
      .status(map[err.code] ?? 400)
      .json({ error: err.code, message: err.message });
  }
  console.error(err);
  res.status(500).json({ error: "INTERNAL_ERROR" });
}
