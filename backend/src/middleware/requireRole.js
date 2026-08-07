/**
 * Role guard middleware factory.
 * Usage: requireRole('ADMIN') or requireRole('ADMIN', 'AGENT')
 */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }
    next();
  };
}
