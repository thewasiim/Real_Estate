import prisma from '../config/db.js';

export const blogService = {
  async getAll(query) {
    const page  = Math.max(1, parseInt(query.page)  || 1);
    const limit = Math.min(50, parseInt(query.limit) || 12);
    const skip  = (page - 1) * limit;

    const where = {};
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { author: { contains: query.search, mode: 'insensitive' } },
        { excerpt: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await prisma.$transaction([
      prisma.blogPost.findMany({ where, orderBy: { date: 'desc' }, skip, take: limit }),
      prisma.blogPost.count({ where }),
    ]);

    return { items, total, page, totalPages: Math.ceil(total / limit) };
  },

  async getByIdOrSlug(idOrSlug) {
    const post = await prisma.blogPost.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
    });
    return post;
  },

  async create(data) {
    if (!data.slug) {
      data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    return prisma.blogPost.create({ data });
  },

  async update(id, data) {
    return prisma.blogPost.update({ where: { id }, data });
  },

  async remove(id) {
    return prisma.blogPost.delete({ where: { id } });
  },
};
