import { agentService } from '../services/agent.service.js';

export const agentController = {
  async getAll(req, res, next) {
    try {
      const result = await agentService.getAll(req.query);
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  },

  async getById(req, res, next) {
    try {
      const agent = await agentService.getById(req.params.id);
      if (!agent) return res.status(404).json({ success: false, error: 'Agent not found' });
      res.json({ success: true, data: agent });
    } catch (err) { next(err); }
  },

  async create(req, res, next) {
    try {
      const agent = await agentService.create(req.body);
      res.status(201).json({ success: true, data: agent });
    } catch (err) { next(err); }
  },

  async update(req, res, next) {
    try {
      const agent = await agentService.update(req.params.id, req.body);
      res.json({ success: true, data: agent });
    } catch (err) { next(err); }
  },

  async remove(req, res, next) {
    try {
      await agentService.remove(req.params.id);
      res.json({ success: true });
    } catch (err) { next(err); }
  },
};
