import { leadService } from '../services/lead.service.js';

export const leadController = {
  async create(req, res, next) {
    try {
      const data = { ...req.body };
      // Attach userId if authenticated (optional for leads — guests can submit too)
      if (req.user?.userId) data.userId = req.user.userId;

      const lead = await leadService.create(data);
      res.status(201).json({ success: true, data: { lead } });
    } catch (err) { next(err); }
  },

  async getAll(req, res, next) {
    try {
      const result = await leadService.getAll(req.query);
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  },

  async updateStatus(req, res, next) {
    try {
      const lead = await leadService.updateStatus(req.params.id, req.body.status);
      res.json({ success: true, data: lead });
    } catch (err) { next(err); }
  },
};
