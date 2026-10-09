import { PrismaClient, WorkoutType } from '@prisma/client';

const prisma = new PrismaClient();

interface ExerciseSeed {
  name: string;
  nameFa: string;
  category: WorkoutType;
  metValue: number;
  muscleGroup: string;
  description?: string;
}

const exercises: ExerciseSeed[] = [
  // ============ CARDIO ============
  { name: 'Running', nameFa: 'دویدن', category: 'CARDIO', metValue: 9.8, muscleGroup: 'FULL_BODY', description: 'دویدن با سرعت متوسط' },
  { name: 'Walking', nameFa: 'پیاده‌روی', category: 'CARDIO', metValue: 3.5, muscleGroup: 'FULL_BODY', description: 'پیاده‌روی معمولی' },
  { name: 'Cycling', nameFa: 'دوچرخه‌سواری', category: 'CARDIO', metValue: 7.5, muscleGroup: 'LEGS', description: 'دوچرخه‌سواری با سرعت متوسط' },
  { name: 'Swimming', nameFa: 'شنا', category: 'CARDIO', metValue: 8.3, muscleGroup: 'FULL_BODY', description: 'شنای آزاد' },
  { name: 'Jump Rope', nameFa: 'طناب زدن', category: 'CARDIO', metValue: 12.3, muscleGroup: 'FULL_BODY', description: 'طناب زدن با سرعت متوسط' },
  { name: 'Rowing Machine', nameFa: 'دستگاه روئینگ', category: 'CARDIO', metValue: 8.5, muscleGroup: 'FULL_BODY' },
  { name: 'Stair Climbing', nameFa: 'بالا رفتن از پله', category: 'CARDIO', metValue: 8.8, muscleGroup: 'LEGS' },
  { name: 'Elliptical', nameFa: 'دستگاه الپتیکال', category: 'CARDIO', metValue: 5.0, muscleGroup: 'FULL_BODY' },
  { name: 'Treadmill Incline', nameFa: 'تردمیل شیب‌دار', category: 'CARDIO', metValue: 8.0, muscleGroup: 'LEGS' },
  { name: 'Dancing', nameFa: 'رقص', category: 'CARDIO', metValue: 6.5, muscleGroup: 'FULL_BODY' },

  // ============ CHEST ============
  { name: 'Bench Press', nameFa: 'پرس سینه', category: 'STRENGTH', metValue: 6.0, muscleGroup: 'CHEST', description: 'پرس سینه با هالتر' },
  { name: 'Incline Bench Press', nameFa: 'پرس سینه شیب‌دار', category: 'STRENGTH', metValue: 6.0, muscleGroup: 'CHEST' },
  { name: 'Push Up', nameFa: 'شنا سوئدی', category: 'STRENGTH', metValue: 8.0, muscleGroup: 'CHEST' },
  { name: 'Dumbbell Fly', nameFa: 'فلای دمبل', category: 'STRENGTH', metValue: 5.0, muscleGroup: 'CHEST' },
  { name: 'Cable Crossover', nameFa: 'کراس‌اُور سیم‌کش', category: 'STRENGTH', metValue: 5.0, muscleGroup: 'CHEST' },
  { name: 'Dips', nameFa: 'پارالل', category: 'STRENGTH', metValue: 7.5, muscleGroup: 'CHEST' },

  // ============ BACK ============
  { name: 'Deadlift', nameFa: 'ددلیفت', category: 'STRENGTH', metValue: 6.0, muscleGroup: 'BACK', description: 'حرکت پایه برای پشت و پا' },
  { name: 'Pull Up', nameFa: 'بارفیکس', category: 'STRENGTH', metValue: 8.0, muscleGroup: 'BACK' },
  { name: 'Lat Pulldown', nameFa: 'زیربغل سیم‌کش', category: 'STRENGTH', metValue: 5.0, muscleGroup: 'BACK' },
  { name: 'Barbell Row', nameFa: 'قایقی هالتر', category: 'STRENGTH', metValue: 6.0, muscleGroup: 'BACK' },
  { name: 'Dumbbell Row', nameFa: 'قایقی دمبل', category: 'STRENGTH', metValue: 5.5, muscleGroup: 'BACK' },
  { name: 'Seated Cable Row', nameFa: 'قایقی نشسته سیم‌کش', category: 'STRENGTH', metValue: 5.0, muscleGroup: 'BACK' },

  // ============ LEGS ============
  { name: 'Squat', nameFa: 'اسکوات', category: 'STRENGTH', metValue: 6.0, muscleGroup: 'LEGS', description: 'حرکت پایه برای پا' },
  { name: 'Front Squat', nameFa: 'اسکوات جلو', category: 'STRENGTH', metValue: 6.0, muscleGroup: 'LEGS' },
  { name: 'Leg Press', nameFa: 'پرس پا', category: 'STRENGTH', metValue: 5.0, muscleGroup: 'LEGS' },
  { name: 'Lunges', nameFa: 'لانگز', category: 'STRENGTH', metValue: 5.0, muscleGroup: 'LEGS' },
  { name: 'Leg Extension', nameFa: 'جلو پا دستگاه', category: 'STRENGTH', metValue: 4.0, muscleGroup: 'LEGS' },
  { name: 'Leg Curl', nameFa: 'پشت پا دستگاه', category: 'STRENGTH', metValue: 4.0, muscleGroup: 'LEGS' },
  { name: 'Calf Raise', nameFa: 'ساق پا', category: 'STRENGTH', metValue: 4.0, muscleGroup: 'LEGS' },
  { name: 'Romanian Deadlift', nameFa: 'ددلیفت رومانیایی', category: 'STRENGTH', metValue: 6.0, muscleGroup: 'LEGS' },
  { name: 'Hip Thrust', nameFa: 'هیپ تراست', category: 'STRENGTH', metValue: 5.0, muscleGroup: 'LEGS' },

  // ============ SHOULDERS ============
  { name: 'Overhead Press', nameFa: 'پرس سرشانه هالتر', category: 'STRENGTH', metValue: 6.0, muscleGroup: 'SHOULDERS' },
  { name: 'Dumbbell Shoulder Press', nameFa: 'پرس سرشانه دمبل', category: 'STRENGTH', metValue: 5.5, muscleGroup: 'SHOULDERS' },
  { name: 'Lateral Raise', nameFa: 'نشر از جانب', category: 'STRENGTH', metValue: 4.5, muscleGroup: 'SHOULDERS' },
  { name: 'Front Raise', nameFa: 'نشر از جلو', category: 'STRENGTH', metValue: 4.5, muscleGroup: 'SHOULDERS' },
  { name: 'Rear Delt Fly', nameFa: 'نشر خم', category: 'STRENGTH', metValue: 4.5, muscleGroup: 'SHOULDERS' },
  { name: 'Shrug', nameFa: 'شراگ', category: 'STRENGTH', metValue: 4.0, muscleGroup: 'SHOULDERS' },

  // ============ ARMS ============
  { name: 'Barbell Curl', nameFa: 'جلو بازو هالتر', category: 'STRENGTH', metValue: 4.5, muscleGroup: 'ARMS' },
  { name: 'Dumbbell Curl', nameFa: 'جلو بازو دمبل', category: 'STRENGTH', metValue: 4.5, muscleGroup: 'ARMS' },
  { name: 'Hammer Curl', nameFa: 'جلو بازو چکشی', category: 'STRENGTH', metValue: 4.5, muscleGroup: 'ARMS' },
  { name: 'Tricep Pushdown', nameFa: 'پشت بازو سیم‌کش', category: 'STRENGTH', metValue: 4.5, muscleGroup: 'ARMS' },
  { name: 'Skull Crusher', nameFa: 'پشت بازو هالتر خوابیده', category: 'STRENGTH', metValue: 5.0, muscleGroup: 'ARMS' },
  { name: 'Close Grip Bench', nameFa: 'پرس سینه دست جمع', category: 'STRENGTH', metValue: 6.0, muscleGroup: 'ARMS' },

  // ============ CORE ============
  { name: 'Plank', nameFa: 'پلانک', category: 'STRENGTH', metValue: 4.0, muscleGroup: 'CORE' },
  { name: 'Crunch', nameFa: 'کرانچ', category: 'STRENGTH', metValue: 4.0, muscleGroup: 'CORE' },
  { name: 'Sit Up', nameFa: 'دراز نشست', category: 'STRENGTH', metValue: 4.5, muscleGroup: 'CORE' },
  { name: 'Russian Twist', nameFa: 'چرخش روسی', category: 'STRENGTH', metValue: 4.5, muscleGroup: 'CORE' },
  { name: 'Leg Raise', nameFa: 'بالا آوردن پا', category: 'STRENGTH', metValue: 4.5, muscleGroup: 'CORE' },
  { name: 'Mountain Climber', nameFa: 'کوهنوردی', category: 'HIIT', metValue: 8.0, muscleGroup: 'CORE' },

  // ============ HIIT ============
  { name: 'Burpee', nameFa: 'برپی', category: 'HIIT', metValue: 8.0, muscleGroup: 'FULL_BODY' },
  { name: 'Jumping Jack', nameFa: 'جامپینگ جک', category: 'HIIT', metValue: 8.0, muscleGroup: 'FULL_BODY' },
  { name: 'Box Jump', nameFa: 'پرش روی جعبه', category: 'HIIT', metValue: 9.0, muscleGroup: 'LEGS' },
  { name: 'Kettlebell Swing', nameFa: 'سوئینگ کتل‌بل', category: 'HIIT', metValue: 9.0, muscleGroup: 'FULL_BODY' },
  { name: 'Battle Rope', nameFa: 'طناب رزمی', category: 'HIIT', metValue: 10.0, muscleGroup: 'ARMS' },

  // ============ YOGA ============
  { name: 'Hatha Yoga', nameFa: 'هاتا یوگا', category: 'YOGA', metValue: 2.5, muscleGroup: 'FULL_BODY' },
  { name: 'Vinyasa Yoga', nameFa: 'وینیاسا یوگا', category: 'YOGA', metValue: 4.0, muscleGroup: 'FULL_BODY' },
  { name: 'Power Yoga', nameFa: 'پاور یوگا', category: 'YOGA', metValue: 6.0, muscleGroup: 'FULL_BODY' },
  { name: 'Pilates', nameFa: 'پیلاتس', category: 'YOGA', metValue: 3.0, muscleGroup: 'CORE' },

  // ============ FLEXIBILITY ============
  { name: 'Stretching', nameFa: 'کشش عمومی', category: 'FLEXIBILITY', metValue: 2.3, muscleGroup: 'FULL_BODY' },
  { name: 'Hamstring Stretch', nameFa: 'کشش همسترینگ', category: 'FLEXIBILITY', metValue: 2.3, muscleGroup: 'LEGS' },
  { name: 'Shoulder Stretch', nameFa: 'کشش شانه', category: 'FLEXIBILITY', metValue: 2.3, muscleGroup: 'SHOULDERS' },
];

async function main() {
  console.log('🌱 شروع seed...');

  // پاک کردن تمرینات قبلی
  const existingCount = await prisma.exercise.count();
  if (existingCount > 0) {
    console.log(`⚠️  ${existingCount} تمرین قبلاً ثبت شده. پاک می‌شن...`);
    // اول وابستگی‌ها رو پاک کن
    await prisma.workoutLogExercise.deleteMany();
    await prisma.exercise.deleteMany();
  }

  // اضافه کردن تمرینات جدید
  let added = 0;
  for (const ex of exercises) {
    await prisma.exercise.create({
      data: {
        name: ex.name,
        nameFa: ex.nameFa,
        category: ex.category,
        metValue: ex.metValue,
        muscleGroup: ex.muscleGroup,
        description: ex.description ?? null,
      },
    });
    added++;
  }

  console.log(`✅ ${added} تمرین با موفقیت اضافه شد!`);
}

main()
  .catch((e) => {
    console.error('❌ خطا در seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });