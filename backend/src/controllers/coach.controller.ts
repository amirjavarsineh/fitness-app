import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

// ساخت کد یکتا برای مربی
function generateCoachCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'FIT-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// ===== فعال‌سازی حالت مربی =====
export const activateCoach = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { displayName, bio, specialty } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    // اگه قبلاً مربی بود، فقط پروفایلش رو آپدیت کن
    if (user.isCoach && user.coachCode) {
      await prisma.coachProfile.upsert({
        where: { userId },
        update: {
          ...(displayName !== undefined && { displayName }),
          ...(bio !== undefined && { bio }),
          ...(specialty !== undefined && { specialty }),
        },
        create: {
          userId,
          displayName: displayName ?? null,
          bio: bio ?? null,
          specialty: specialty ?? null,
        },
      });

      res.json({ success: true, coachCode: user.coachCode, alreadyCoach: true });
      return;
    }

    // ساخت کد یکتا
    let code = generateCoachCode();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await prisma.user.findUnique({ where: { coachCode: code } });
      if (!existing) break;
      code = generateCoachCode();
      attempts++;
    }

    // آپدیت کاربر + ساخت پروفایل مربی
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { isCoach: true, coachCode: code },
      }),
      prisma.coachProfile.upsert({
        where: { userId },
        update: {
          ...(displayName !== undefined && { displayName }),
          ...(bio !== undefined && { bio }),
          ...(specialty !== undefined && { specialty }),
        },
        create: {
          userId,
          displayName: displayName ?? null,
          bio: bio ?? null,
          specialty: specialty ?? null,
        },
      }),
    ]);

    res.json({ success: true, coachCode: code });
  } catch (error) {
    console.error('activateCoach error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ===== گرفتن اطلاعات مربی (کد + شاگردها) =====
export const getCoachInfo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        isCoach: true,
        coachCode: true,
        coachProfile: true,
      },
    });

    if (!user || !user.isCoach || !user.coachCode) {
      res.json({ success: true, isCoach: false });
      return;
    }

    const students = await prisma.coachStudent.findMany({
      where: { coachId: userId, status: 'ACTIVE' },
      include: {
        student: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { joinedAt: 'desc' },
    });

    res.json({
      success: true,
      isCoach: true,
      coachCode: user.coachCode,
      coachProfile: user.coachProfile,
      students: students.map((s) => ({
        id: s.id,
        studentId: s.student.id,
        name: s.student.name,
        email: s.student.email,
        joinedAt: s.joinedAt,
      })),
    });
  } catch (error) {
    console.error('getCoachInfo error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ===== ساخت کد جدید (کد قبلی باطل می‌شه) =====
export const regenerateCoachCode = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.isCoach) {
      res.status(400).json({ success: false, message: 'You are not a coach' });
      return;
    }

    let code = generateCoachCode();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await prisma.user.findUnique({ where: { coachCode: code } });
      if (!existing) break;
      code = generateCoachCode();
      attempts++;
    }

    await prisma.user.update({
      where: { id: userId },
      data: { coachCode: code },
    });

    res.json({ success: true, coachCode: code });
  } catch (error) {
    console.error('regenerateCoachCode error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ===== عضویت با کد مربی (شاگرد) =====
export const joinWithCode = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { code } = req.body;

    if (!code || typeof code !== 'string') {
      res.status(400).json({ success: false, message: 'کد مربی الزامی است' });
      return;
    }

    const normalizedCode = code.trim().toUpperCase();

    const coach = await prisma.user.findUnique({
      where: { coachCode: normalizedCode },
      select: { id: true, name: true, isCoach: true },
    });

    if (!coach || !coach.isCoach) {
      res.status(404).json({ success: false, message: 'کد مربی معتبر نیست' });
      return;
    }

    if (coach.id === userId) {
      res.status(400).json({ success: false, message: 'نمی‌تونی خودت رو به عنوان شاگرد اضافه کنی' });
      return;
    }

    const existing = await prisma.coachStudent.findUnique({
      where: {
        coachId_studentId: { coachId: coach.id, studentId: userId },
      },
    });

    if (existing) {
      if (existing.status === 'ACTIVE') {
        res.status(400).json({ success: false, message: 'قبلاً به این مربی وصل شدی' });
        return;
      }
      const reactivated = await prisma.coachStudent.update({
        where: { id: existing.id },
        data: { status: 'ACTIVE' },
      });
      res.json({ success: true, coachStudent: reactivated, coach: { name: coach.name } });
      return;
    }

    const coachStudent = await prisma.coachStudent.create({
      data: {
        coachId: coach.id,
        studentId: userId,
        status: 'ACTIVE',
      },
    });

    res.status(201).json({
      success: true,
      coachStudent,
      coach: { name: coach.name },
    });
  } catch (error) {
    console.error('joinWithCode error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ===== حذف شاگرد (توسط مربی) =====
export const disconnectStudent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const coachId = req.userId!;
    const studentId = req.params.studentId as string;

    const relation = await prisma.coachStudent.findUnique({
      where: {
        coachId_studentId: { coachId, studentId },
      },
    });

    if (!relation) {
      res.status(404).json({ success: false, message: 'شاگرد پیدا نشد' });
      return;
    }

    await prisma.coachStudent.update({
      where: { id: relation.id },
      data: { status: 'INACTIVE' },
    });

    res.json({ success: true, message: 'شاگرد حذف شد' });
  } catch (error) {
    console.error('disconnectStudent error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ===== گرفتن لیست مربی‌های یک شاگرد =====
export const getMyCoaches = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const relations = await prisma.coachStudent.findMany({
      where: { studentId: userId, status: 'ACTIVE' },
      include: {
        coach: {
          select: { id: true, name: true, email: true, coachProfile: true },
        },
      },
      orderBy: { joinedAt: 'desc' },
    });

    res.json({
      success: true,
      coaches: relations.map((r) => ({
        id: r.id,
        coachId: r.coach.id,
        name: r.coach.name,
        email: r.coach.email,
        profile: r.coach.coachProfile,
        joinedAt: r.joinedAt,
      })),
    });
  } catch (error) {
    console.error('getMyCoaches error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ===== قطع ارتباط با مربی (توسط شاگرد) =====
export const disconnectFromCoach = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.userId!;
    const coachId = req.params.coachId as string;

    const relation = await prisma.coachStudent.findUnique({
      where: {
        coachId_studentId: { coachId, studentId },
      },
    });

    if (!relation) {
      res.status(404).json({ success: false, message: 'ارتباط پیدا نشد' });
      return;
    }

    await prisma.coachStudent.update({
      where: { id: relation.id },
      data: { status: 'INACTIVE' },
    });

    res.json({ success: true, message: 'ارتباط قطع شد' });
  } catch (error) {
    console.error('disconnectFromCoach error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};