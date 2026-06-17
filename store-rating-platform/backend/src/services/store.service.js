const prisma = require('../config/prisma');
const AppError = require('../utils/error');

class StoreService {
  // 1. List stores with search, sort, average rating, and caller's own rating
  async listStoresForUser(userId, query) {
    const { search, sortBy = 'name', sortOrder = 'asc' } = query;

    // Search filter for name or address
    const whereClause = {};
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Fetch all matching stores
    const stores = await prisma.store.findMany({
      where: whereClause,
      orderBy: { [sortBy]: sortOrder.toLowerCase() === 'desc' ? 'desc' : 'asc' },
      include: {
        ratings: {
          select: {
            value: true,
            userId: true
          }
        }
      }
    });

    // Format output to calculate runtime overall average and pick current user's rating
    return stores.map(store => {
      const totalRatings = store.ratings.length;
      const sum = store.ratings.reduce((acc, curr) => acc + curr.value, 0);
      const overallRating = totalRatings > 0 ? parseFloat((sum / totalRatings).toFixed(2)) : 0;
      
      const userRatingRow = store.ratings.find(r => r.userId === userId);
      const myRating = userRatingRow ? userRatingRow.value : null;

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        overallRating,
        myRating
      };
    });
  }

 
  async upsertRating(userId, storeId, value) {
    
    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) {
      throw new AppError('Store not found', 404);
    }

   
    return await prisma.rating.upsert({
      where: {
        userId_storeId: { userId, storeId }
      },
      update: { value },
      create: { userId, storeId, value }
    });
  }
}

module.exports = new StoreService();