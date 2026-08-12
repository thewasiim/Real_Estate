import prisma from '../config/db.js';

const propertyCardSelect = {
  id: true, title: true, type: true, listingType: true, status: true,
  price: true, city: true, locality: true, area: true, areaUnit: true,
  bhk: true, bathrooms: true, furnishing: true, images: true,
};

const propertyDetailSelect = {
  id: true, slug: true, title: true, type: true, listingType: true, status: true,
  price: true, city: true, locality: true, address: true, area: true, areaUnit: true,
  bhk: true, bathrooms: true, parking: true, furnishing: true, amenities: true,
  images: true, floorPlans: true, videoTourUrl: true, tourUrl360: true,
  description: true, nearbySchools: true, nearbyHospitals: true, nearbyMetro: true,
  lat: true, lng: true,
  agent: { select: { id: true, name: true, photoUrl: true, phone: true, whatsapp: true, role: true } },
};

function positiveInteger(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function buildWhereClause(q) {
  const where = {};

  if (q.listingType === 'BUY' || q.listingType === 'RENT') where.listingType = q.listingType;
  if (q.city) where.city = { contains: q.city, mode: 'insensitive' };
  if (q.locality) where.locality = { contains: q.locality, mode: 'insensitive' };
  if (q.type) where.type = q.type;
  if (q.furnishing) where.furnishing = q.furnishing;

  const bhk = positiveInteger(q.bhk);
  if (bhk !== undefined) where.bhk = bhk >= 5 ? { gte: bhk } : bhk;
  const bathrooms = positiveInteger(q.bathrooms);
  if (bathrooms !== undefined) where.bathrooms = { gte: bathrooms };

  if (q.readyToMove === 'true') where.status = 'Ready to Move';
  if (q.isFeatured !== undefined && q.isFeatured !== '') where.isFeatured = q.isFeatured === 'true';
  if (q.status) where.status = { contains: q.status, mode: 'insensitive' };

  if (q.search) {
    where.OR = [
      { title: { contains: q.search, mode: 'insensitive' } },
      { city: { contains: q.search, mode: 'insensitive' } },
      { locality: { contains: q.search, mode: 'insensitive' } },
      { address: { contains: q.search, mode: 'insensitive' } },
    ];
  }

  const minPrice = positiveInteger(q.minPrice);
  const maxPrice = positiveInteger(q.maxPrice);
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  const minArea = positiveInteger(q.minArea);
  const maxArea = positiveInteger(q.maxArea);
  if (minArea !== undefined || maxArea !== undefined) {
    where.area = {};
    if (minArea !== undefined) where.area.gte = minArea;
    if (maxArea !== undefined) where.area.lte = maxArea;
  }

  if (typeof q.amenities === 'string') {
    const list = q.amenities.split(',').map((amenity) => amenity.trim()).filter(Boolean);
    if (list.length) where.amenities = { hasEvery: list };
  }

  return where;
}

function buildOrderBy(sort) {
  switch (sort) {
    case 'price_asc': return [{ price: 'asc' }, { id: 'asc' }];
    case 'price_desc': return [{ price: 'desc' }, { id: 'asc' }];
    case 'newest': return [{ createdAt: 'desc' }, { id: 'asc' }];
    case 'popularityScore_desc':
    default: return [{ popularityScore: 'desc' }, { id: 'asc' }];
  }
}

export const propertyService = {
  async getAll(query) {
    const page = Math.max(1, positiveInteger(query.page) || 1);
    const limit = Math.min(50, Math.max(1, positiveInteger(query.limit) || 12));
    const skip = (page - 1) * limit;
    const where = buildWhereClause(query);
    const orderBy = buildOrderBy(query.sort);

    // Independent read queries run concurrently without transaction overhead.
    const [items, total] = await Promise.all([
      prisma.property.findMany({ where, orderBy, skip, take: limit, select: propertyCardSelect }),
      prisma.property.count({ where }),
    ]);

    return { items, total, page, totalPages: Math.max(1, Math.ceil(total / limit)) };
  },

  async getById(id) {
    return prisma.property.findUnique({ where: { id }, select: propertyDetailSelect });
  },

  async create(data) { return prisma.property.create({ data }); },
  async update(id, data) { return prisma.property.update({ where: { id }, data }); },
  async remove(id) { return prisma.property.delete({ where: { id } }); },
};
