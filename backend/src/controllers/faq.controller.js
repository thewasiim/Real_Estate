import { faqService } from '../services/faq.service.js';

export const faqController = {
  async getAll(req, res, next) {
    try {
      const result = await faqService.getAll(req.query);
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  },

  async getById(req, res, next) {
    try {
      const item = await faqService.getById(req.params.id);
      if (!item) return res.status(404).json({ success: false, error: 'FAQ not found' });
      res.json({ success: true, data: item });
    } catch (err) { next(err); }
  },

  async create(req, res, next) {
    try {
      const item = await faqService.create(req.body);
      res.status(201).json({ success: true, data: item });
    } catch (err) { next(err); }
  },

  async update(req, res, next) {
    try {
      const item = await faqService.update(req.params.id, req.body);
      res.json({ success: true, data: item });
    } catch (err) { next(err); }
  },

  async remove(req, res, next) {
    try {
      await faqService.remove(req.params.id);
      res.json({ success: true });
    } catch (err) { next(err); }
  },
};
