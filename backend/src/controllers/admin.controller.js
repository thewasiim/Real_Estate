import { adminService } from '../services/admin.service.js';

export const adminController = {
  async getStats(req, res, next) {
    try {
      const stats = await adminService.getDashboardStats();
      res.json({ success: true, data: stats });
    } catch (err) {
      next(err);
    }
  },
};
