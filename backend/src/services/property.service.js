import prisma from '../config/db.js';

/**
 * Builds a Prisma `where` clause from query params per trd.md §5.3
 */
function buildWhereClause(q) {
  const where = {};

  if (q.listingType) where.listingType = q.listingType;
  if (q.city) where.city = { contains: q.city, mode: 'insensitive' };
  if (q.locality) where.locality = { contains: q.locality, mode: 'insensitive' };
  if (q.type) where.type = q.type;
  if (q.furnishing) where.furnishing = q.furnishing;
  if (q.bhk) where.bhk = parseInt(q.bhk);
  if (q.bathrooms) where.bathrooms = parseInt(q.bathrooms);
  if (q.readyToMove === 'true') where.status = 'Ready to Move';

  if (q.minPrice || q.maxPrice) {
    where.price = {};
    if (q.minPrice) where.price.gte = parseInt(q.minPrice);
    if (q.maxPrice) where.price.lte = parseInt(q.maxPrice);
  }

  if (q.minArea || q.maxArea) {
    where.area = {};
    if (q.minArea) where.area.gte = parseInt(q.minArea);
    if (q.maxArea) where.area.lte = parseInt(q.maxArea);
  }

  if (q.amenities) {
    const list = q.amenities.split(',').map((a) => a.trim()).filter(Boolean);
    if (list.length) where.amenities = { hasEvery: list };
  }

  return where;
}

function buildOrderBy(sort) {
  switch (sort) {
    case 'price_asc':        return { price: 'asc' };
    case 'price_desc':       return { price: 'desc' };
    case 'newest':           return { createdAt: 'desc' };
    case 'popularityScore_desc':
    default:                 return { popularityScore: 'desc' };
  }
}

export const propertyService = {
  async getAll(query) {
    const page  = Math.max(1, parseInt(query.page)  || 1);
    const limit = Math.min(50, parseInt(query.limit) || 12);
    const skip  = (page - 1) * limit;

    const where   = buildWhereClause(query);
    const orderBy = buildOrderBy(query.sort);

    const [items, total] = await prisma.$transaction([
      prisma.property.findMany({ where, orderBy, skip, take: limit,
        include: { agent: { select: { id: true, name: true, photoUrl: true, phone: true } } },
      }),
      prisma.property.count({ where }),
    ]);

    return { items, total, page, totalPages: Math.ceil(total / limit) };
  },

  async getById(id) {
    const property = await prisma.property.findUnique({
      where: { id },
      include: { agent: true },
    });
    return property;
  },

  async create(data) {
    return prisma.property.create({ data });
  },

  async update(id, data) {
    return prisma.property.update({ where: { id }, data });
  },

  async remove(id) {
    return prisma.property.delete({ where: { id } });
  },
};
