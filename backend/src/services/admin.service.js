import prisma from '../config/db.js';

export const adminService = {
  async getDashboardStats() {
    const [
      totalProperties,
      totalProjects,
      totalAgents,
      totalUsers,
      totalLeads,
      pendingLeads,
      recentLeads,
      recentProperties,
    ] = await Promise.all([
      prisma.property.count(),
      prisma.project.count(),
      prisma.agent.count(),
      prisma.user.count(),
      prisma.lead.count(),
      prisma.lead.count({ where: { status: 'NEW' } }),
      prisma.lead.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } } },
      }),
      prisma.property.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, price: true, city: true, status: true, images: true, createdAt: true },
      }),
    ]);

    return {
      totalProperties,
      totalProjects,
      totalAgents,
      totalUsers,
      totalLeads,
      pendingLeads,
      recentLeads,
      recentProperties,
    };
  },
};
