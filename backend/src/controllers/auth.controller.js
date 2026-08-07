import { authService } from '../services/auth.service.js';
import { generateToken, setTokenCookie, clearTokenCookie } from '../utils/generateToken.js';

export const authController = {
  /**
   * Register endpoint.
   */
  async register(req, res, next) {
    try {
      const { name, email, password, phone } = req.body;
      const user = await authService.registerUser({ name, email, password, phone });

      // Generate JWT and set cookie
      const token = generateToken(user.id, user.role);
      setTokenCookie(res, token);

      res.status(201).json({
        success: true,
        data: { user },
      });
    } catch (err) {
      // Pass error to errorHandler middleware
      next(err);
    }
  },

  /**
   * Login endpoint.
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await authService.loginUser({ email, password });

      // Generate JWT and set cookie
      const token = generateToken(user.id, user.role);
      setTokenCookie(res, token);

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Logout endpoint.
   */
  async logout(req, res, next) {
    try {
      clearTokenCookie(res);
      res.status(200).json({
        success: true,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Me / Session check endpoint.
   */
  async me(req, res, next) {
    try {
      // req.user is attached by verifyToken middleware
      const user = await authService.getUserById(req.user.userId);
      if (!user) {
        return res.status(401).json({ success: false, error: 'User not found' });
      }

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (err) {
      next(err);
    }
  },
};
