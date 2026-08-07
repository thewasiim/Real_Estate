import { ZodError } from 'zod';

/**
 * Express middleware wrapper for zod validation.
 * Usage: validate(schema) — validates req.body against the schema.
 * Can also validate query params: validate(schema, 'query')
 */
export function validate(schema, source = 'body') {
  return (req, res, next) => {
    try {
      req[source] = schema.parse(req[source]);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const message = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
        return res.status(400).json({ success: false, error: message });
      }
      next(err);
    }
  };
}
