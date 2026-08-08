import { testimonialService } from '../services/testimonial.service.js';

export const testimonialController = {
  async getAll(req, res, next) {
    try {
      const result = await testimonialService.getAll(req.query);
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  },

  async getById(req, res, next) {
    try {
      const item = await testimonialService.getById(req.params.id);
      if (!item) return res.status(404).json({ success: false, error: 'Testimonial not found' });
      res.json({ success: true, data: item });
    } catch (err) { next(err); }
  },

  async create(req, res, next) {
    try {
      const item = await testimonialService.create(req.body);
      res.status(201).json({ success: true, data: item });
    } catch (err) { next(err); }
  },

  async update(req, res, next) {
    try {
      const item = await testimonialService.update(req.params.id, req.body);
      res.json({ success: true, data: item });
    } catch (err) { next(err); }
  },

  async remove(req, res, next) {
    try {
      await testimonialService.remove(req.params.id);
      res.json({ success: true });
    } catch (err) { next(err); }
  },
};
