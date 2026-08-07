import prisma from '../config/db.js';

export const agentService = {
  async getAll(query) {
    const page  = Math.max(1, parseInt(query.page)  || 1);
    const limit = Math.min(50, parseInt(query.limit) || 12);
    const skip  = (page - 1) * limit;

    const where = {};
    if (query.city) where.city = { contains: query.city, mode: 'insensitive' };

    const [items, total] = await prisma.$transaction([
      prisma.agent.findMany({ where, orderBy: { name: 'asc' }, skip, take: limit }),
      prisma.agent.count({ where }),
    ]);

    return { items, total, page, totalPages: Math.ceil(total / limit) };
  },

  async getById(id) {
    return prisma.agent.findUnique({
      where: { id },
      include: {
        properties: {
          orderBy: { createdAt: 'desc' },
          take: 6,
        },
      },
    });
  },

  async create(data) {
    return prisma.agent.create({ data });
  },

  async update(id, data) {
    return prisma.agent.update({ where: { id }, data });
  },

  async remove(id) {
    return prisma.agent.delete({ where: { id } });
  },
};
