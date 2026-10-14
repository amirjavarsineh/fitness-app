import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

// =====================================================
//              PROGRAM MANAGEMENT (مربی)
// =====================================================

// ===== گرفتن همه‌ی برنامه‌های مربی =====
export const getMyPrograms = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const coachId = req.userId!;

    const programs = await prisma.program.findMany({
      where: { coachId },
      include: {
        _count: {
          select: {
            days: true,
            assignments: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({
      success: true,
      programs: programs.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        type: p.type,
        durationWeeks: p.durationWeeks,
        daysCount: p._count.days,
        assignmentsCount: p._count.assignments,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })),
    });
  } catch (error) {
    console.error('getMyPrograms error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ===== گرفتن یک برنامه با تمام جزئیات =====
export const getProgramById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const programId = req.params.id as string;

    const program = await prisma.program.findUnique({
      where: { id: programId },
      include: {
        days: {
          orderBy: { order: 'asc' },
          include: {
            exercises: {
              orderBy: { order: 'asc' },
            },
          },
        },
        assignments: {
          where: { status: 'ACTIVE' },
          include: {
            student: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!program) {
      res.status(404).json({ success: false, message: 'برنامه پیدا نشد' });
      return;
    }

    // چک کن کاربر مالک برنامه هست یا شاگردی که برنامه بهش داده شده
    const isOwner = program.coachId === userId;
    const isAssignedStudent = program.assignments.some((a) => a.studentId === userId);

    if (!isOwner && !isAssignedStudent) {
      res.status(403).json({ success: false, message: 'دسترسی نداری' });
      return;
    }

    res.json({
      success: true,
      program: {
        id: program.id,
        name: program.name,
        description: program.description,
        type: program.type,
        durationWeeks: program.durationWeeks,
        coachId: program.coachId,
        createdAt: program.createdAt,
        updatedAt: program.updatedAt,
        isOwner,
        days: program.days.map((d) => ({
          id: d.id,
          dayNumber: d.dayNumber,
          label: d.label,
          notes: d.notes,
          order: d.order,
          exercises: d.exercises.map((e) => ({
            id: e.id,
            name: e.name,
            sets: e.sets,
            reps: e.reps,
            weight: e.weight,
            restTime: e.restTime,
            notes: e.notes,
            order: e.order,
          })),
        })),
        assignedStudents: program.assignments.map((a) => ({
          assignmentId: a.id,
          studentId: a.student.id,
          name: a.student.name,
          email: a.student.email,
          startDate: a.startDate,
        })),
      },
    });
  } catch (error) {
    console.error('getProgramById error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ===== ساخت برنامه‌ی جدید =====
interface ExerciseInput {
  name: string;
  sets?: number | null;
  reps?: number | null;
  weight?: number | null;
  restTime?: number | null;
  notes?: string | null;
  order?: number;
}

interface DayInput {
  dayNumber: number;
  label: string;
  notes?: string | null;
  order?: number;
  exercises?: ExerciseInput[];
}

export const createProgram = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const coachId = req.userId!;
    const { name, description, type, durationWeeks, days } = req.body;

    // چک کن مربی هست
    const user = await prisma.user.findUnique({ where: { id: coachId } });
    if (!user || !user.isCoach) {
      res.status(403).json({ success: false, message: 'فقط مربی‌ها می‌تونن برنامه بسازن' });
      return;
    }

    if (!name || typeof name !== 'string' || !name.trim()) {
      res.status(400).json({ success: false, message: 'نام برنامه الزامی است' });
      return;
    }

    const programType = type === 'DAILY' || type === 'PERIODIC' ? type : 'WEEKLY';

    // ساخت برنامه با روزها و حرکات
    const program = await prisma.program.create({
      data: {
        coachId,
        name: name.trim(),
        description: description ?? null,
        type: programType,
        durationWeeks: durationWeeks ? Number(durationWeeks) : null,
        days: Array.isArray(days)
          ? {
              create: days.map((day: DayInput, dIdx: number) => ({
                dayNumber: Number(day.dayNumber) ?? dIdx + 1,
                label: day.label ?? `روز ${dIdx + 1}`,
                notes: day.notes ?? null,
                order: day.order ?? dIdx,
                exercises: Array.isArray(day.exercises)
                  ? {
                      create: day.exercises.map((ex: ExerciseInput, eIdx: number) => ({
                        name: ex.name,
                        sets: ex.sets != null ? Number(ex.sets) : null,
                        reps: ex.reps != null ? Number(ex.reps) : null,
                        weight: ex.weight != null ? Number(ex.weight) : null,
                        restTime: ex.restTime != null ? Number(ex.restTime) : null,
                        notes: ex.notes ?? null,
                        order: ex.order ?? eIdx,
                      })),
                    }
                  : undefined,
              })),
            }
          : undefined,
      },
      include: {
        days: {
          orderBy: { order: 'asc' },
          include: {
            exercises: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    res.status(201).json({ success: true, program });
  } catch (error) {
    console.error('createProgram error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ===== ویرایش برنامه (هوشمندانه - حفظ تاریخچه‌ی شاگرد) =====
export const updateProgram = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const coachId = req.userId!;
    const programId = req.params.id as string;
    const { name, description, type, durationWeeks, days } = req.body;

    const existing = await prisma.program.findFirst({
      where: { id: programId, coachId },
    });

    if (!existing) {
      res.status(404).json({ success: false, message: 'برنامه پیدا نشد' });
      return;
    }

    const programType =
      type === 'DAILY' || type === 'PERIODIC' || type === 'WEEKLY'
        ? type
        : existing.type;

    await prisma.$transaction(async (tx) => {
      // ===== ۱. آپدیت اطلاعات پایه =====
      await tx.program.update({
        where: { id: programId },
        data: {
          ...(name !== undefined && { name: name.trim() }),
          ...(description !== undefined && { description }),
          type: programType,
          ...(durationWeeks !== undefined && {
            durationWeeks: durationWeeks ? Number(durationWeeks) : null,
          }),
        },
      });

      // ===== ۲. آپدیت هوشمندانه‌ی روزها =====
      if (Array.isArray(days)) {
        const existingDays = await tx.programDay.findMany({
          where: { programId },
          include: { exercises: { orderBy: { order: 'asc' } } },
          orderBy: { order: 'asc' },
        });

        // برای هر روز جدید (به ترتیب موقعیت)
        for (let i = 0; i < days.length; i++) {
          const day = days[i];
          const existingDay = existingDays[i];

          if (existingDay) {
            // ===== آپدیت روز موجود (ID حفظ می‌شه) =====
            await tx.programDay.update({
              where: { id: existingDay.id },
              data: {
                dayNumber: Number(day.dayNumber) ?? i + 1,
                label: day.label ?? `روز ${i + 1}`,
                notes: day.notes ?? null,
                order: i,
              },
            });

            // آپدیت حرکات این روز
            const incomingExercises = Array.isArray(day.exercises)
              ? day.exercises
              : [];
            const existingExs = existingDay.exercises;

            for (let j = 0; j < incomingExercises.length; j++) {
              const ex = incomingExercises[j];
              const existingEx = existingExs[j];

              const exData = {
                name: ex.name,
                sets: ex.sets != null ? Number(ex.sets) : null,
                reps: ex.reps != null ? Number(ex.reps) : null,
                weight: ex.weight != null ? Number(ex.weight) : null,
                restTime: ex.restTime != null ? Number(ex.restTime) : null,
                notes: ex.notes ?? null,
                order: j,
              };

              if (existingEx) {
                // آپدیت (ID حفظ می‌شه → تاریخچه‌ی شاگرد نمی‌پره)
                await tx.programExercise.update({
                  where: { id: existingEx.id },
                  data: exData,
                });
              } else {
                // حرکت جدید
                await tx.programExercise.create({
                  data: { dayId: existingDay.id, ...exData },
                });
              }
            }

            // حذف حرکاتی که کاربر پاک کرده
            const extras = existingExs.slice(incomingExercises.length);
            if (extras.length > 0) {
              await tx.programExercise.deleteMany({
                where: { id: { in: extras.map((e) => e.id) } },
              });
            }
          } else {
            // ===== ساخت روز جدید =====
            await tx.programDay.create({
              data: {
                programId,
                dayNumber: Number(day.dayNumber) ?? i + 1,
                label: day.label ?? `روز ${i + 1}`,
                notes: day.notes ?? null,
                order: i,
                exercises: {
                  create: (day.exercises ?? []).map(
                    (ex: ExerciseInput, j: number) => ({
                      name: ex.name,
                      sets: ex.sets != null ? Number(ex.sets) : null,
                      reps: ex.reps != null ? Number(ex.reps) : null,
                      weight: ex.weight != null ? Number(ex.weight) : null,
                      restTime: ex.restTime != null ? Number(ex.restTime) : null,
                      notes: ex.notes ?? null,
                      order: j,
                    })
                  ),
                },
              },
            });
          }
        }

        // حذف روزهایی که کاربر پاک کرده
        const extraDays = existingDays.slice(days.length);
        if (extraDays.length > 0) {
          await tx.programDay.deleteMany({
            where: { id: { in: extraDays.map((d) => d.id) } },
          });
        }
      }
    });

    const updated = await prisma.program.findUnique({
      where: { id: programId },
      include: {
        days: {
          orderBy: { order: 'asc' },
          include: {
            exercises: { orderBy: { order: 'asc' } },
          },
        },
      },
    });

    res.json({ success: true, program: updated });
  } catch (error) {
    console.error('updateProgram error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ===== حذف برنامه =====
export const deleteProgram = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const coachId = req.userId!;
    const programId = req.params.id as string;

    const existing = await prisma.program.findFirst({
      where: { id: programId, coachId },
    });

    if (!existing) {
      res.status(404).json({ success: false, message: 'برنامه پیدا نشد' });
      return;
    }

    await prisma.program.delete({ where: { id: programId } });

    res.json({ success: true, message: 'برنامه حذف شد' });
  } catch (error) {
    console.error('deleteProgram error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// =====================================================
//              ASSIGNMENT (اتصال به شاگرد)
// =====================================================

// ===== دادن برنامه به شاگرد =====
export const assignProgram = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const coachId = req.userId!;
    const programId = req.params.id as string;
    const { studentId } = req.body;

    if (!studentId) {
      res.status(400).json({ success: false, message: 'شناسه شاگرد الزامی است' });
      return;
    }

    // چک کن برنامه مال مربی هست
    const program = await prisma.program.findFirst({
      where: { id: programId, coachId },
    });

    if (!program) {
      res.status(404).json({ success: false, message: 'برنامه پیدا نشد' });
      return;
    }

    // چک کن شاگرد به مربی وصل هست
    const relation = await prisma.coachStudent.findUnique({
      where: {
        coachId_studentId: { coachId, studentId },
      },
    });

    if (!relation || relation.status !== 'ACTIVE') {
      res.status(400).json({ success: false, message: 'این کاربر شاگرد تو نیست' });
      return;
    }

    // چک کن قبلاً به این شاگرد داده نشده
    const existing = await prisma.programAssignment.findFirst({
      where: { programId, studentId, status: 'ACTIVE' },
    });

    if (existing) {
      res.status(400).json({ success: false, message: 'این برنامه قبلاً به این شاگرد داده شده' });
      return;
    }

    const assignment = await prisma.programAssignment.create({
      data: {
        programId,
        studentId,
        coachId,
        status: 'ACTIVE',
      },
    });

    res.status(201).json({ success: true, assignment });
  } catch (error) {
    console.error('assignProgram error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ===== پس گرفتن برنامه از شاگرد =====
export const unassignProgram = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const coachId = req.userId!;
    const assignmentId = req.params.assignmentId as string;

    const assignment = await prisma.programAssignment.findFirst({
      where: { id: assignmentId, coachId },
    });

    if (!assignment) {
      res.status(404).json({ success: false, message: 'اتصال پیدا نشد' });
      return;
    }

    await prisma.programAssignment.update({
      where: { id: assignmentId },
      data: { status: 'INACTIVE' },
    });

    res.json({ success: true, message: 'برنامه پس گرفته شد' });
  } catch (error) {
    console.error('unassignProgram error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// =====================================================
//              STUDENT VIEW (شاگرد)
// =====================================================

// ===== گرفتن برنامه‌های یک شاگرد =====
export const getMyAssignedPrograms = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.userId!;

    const assignments = await prisma.programAssignment.findMany({
      where: { studentId, status: 'ACTIVE' },
      include: {
        program: {
          include: {
            days: {
              orderBy: { order: 'asc' },
              include: {
                exercises: {
                  orderBy: { order: 'asc' },
                },
              },
            },
            coach: {
              select: { id: true, name: true },
            },
          },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    res.json({
      success: true,
      assignments: assignments.map((a) => ({
        assignmentId: a.id,
        startDate: a.startDate,
        program: {
          id: a.program.id,
          name: a.program.name,
          description: a.program.description,
          type: a.program.type,
          durationWeeks: a.program.durationWeeks,
          coach: a.program.coach,
          days: a.program.days.map((d) => ({
            id: d.id,
            dayNumber: d.dayNumber,
            label: d.label,
            notes: d.notes,
            order: d.order,
            exercises: d.exercises.map((e) => ({
              id: e.id,
              name: e.name,
              sets: e.sets,
              reps: e.reps,
              weight: e.weight,
              restTime: e.restTime,
              notes: e.notes,
              order: e.order,
            })),
          })),
        },
      })),
    });
  } catch (error) {
    console.error('getMyAssignedPrograms error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};