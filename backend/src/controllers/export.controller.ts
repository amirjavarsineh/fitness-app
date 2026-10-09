import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

// هدرهای CSV برای Excel (با BOM برای پشتیبانی از فارسی)
const CSV_HEADER = '\uFEFF';

// تبدیل آرایه به رشته CSV
function toCSV(headers: string[], rows: (string | number | null)[][]): string {
  const escape = (v: string | number | null) => {
    if (v === null || v === undefined) return '';
    const s = String(v);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const headerLine = headers.map(escape).join(',');
  const lines = rows.map((row) => row.map(escape).join(','));
  return CSV_HEADER + [headerLine, ...lines].join('\r\n');
}

function formatDate(d: Date): string {
  return new Date(d).toLocaleDateString('fa-IR');
}

// ===== Export Workouts =====
export const exportWorkouts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const workouts = await prisma.workout.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        exercises: { orderBy: { order: 'asc' } },
      },
    });

    const headers = [
      'تاریخ',
      'نام تمرین',
      'نوع',
      'مدت (دقیقه)',
      'کالری سوزانده',
      'تعداد حرکات',
      'حرکات',
      'توضیحات',
    ];

    const rows = workouts.map((w) => [
      formatDate(w.createdAt),
      w.name ?? 'بدون نام',
      w.type,
      w.duration,
      w.caloriesBurned ?? '',
      w.exercises.length,
      w.exercises.map((e) => e.name).join(' | '),
      w.description ?? '',
    ]);

    const csv = toCSV(headers, rows);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="workouts-${Date.now()}.csv"`
    );
    res.send(csv);
  } catch (error) {
    console.error('exportWorkouts error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ===== Export Nutrition =====
export const exportNutrition = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const logs = await prisma.nutritionLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const headers = [
      'تاریخ',
      'نام غذا',
      'وعده',
      'کالری',
      'پروتئین (g)',
      'کربوهیدرات (g)',
      'چربی (g)',
    ];

    const MEAL_LABELS: Record<string, string> = {
      BREAKFAST: 'صبحانه',
      LUNCH: 'ناهار',
      DINNER: 'شام',
      SNACK: 'میان‌وعده',
    };

    const rows = logs.map((log) => [
      formatDate(log.createdAt),
      log.foodName,
      MEAL_LABELS[log.mealType] ?? log.mealType,
      log.calories,
      log.protein ?? '',
      log.carbs ?? '',
      log.fat ?? '',
    ]);

    const csv = toCSV(headers, rows);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="nutrition-${Date.now()}.csv"`
    );
    res.send(csv);
  } catch (error) {
    console.error('exportNutrition error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ===== Export Weight =====
export const exportWeight = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const logs = await prisma.weightLog.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    const headers = ['تاریخ', 'وزن (kg)', 'یادداشت'];

    const rows = logs.map((log) => [
      formatDate(log.date),
      log.weight,
      log.note ?? '',
    ]);

    const csv = toCSV(headers, rows);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="weight-${Date.now()}.csv"`
    );
    res.send(csv);
  } catch (error) {
    console.error('exportWeight error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ===== Export Water =====
export const exportWater = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const logs = await prisma.waterLog.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    const headers = ['تاریخ', 'مقدار (ml)'];

    const rows = logs.map((log) => [formatDate(log.date), log.amount]);

    const csv = toCSV(headers, rows);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="water-${Date.now()}.csv"`
    );
    res.send(csv);
  } catch (error) {
    console.error('exportWater error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ===== Export Goals =====
export const exportGoals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const goals = await prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const headers = [
      'تاریخ ایجاد',
      'عنوان',
      'دسته',
      'مقدار هدف',
      'مقدار فعلی',
      'درصد پیشرفت',
      'وضعیت',
      'مهلت',
      'توضیحات',
    ];

    const STATUS_LABELS: Record<string, string> = {
      ACTIVE: 'فعال',
      COMPLETED: 'تکمیل‌شده',
      CANCELLED: 'لغو‌شده',
    };

    const rows = goals.map((g) => {
      const percent =
        g.targetValue > 0
          ? Math.min(100, Math.round((g.currentValue / g.targetValue) * 100))
          : 0;
      return [
        formatDate(g.createdAt),
        g.title,
        g.goalType,
        g.targetValue,
        g.currentValue,
        `${percent}%`,
        STATUS_LABELS[g.status] ?? g.status,
        g.deadline ? formatDate(g.deadline) : '',
        g.description ?? '',
      ];
    });

    const csv = toCSV(headers, rows);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="goals-${Date.now()}.csv"`
    );
    res.send(csv);
  } catch (error) {
    console.error('exportGoals error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};