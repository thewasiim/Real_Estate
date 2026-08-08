import { blogService } from '../services/blog.service.js';

export const blogController = {
  async getAll(req, res, next) {
    try {
      const result = await blogService.getAll(req.query);
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  },

  async getById(req, res, next) {
    try {
      const post = await blogService.getByIdOrSlug(req.params.id);
      if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
      res.json({ success: true, data: post });
    } catch (err) { next(err); }
  },

  async create(req, res, next) {
    try {
      const post = await blogService.create(req.body);
      res.status(201).json({ success: true, data: post });
    } catch (err) { next(err); }
  },

  async update(req, res, next) {
    try {
      const post = await blogService.update(req.params.id, req.body);
      res.json({ success: true, data: post });
    } catch (err) { next(err); }
  },

  async remove(req, res, next) {
    try {
      await blogService.remove(req.params.id);
      res.json({ success: true });
    } catch (err) { next(err); }
  },
};
