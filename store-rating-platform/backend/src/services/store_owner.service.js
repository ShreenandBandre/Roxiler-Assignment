const prisma = require('../config/prisma');
const AppError = require('../utils/error');

class StoreOwnerService {
  
  async getOwnerDashboard(ownerId) {
    
    const store = await prisma.store.findFirst({
      where: { ownerId }
    });

    if (!store) {
      throw new AppError('No store associated with this Store Owner account', 404);
    }

    
    const ratings = await prisma.rating.findMany({
      where: { storeId: store.id },
      orderBy: { updatedAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });

    
    const aggregation = await prisma.rating.aggregate({
      where: { storeId: store.id },
      _avg: { value: true }
    });

    const averageRating = aggregation._avg.value || 0;

    return {
      store: {
        id: store.id,
        name: store.name,
        averageRating: parseFloat(averageRating.toFixed(2))
      },
      raters: ratings.map(r => ({
        id: r.id,
        raterName: r.user.name,
        raterEmail: r.user.email,
        rating: r.value,
        date: r.updatedAt
      }))
    };
  }
}

module.exports = new StoreOwnerService();