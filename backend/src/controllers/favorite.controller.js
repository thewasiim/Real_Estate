import { favoriteService } from '../services/favorite.service.js';

export const favoriteController = {
  async getAll(req, res, next) {
    try {
      const favorites = await favoriteService.getAll(req.user.userId);
      res.json({ success: true, data: favorites });
    } catch (err) { next(err); }
  },

  async add(req, res, next) {
    try {
      const favorite = await favoriteService.add(req.user.userId, req.body.propertyId);
      res.status(201).json({ success: true, data: favorite });
    } catch (err) { next(err); }
  },

  async remove(req, res, next) {
    try {
      await favoriteService.remove(req.user.userId, req.params.propertyId);
      res.json({ success: true });
    } catch (err) { next(err); }
  },
};
