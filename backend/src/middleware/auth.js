import jwt from 'jsonwebtoken';

/**
 * Verifies the JWT from the httpOnly cookie.
 * Attaches { userId, role } to req.user on success.
 */
export function verifyToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authenticated' });
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}
