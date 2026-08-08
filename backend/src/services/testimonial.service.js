import prisma from '../config/db.js';

export const testimonialService = {
  async getAll(query = {}) {
    const page  = Math.max(1, parseInt(query.page)  || 1);
    const limit = Math.min(50, parseInt(query.limit) || 20);
    const skip  = (page - 1) * limit;

    const where = {};
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { review: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await prisma.$transaction([
      prisma.testimonial.findMany({ where, skip, take: limit }),
      prisma.testimonial.count({ where }),
    ]);

    return { items, total, page, totalPages: Math.ceil(total / limit) };
  },

  async getById(id) {
    return prisma.testimonial.findUnique({ where: { id } });
  },

  async create(data) {
    return prisma.testimonial.create({ data });
  },

  async update(id, data) {
    return prisma.testimonial.update({ where: { id }, data });
  },

  async remove(id) {
    return prisma.testimonial.delete({ where: { id } });
  },
};
