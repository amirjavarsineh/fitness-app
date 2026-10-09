import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

// گرفتن لیست غذاها با فیلتر و جستجو
export const getFoods = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { search, brand } = req.query;

    const where: {
      brand?: string;
      OR?: Array<{
        name?: { contains: string; mode: 'insensitive' };
        nameFa?: { contains: string };
      }>;
    } = {};

    if (brand && typeof brand === 'string') {
      where.brand = brand;
    }

    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameFa: { contains: search } },
      ];
    }

    const foods = await prisma.foodItem.findMany({
      where,
      orderBy: [{ nameFa: 'asc' }],
    });

    res.json({ success: true, foods });
  } catch (error) {
    console.error('getFoods error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// گرفتن یه غذا
export const getFoodById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const food = await prisma.foodItem.findUnique({
      where: { id: req.params.id as string },
    });

    if (!food) {
      res.status(404).json({ success: false, message: 'Food not found' });
      return;
    }

    res.json({ success: true, food });
  } catch (error) {
    console.error('getFoodById error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// گرفتن لیست برندها (برای فیلتر)
export const getBrands = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const brands = await prisma.foodItem.findMany({
      select: { brand: true },
      distinct: ['brand'],
    });

    res.json({
      success: true,
      brands: brands
        .map((b) => b.brand)
        .filter((b): b is string => b !== null),
    });
  } catch (error) {
    console.error('getBrands error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};