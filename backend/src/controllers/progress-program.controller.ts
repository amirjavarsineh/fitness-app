import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';
import { toTehranDateKey, startOfDayTehran, dateKeyToDbDate } from '../lib/dates';
// =====================================================
//              SHAGERD (STUDENT) - Progress
// =====================================================

// ===== گرفتن یا ساختن progress برای یه روز خاص =====
export const getOrCreateProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.userId!;
    const { assignmentId, dayId } = req.params;
    const dateQuery = req.query.date as string | undefined;

    const dateKey = dateQuery
      ? toTehranDateKey(new Date(dateQuery))
      : toTehranDateKey(new Date());
    const dateObj = dateKeyToDbDate(dateKey);

    // چک کن assignment مال این شاگرد هست
    const assignment = await prisma.programAssignment.findFirst({
      where: { id: assignmentId, studentId, status: 'ACTIVE' },
      include: {
        program: {
          include: {
            days: {
              include: {
                exercises: {
                  orderBy: { order: 'asc' },
                },
              },
            },
          },
        },
      },
    });

    if (!assignment) {
      res.status(404).json({ success: false, message: 'برنامه پیدا نشد' });
      return;
    }

    const day = assignment.program.days.find((d) => d.id === dayId);
    if (!day) {
      res.status(404).json({ success: false, message: 'روز پیدا نشد' });
      return;
    }

    // بگرد اگه progress هست
    let progress = await prisma.programProgress.findUnique({
      where: {
        assignmentId_dayId_date: {
          assignmentId,
          dayId,
          date: dateObj,
        },
      },
      include: {
        exercises: {
          orderBy: { order: 'asc' },
        },
      },
    });

    // اگه نبود، بسازش
    if (!progress) {
      progress = await prisma.programProgress.create({
        data: {
          assignmentId,
          studentId,
          dayId,
          date: dateObj,
          status: 'IN_PROGRESS',
          exercises: {
            create: day.exercises.map((ex, idx) => ({
              exerciseId: ex.id,
              completed: false,
              order: idx,
            })),
          },
        },
        include: {
          exercises: {
            orderBy: { order: 'asc' },
          },
        },
      });
    }

    res.json({
      success: true,
      progress: {
        id: progress.id,
        status: progress.status,
        date: progress.date,
        notes: progress.notes,
        completedAt: progress.completedAt,
        day: {
          id: day.id,
          label: day.label,
          notes: day.notes,
        },
        exercises: progress.exercises.map((pe) => {
          const programEx = day.exercises.find((e) => e.id === pe.exerciseId);
          return {
            id: pe.id,
            exerciseId: pe.exerciseId,
            name: programEx?.name ?? '',
            plannedSets: programEx?.sets ?? null,
            plannedReps: programEx?.reps ?? null,
            plannedWeight: programEx?.weight ?? null,
            plannedRestTime: programEx?.restTime ?? null,
            plannedNotes: programEx?.notes ?? null,
            completed: pe.completed,
            actualSets: pe.actualSets,
            actualReps: pe.actualReps,
            actualWeight: pe.actualWeight,
            timeSpent: pe.timeSpent,
            notes: pe.notes,
            order: pe.order,
          };
        }),
      },
    });
  } catch (error) {
    console.error('getOrCreateProgress error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ===== آپدیت یه حرکت توی progress =====
export const updateProgressExercise = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.userId!;
    const { progressId, exerciseId } = req.params;
    const { completed, actualSets, actualReps, actualWeight, timeSpent, notes } = req.body;

    // چک کن progress مال این شاگرد هست
    const progress = await prisma.programProgress.findFirst({
      where: { id: progressId, studentId },
    });

    if (!progress) {
      res.status(404).json({ success: false, message: 'progress پیدا نشد' });
      return;
    }

    // آپدیت
    const pe = await prisma.programProgressExercise.update({
      where: { id: exerciseId },
      data: {
        ...(completed !== undefined && { completed: Boolean(completed) }),
        ...(actualSets !== undefined && { actualSets: actualSets != null ? Number(actualSets) : null }),
        ...(actualReps !== undefined && { actualReps: actualReps != null ? Number(actualReps) : null }),
        ...(actualWeight !== undefined && { actualWeight: actualWeight != null ? Number(actualWeight) : null }),
        ...(timeSpent !== undefined && { timeSpent: timeSpent != null ? Number(timeSpent) : null }),
        ...(notes !== undefined && { notes }),
      },
    });

    // چک کن همه‌ی حرکات انجام شدن
    const allExercises = await prisma.programProgressExercise.findMany({
      where: { progressId },
    });

    const allCompleted = allExercises.every((e) => e.completed);

    // اگه همه انجام شدن و قبلاً نبوده، status رو COMPLETED کن
    if (allCompleted && progress.status !== 'COMPLETED') {
      await prisma.programProgress.update({
        where: { id: progressId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      });
    } else if (!allCompleted && progress.status === 'COMPLETED') {
      await prisma.programProgress.update({
        where: { id: progressId },
        data: {
          status: 'IN_PROGRESS',
          completedAt: null,
        },
      });
    }

    res.json({ success: true, exercise: pe });
  } catch (error) {
    console.error('updateProgressExercise error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ===== آپدیت یه progress (کل روز) =====
export const updateProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.userId!;
    const progressId = req.params.id as string;
    const { status, notes, date } = req.body;

    const progress = await prisma.programProgress.findFirst({
      where: { id: progressId, studentId },
    });

    if (!progress) {
      res.status(404).json({ success: false, message: 'progress پیدا نشد' });
      return;
    }

    // اگه status = COMPLETED، همه‌ی حرکات رو completed کن
    if (status === 'COMPLETED') {
      await prisma.programProgressExercise.updateMany({
        where: { progressId },
        data: { completed: true },
      });
    } else if (status === 'IN_PROGRESS') {
      await prisma.programProgressExercise.updateMany({
        where: { progressId },
        data: { completed: false },
      });
    }

    const updated = await prisma.programProgress.update({
      where: { id: progressId },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
        ...(date && { date: dateKeyToDbDate(toTehranDateKey(new Date(date))) }),
        completedAt: status === 'COMPLETED' ? new Date() : progress.completedAt,
      },
      include: {
        exercises: {
          orderBy: { order: 'asc' },
        },
      },
    });

    res.json({ success: true, progress: updated });
  } catch (error) {
    console.error('updateProgress error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ===== تاریخچه‌ی progress یک شاگرد (برای یه برنامه) =====
export const getMyProgressHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.userId!;
    const { assignmentId } = req.params;

    const progressList = await prisma.programProgress.findMany({
      where: { studentId, assignmentId },
      orderBy: { date: 'desc' },
      include: {
        day: {
          select: { id: true, label: true },
        },
        exercises: {
          orderBy: { order: 'asc' },
        },
      },
    });

    res.json({
      success: true,
      progressList: progressList.map((p) => ({
        id: p.id,
        date: p.date,
        status: p.status,
        completedAt: p.completedAt,
        notes: p.notes,
        day: p.day,
        totalExercises: p.exercises.length,
        completedExercises: p.exercises.filter((e) => e.completed).length,
      })),
    });
  } catch (error) {
    console.error('getMyProgressHistory error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// =====================================================
//              COACH - View Student Progress
// =====================================================

// ===== مربی: چک‌لیست یه شاگرد رو ببینه =====
export const getStudentProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const coachId = req.userId!;
    const studentId = req.params.studentId as string;

    // چک کن شاگرد مال این مربی هست
    const relation = await prisma.coachStudent.findUnique({
      where: {
        coachId_studentId: { coachId, studentId },
      },
    });

    if (!relation || relation.status !== 'ACTIVE') {
      res.status(403).json({ success: false, message: 'این کاربر شاگرد تو نیست' });
      return;
    }

    // همه‌ی program assignments این شاگرد
    const assignments = await prisma.programAssignment.findMany({
      where: { studentId, status: 'ACTIVE' },
      include: {
        program: {
          select: { id: true, name: true, type: true },
        },
        progresses: {
          where: {
            OR: [
              { status: 'COMPLETED' },
              { exercises: { some: { completed: true } } },
            ],
          },
          orderBy: { date: 'desc' },
          take: 30,
          include: {
            day: {
              select: { id: true, label: true },
            },
            exercises: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    // فقط رکوردهایی که واقعاً انجام شدن (یا حداقل یه حرکت تیک خورده)
    const totalProgress = await prisma.programProgress.findMany({
      where: {
        studentId,
        OR: [
          { status: 'COMPLETED' },
          { exercises: { some: { completed: true } } },
        ],
      },
      select: { status: true, date: true },
    });

    const completed = totalProgress.filter((p) => p.status === 'COMPLETED').length;
    const total = totalProgress.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // روند هفته‌ی اخیر (۷ روز) - بر اساس وقت تهران
    const todayKey = toTehranDateKey(new Date());
    const todayStart = new Date(`${todayKey}T00:00:00Z`);
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 6);

    const recentProgress = totalProgress.filter(
      (p) => new Date(p.date).getTime() >= weekStart.getTime()
    );

    const weeklyTrend: { date: string; completed: number; total: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(todayStart);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const dayProgress = recentProgress.filter(
        (p) => new Date(p.date).toISOString().slice(0, 10) === key
      );
      weeklyTrend.push({
        date: key,
        completed: dayProgress.filter((p) => p.status === 'COMPLETED').length,
        total: dayProgress.length,
      });
    }
    res.json({
      success: true,
      studentId,
      stats: {
        totalSessions: total,
        completedSessions: completed,
        completionRate,
        weeklyTrend,
      },
      assignments: assignments.map((a) => ({
        assignmentId: a.id,
        program: a.program,
        startDate: a.startDate,
        recentProgress: a.progresses.map((p) => ({
          id: p.id,
          date: p.date,
          status: p.status,
          completedAt: p.completedAt,
          notes: p.notes,
          day: p.day,
          totalExercises: p.exercises.length,
          completedExercises: p.exercises.filter((e) => e.completed).length,
          exercises: p.exercises.map((pe) => ({
            id: pe.id,
            completed: pe.completed,
            actualSets: pe.actualSets,
            actualReps: pe.actualReps,
            actualWeight: pe.actualWeight,
            timeSpent: pe.timeSpent,
            notes: pe.notes,
          })),
        })),
      })),
    });
  } catch (error) {
    console.error('getStudentProgress error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ===== مربی: دیدن جزئیات یه progress خاص =====
export const getProgressDetail = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const coachId = req.userId!;
    const progressId = req.params.progressId as string;

    const progress = await prisma.programProgress.findUnique({
      where: { id: progressId },
      include: {
        student: {
          select: { id: true, name: true, email: true },
        },
        day: {
          include: {
            program: {
              select: { id: true, name: true, coachId: true },
            },
            exercises: {
              orderBy: { order: 'asc' },
            },
          },
        },
        exercises: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!progress) {
      res.status(404).json({ success: false, message: 'progress پیدا نشد' });
      return;
    }

    // چک کن مربی این برنامه هست
    if (progress.day.program.coachId !== coachId) {
      res.status(403).json({ success: false, message: 'دسترسی نداری' });
      return;
    }

    res.json({
      success: true,
      progress: {
        id: progress.id,
        date: progress.date,
        status: progress.status,
        completedAt: progress.completedAt,
        notes: progress.notes,
        student: progress.student,
        program: {
          id: progress.day.program.id,
          name: progress.day.program.name,
        },
        day: {
          id: progress.day.id,
          label: progress.day.label,
        },
        exercises: progress.exercises.map((pe) => {
          const programEx = progress.day.exercises.find(
            (e) => e.id === pe.exerciseId
          );
          return {
            id: pe.id,
            name: programEx?.name ?? '',
            plannedSets: programEx?.sets ?? null,
            plannedReps: programEx?.reps ?? null,
            plannedWeight: programEx?.weight ?? null,
            plannedRestTime: programEx?.restTime ?? null,
            plannedNotes: programEx?.notes ?? null,
            completed: pe.completed,
            actualSets: pe.actualSets,
            actualReps: pe.actualReps,
            actualWeight: pe.actualWeight,
            timeSpent: pe.timeSpent,
            notes: pe.notes,
          };
        }),
      },
    });
  } catch (error) {
    console.error('getProgressDetail error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ===== شاگرد: خلاصه‌ی پیشرفت خودش =====
export const getMyProgressSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.userId!;

    const allProgress = await prisma.programProgress.findMany({
      where: {
        studentId,
        OR: [
          { status: 'COMPLETED' },
          { exercises: { some: { completed: true } } },
        ],
      },
      orderBy: { date: 'desc' },
      take: 60,
      include: {
        day: {
          select: { id: true, label: true },
        },
        exercises: {
          orderBy: { order: 'asc' },
        },
      },
    });

    const completed = allProgress.filter((p) => p.status === 'COMPLETED').length;
    const total = allProgress.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // روند هفته‌ی اخیر - بر اساس وقت تهران
    const todayKey = toTehranDateKey(new Date());
    const todayStart = new Date(`${todayKey}T00:00:00Z`);
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 6);

    const weeklyTrend: { date: string; completed: number; total: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(todayStart);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const dayProgress = allProgress.filter(
        (p) => new Date(p.date).toISOString().slice(0, 10) === key
      );
      weeklyTrend.push({
        date: key,
        completed: dayProgress.filter((p) => p.status === 'COMPLETED').length,
        total: dayProgress.length,
      });
    }

    res.json({
      success: true,
      stats: {
        totalSessions: total,
        completedSessions: completed,
        completionRate,
        weeklyTrend,
      },
      recent: allProgress.slice(0, 10).map((p) => ({
        id: p.id,
        date: p.date,
        status: p.status,
        completedAt: p.completedAt,
        notes: p.notes,
        day: p.day,
        totalExercises: p.exercises.length,
        completedExercises: p.exercises.filter((e) => e.completed).length,
      })),
    });
  } catch (error) {
    console.error('getMyProgressSummary error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};