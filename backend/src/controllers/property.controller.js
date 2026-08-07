import { propertyService } from '../services/property.service.js';

export const propertyController = {
  async getAll(req, res, next) {
    try {
      const result = await propertyService.getAll(req.query);
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  },

  async getById(req, res, next) {
    try {
      const property = await propertyService.getById(req.params.id);
      if (!property) return res.status(404).json({ success: false, error: 'Property not found' });
      res.json({ success: true, data: property });
    } catch (err) { next(err); }
  },

  async create(req, res, next) {
    try {
      const property = await propertyService.create(req.body);
      res.status(201).json({ success: true, data: property });
    } catch (err) { next(err); }
  },

  async update(req, res, next) {
    try {
      const property = await propertyService.update(req.params.id, req.body);
      res.json({ success: true, data: property });
    } catch (err) { next(err); }
  },

  async remove(req, res, next) {
    try {
      await propertyService.remove(req.params.id);
      res.json({ success: true });
    } catch (err) { next(err); }
  },
};
