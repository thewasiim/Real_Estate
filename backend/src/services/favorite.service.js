import prisma from '../config/db.js';

export const favoriteService = {
  /**
   * Returns all favorite properties for a user.
   * Joins property to return full property objects (not just Favorite rows).
   */
  async getAll(userId) {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        property: {
          include: {
            agent: { select: { id: true, name: true, photoUrl: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return favorites.map((f) => ({ ...f.property, favoriteId: f.id }));
  },

  /**
   * Adds a property to a user's favorites.
   * Returns the created Favorite record.
   */
  async add(userId, propertyId) {
    // Verify property exists
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) throw new Error('Property not found');

    return prisma.favorite.create({
      data: { userId, propertyId },
    });
  },

  /**
   * Removes a property from a user's favorites.
   */
  async remove(userId, propertyId) {
    const favorite = await prisma.favorite.findUnique({
      where: { userId_propertyId: { userId, propertyId } },
    });
    if (!favorite) throw new Error('Favorite not found');

    return prisma.favorite.delete({
      where: { userId_propertyId: { userId, propertyId } },
    });
  },
};
