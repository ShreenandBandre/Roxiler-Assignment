const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/error');

class AdminService {
  // 1. GET /api/admin/dashboard - Counts for users, stores, and ratings
  async getDashboardStats() {
    const [userCount, storeCount, ratingCount] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count(),
    ]);

    return {
      users: userCount,
      stores: storeCount,
      ratings: ratingCount
    };
  }

  // 2. POST /api/admin/users - Add a Normal User or Admin
  async createUser(userData) {
    const existingUser = await prisma.user.findUnique({ where: { email: userData.email } });
    if (existingUser) {
      throw new AppError('Email address is already registered', 400);
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    return await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
      select: { id: true, name: true, email: true, role: true, address: true }
    });
  }

  // 3. UPDATED: POST /api/admin/stores - Creates business outlet and partner account profile simultaneously
  async createStore(storeData) {
    const { name, email, address, ownerName, ownerEmail } = storeData;

    if (!ownerEmail) {
      throw new AppError('Owner email is required for dynamic provisioning mapping', 400);
    }

    // Wrap in an atomic transaction to ensure data integrity
    return await prisma.$transaction(async (tx) => {
      // Check if the assigned owner already exists in the system matrix
      let owner = await tx.user.findUnique({ where: { email: ownerEmail } });

      if (owner) {
        // Validation Guard: If user exists but isn't an owner, throw exception block
        if (owner.role !== 'STORE_OWNER') {
          throw new AppError('The user associated with this email exists but does not hold a STORE_OWNER role matrix', 400);
        }
      } else {
        // On-the-fly provisioning execution block
        const defaultHashedPassword = await bcrypt.hash('OwnerDefaultPassword123!', 10);
        owner = await tx.user.create({
          data: {
            name: ownerName || `${name} Owner`,
            email: ownerEmail,
            password: defaultHashedPassword,
            role: 'STORE_OWNER',
            address: address || '',
          }
        });
      }

      
      const existingStore = await tx.store.findFirst({ where: { email } });
      if (existingStore) {
        throw new AppError('A store establishment with this business email is already registered', 400);
      }

      
      return await tx.store.create({
        data: {
          name,
          email,
          address,
          ownerId: owner.id 
        },
        include: {
          owner: {
            select: { id: true, name: true, email: true }
          }
        }
      });
    });
  }

  
  async listUsers(query) {
    const { name, email, address, role, sortBy = 'name', sortOrder = 'asc' } = query;

    const whereClause = {};
    if (name) whereClause.name = { contains: name, mode: 'insensitive' };
    if (email) whereClause.email = { contains: email, mode: 'insensitive' };
    if (address) whereClause.address = { contains: address, mode: 'insensitive' };
    if (role) whereClause.role = role;

    return await prisma.user.findMany({
      where: whereClause,
      orderBy: { [sortBy]: sortOrder.toLowerCase() === 'desc' ? 'desc' : 'asc' },
      select: { id: true, name: true, email: true, role: true, address: true }
    });
  }

  
  async listStores(query) {
    const { name, email, address, sortBy = 'name', sortOrder = 'asc' } = query;

    const whereClause = {};
    if (name) whereClause.name = { contains: name, mode: 'insensitive' };
    if (email) whereClause.email = { contains: email, mode: 'insensitive' };
    if (address) whereClause.address = { contains: address, mode: 'insensitive' };

    return await prisma.store.findMany({
      where: whereClause,
      orderBy: { [sortBy]: sortOrder.toLowerCase() === 'desc' ? 'desc' : 'asc' },
      include: { owner: { select: { id: true, name: true } } }
    });
  }

  
  async getUserDetail(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, address: true }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    
    if (user.role === 'STORE_OWNER') {
      const store = await prisma.store.findFirst({ where: { ownerId: userId } });
      
      let averageRating = 0;
      if (store) {
        const aggregation = await prisma.rating.aggregate({
          where: { storeId: store.id },
          _avg: { value: true }
        });
        averageRating = aggregation._avg.value || 0;
      }

      return {
        ...user,
        store: store ? { id: store.id, name: store.name, averageRating: parseFloat(averageRating.toFixed(2)) } : null
      };
    }

    return user;
  }
}

module.exports = new AdminService();