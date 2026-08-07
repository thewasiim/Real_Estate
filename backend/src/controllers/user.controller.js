import { userService } from '../services/user.service.js';

export const userController = {
  async getAll(req, res, next) {
    try {
      const result = await userService.getAll(req.query);
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  },

  async updateRole(req, res, next) {
    try {
      const user = await userService.updateRole(req.params.id, req.body.role);
      res.json({ success: true, data: user });
    } catch (err) { next(err); }
  },
};
