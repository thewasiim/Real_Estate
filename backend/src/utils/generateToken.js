import jwt from 'jsonwebtoken';

/**
 * Generates a JWT with userId and role.
 * Uses a single moderately-lived token strategy (7d by default).
 * Technical decision: single session cookie, not access+refresh pair,
 * per the discussion in trd.md §8 — simpler for this scale.
 */
export function generateToken(userId, role) {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

/**
 * Sets the JWT as an httpOnly cookie on the response.
 */
export function setTokenCookie(res, token) {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

/**
 * Clears the auth cookie.
 */
export function clearTokenCookie(res) {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  });
}
