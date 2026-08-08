import prisma from '../config/db.js';

export const faqService = {
  async getAll(query = {}) {
    const page  = Math.max(1, parseInt(query.page)  || 1);
    const limit = Math.min(50, parseInt(query.limit) || 20);
    const skip  = (page - 1) * limit;

    const where = {};
    if (query.search) {
      where.OR = [
        { question: { contains: query.search, mode: 'insensitive' } },
        { answer: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await prisma.$transaction([
      prisma.fAQ.findMany({ where, skip, take: limit }),
      prisma.fAQ.count({ where }),
    ]);

    return { items, total, page, totalPages: Math.ceil(total / limit) };
  },

  async getById(id) {
    return prisma.fAQ.findUnique({ where: { id } });
  },

  async create(data) {
    return prisma.fAQ.create({ data });
  },

  async update(id, data) {
    return prisma.fAQ.update({ where: { id }, data });
  },

  async remove(id) {
    return prisma.fAQ.delete({ where: { id } });
  },
};
