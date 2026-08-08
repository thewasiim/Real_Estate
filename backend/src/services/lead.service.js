import prisma from '../config/db.js';

export const leadService = {
  /**
   * Creates a new lead. userId is optional (guests can submit).
   * type-specific validation is handled by Zod schema in the router.
   */
  async create(data) {
    return prisma.lead.create({ data });
  },

  /**
   * Admin: get all leads with optional type/status filter + pagination.
   */
  async getAll(query) {
    const page  = Math.max(1, parseInt(query.page)  || 1);
    const limit = Math.min(100, parseInt(query.limit) || 20);
    const skip  = (page - 1) * limit;

    const where = {};
    if (query.type)   where.type   = query.type;
    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { phone: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await prisma.$transaction([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { user: { select: { id: true, name: true, email: true } } },
      }),
      prisma.lead.count({ where }),
    ]);

    return { items, total, page, totalPages: Math.ceil(total / limit) };
  },

  /**
   * Admin: update lead status.
   */
  async updateStatus(id, status) {
    return prisma.lead.update({ where: { id }, data: { status } });
  },

  /**
   * Admin: remove lead.
   */
  async remove(id) {
    return prisma.lead.delete({ where: { id } });
  },
};
