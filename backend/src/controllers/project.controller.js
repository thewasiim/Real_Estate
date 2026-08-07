import { projectService } from '../services/project.service.js';

export const projectController = {
  async getAll(req, res, next) {
    try {
      const result = await projectService.getAll(req.query);
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  },

  async getById(req, res, next) {
    try {
      const project = await projectService.getById(req.params.id);
      if (!project) return res.status(404).json({ success: false, error: 'Project not found' });
      res.json({ success: true, data: project });
    } catch (err) { next(err); }
  },

  async create(req, res, next) {
    try {
      const project = await projectService.create(req.body);
      res.status(201).json({ success: true, data: project });
    } catch (err) { next(err); }
  },

  async update(req, res, next) {
    try {
      const project = await projectService.update(req.params.id, req.body);
      res.json({ success: true, data: project });
    } catch (err) { next(err); }
  },

  async remove(req, res, next) {
    try {
      await projectService.remove(req.params.id);
      res.json({ success: true });
    } catch (err) { next(err); }
  },
};
