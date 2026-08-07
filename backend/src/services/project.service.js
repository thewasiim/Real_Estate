import prisma from '../config/db.js';

export const projectService = {
  async getAll(query) {
    const page  = Math.max(1, parseInt(query.page)  || 1);
    const limit = Math.min(50, parseInt(query.limit) || 12);
    const skip  = (page - 1) * limit;

    const where = {};
    if (query.city)   where.city = { contains: query.city, mode: 'insensitive' };
    if (query.status) where.statusStage = query.status;

    const [items, total] = await prisma.$transaction([
      prisma.project.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      prisma.project.count({ where }),
    ]);

    return { items, total, page, totalPages: Math.ceil(total / limit) };
  },

  async getById(id) {
    return prisma.project.findUnique({ where: { id } });
  },

  async create(data) {
    return prisma.project.create({ data });
  },

  async update(id, data) {
    return prisma.project.update({ where: { id }, data });
  },

  async remove(id) {
    return prisma.project.delete({ where: { id } });
  },
};
