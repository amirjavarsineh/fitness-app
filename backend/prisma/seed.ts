import { PrismaClient, WorkoutType } from '@prisma/client';

const prisma = new PrismaClient();

// ============ EXERCISES ============
interface ExerciseSeed {
  name: string;
  nameFa: string;
  category: WorkoutType;
  metValue: number;
  muscleGroup: string;
  description?: string;
}

const exercises: ExerciseSeed[] = [
  // CARDIO
  { name: 'Running', nameFa: 'دویدن', category: 'CARDIO', metValue: 9.8, muscleGroup: 'FULL_BODY', description: 'دویدن با سرعت متوسط' },
  { name: 'Walking', nameFa: 'پیاده‌روی', category: 'CARDIO', metValue: 3.5, muscleGroup: 'FULL_BODY' },
  { name: 'Cycling', nameFa: 'دوچرخه‌سواری', category: 'CARDIO', metValue: 7.5, muscleGroup: 'LEGS' },
  { name: 'Swimming', nameFa: 'شنا', category: 'CARDIO', metValue: 8.3, muscleGroup: 'FULL_BODY' },
  { name: 'Jump Rope', nameFa: 'طناب زدن', category: 'CARDIO', metValue: 12.3, muscleGroup: 'FULL_BODY' },
  { name: 'Rowing Machine', nameFa: 'دستگاه روئینگ', category: 'CARDIO', metValue: 8.5, muscleGroup: 'FULL_BODY' },
  { name: 'Stair Climbing', nameFa: 'بالا رفتن از پله', category: 'CARDIO', metValue: 8.8, muscleGroup: 'LEGS' },
  { name: 'Elliptical', nameFa: 'دستگاه الپتیکال', category: 'CARDIO', metValue: 5.0, muscleGroup: 'FULL_BODY' },
  { name: 'Treadmill Incline', nameFa: 'تردمیل شیب‌دار', category: 'CARDIO', metValue: 8.0, muscleGroup: 'LEGS' },
  { name: 'Dancing', nameFa: 'رقص', category: 'CARDIO', metValue: 6.5, muscleGroup: 'FULL_BODY' },

  // CHEST
  { name: 'Bench Press', nameFa: 'پرس سینه', category: 'STRENGTH', metValue: 6.0, muscleGroup: 'CHEST' },
  { name: 'Incline Bench Press', nameFa: 'پرس سینه شیب‌دار', category: 'STRENGTH', metValue: 6.0, muscleGroup: 'CHEST' },
  { name: 'Push Up', nameFa: 'شنا سوئدی', category: 'STRENGTH', metValue: 8.0, muscleGroup: 'CHEST' },
  { name: 'Dumbbell Fly', nameFa: 'فلای دمبل', category: 'STRENGTH', metValue: 5.0, muscleGroup: 'CHEST' },
  { name: 'Cable Crossover', nameFa: 'کراس‌اُور سیم‌کش', category: 'STRENGTH', metValue: 5.0, muscleGroup: 'CHEST' },
  { name: 'Dips', nameFa: 'پارالل', category: 'STRENGTH', metValue: 7.5, muscleGroup: 'CHEST' },

  // BACK
  { name: 'Deadlift', nameFa: 'ددلیفت', category: 'STRENGTH', metValue: 6.0, muscleGroup: 'BACK' },
  { name: 'Pull Up', nameFa: 'بارفیکس', category: 'STRENGTH', metValue: 8.0, muscleGroup: 'BACK' },
  { name: 'Lat Pulldown', nameFa: 'زیربغل سیم‌کش', category: 'STRENGTH', metValue: 5.0, muscleGroup: 'BACK' },
  { name: 'Barbell Row', nameFa: 'قایقی هالتر', category: 'STRENGTH', metValue: 6.0, muscleGroup: 'BACK' },
  { name: 'Dumbbell Row', nameFa: 'قایقی دمبل', category: 'STRENGTH', metValue: 5.5, muscleGroup: 'BACK' },
  { name: 'Seated Cable Row', nameFa: 'قایقی نشسته سیم‌کش', category: 'STRENGTH', metValue: 5.0, muscleGroup: 'BACK' },

  // LEGS
  { name: 'Squat', nameFa: 'اسکوات', category: 'STRENGTH', metValue: 6.0, muscleGroup: 'LEGS' },
  { name: 'Front Squat', nameFa: 'اسکوات جلو', category: 'STRENGTH', metValue: 6.0, muscleGroup: 'LEGS' },
  { name: 'Leg Press', nameFa: 'پرس پا', category: 'STRENGTH', metValue: 5.0, muscleGroup: 'LEGS' },
  { name: 'Lunges', nameFa: 'لانگز', category: 'STRENGTH', metValue: 5.0, muscleGroup: 'LEGS' },
  { name: 'Leg Extension', nameFa: 'جلو پا دستگاه', category: 'STRENGTH', metValue: 4.0, muscleGroup: 'LEGS' },
  { name: 'Leg Curl', nameFa: 'پشت پا دستگاه', category: 'STRENGTH', metValue: 4.0, muscleGroup: 'LEGS' },
  { name: 'Calf Raise', nameFa: 'ساق پا', category: 'STRENGTH', metValue: 4.0, muscleGroup: 'LEGS' },
  { name: 'Romanian Deadlift', nameFa: 'ددلیفت رومانیایی', category: 'STRENGTH', metValue: 6.0, muscleGroup: 'LEGS' },
  { name: 'Hip Thrust', nameFa: 'هیپ تراست', category: 'STRENGTH', metValue: 5.0, muscleGroup: 'LEGS' },

  // SHOULDERS
  { name: 'Overhead Press', nameFa: 'پرس سرشانه هالتر', category: 'STRENGTH', metValue: 6.0, muscleGroup: 'SHOULDERS' },
  { name: 'Dumbbell Shoulder Press', nameFa: 'پرس سرشانه دمبل', category: 'STRENGTH', metValue: 5.5, muscleGroup: 'SHOULDERS' },
  { name: 'Lateral Raise', nameFa: 'نشر از جانب', category: 'STRENGTH', metValue: 4.5, muscleGroup: 'SHOULDERS' },
  { name: 'Front Raise', nameFa: 'نشر از جلو', category: 'STRENGTH', metValue: 4.5, muscleGroup: 'SHOULDERS' },
  { name: 'Rear Delt Fly', nameFa: 'نشر خم', category: 'STRENGTH', metValue: 4.5, muscleGroup: 'SHOULDERS' },
  { name: 'Shrug', nameFa: 'شراگ', category: 'STRENGTH', metValue: 4.0, muscleGroup: 'SHOULDERS' },

  // ARMS
  { name: 'Barbell Curl', nameFa: 'جلو بازو هالتر', category: 'STRENGTH', metValue: 4.5, muscleGroup: 'ARMS' },
  { name: 'Dumbbell Curl', nameFa: 'جلو بازو دمبل', category: 'STRENGTH', metValue: 4.5, muscleGroup: 'ARMS' },
  { name: 'Hammer Curl', nameFa: 'جلو بازو چکشی', category: 'STRENGTH', metValue: 4.5, muscleGroup: 'ARMS' },
  { name: 'Tricep Pushdown', nameFa: 'پشت بازو سیم‌کش', category: 'STRENGTH', metValue: 4.5, muscleGroup: 'ARMS' },
  { name: 'Skull Crusher', nameFa: 'پشت بازو هالتر خوابیده', category: 'STRENGTH', metValue: 5.0, muscleGroup: 'ARMS' },
  { name: 'Close Grip Bench', nameFa: 'پرس سینه دست جمع', category: 'STRENGTH', metValue: 6.0, muscleGroup: 'ARMS' },

  // CORE
  { name: 'Plank', nameFa: 'پلانک', category: 'STRENGTH', metValue: 4.0, muscleGroup: 'CORE' },
  { name: 'Crunch', nameFa: 'کرانچ', category: 'STRENGTH', metValue: 4.0, muscleGroup: 'CORE' },
  { name: 'Sit Up', nameFa: 'دراز نشست', category: 'STRENGTH', metValue: 4.5, muscleGroup: 'CORE' },
  { name: 'Russian Twist', nameFa: 'چرخش روسی', category: 'STRENGTH', metValue: 4.5, muscleGroup: 'CORE' },
  { name: 'Leg Raise', nameFa: 'بالا آوردن پا', category: 'STRENGTH', metValue: 4.5, muscleGroup: 'CORE' },
  { name: 'Mountain Climber', nameFa: 'کوهنوردی', category: 'HIIT', metValue: 8.0, muscleGroup: 'CORE' },

  // HIIT
  { name: 'Burpee', nameFa: 'برپی', category: 'HIIT', metValue: 8.0, muscleGroup: 'FULL_BODY' },
  { name: 'Jumping Jack', nameFa: 'جامپینگ جک', category: 'HIIT', metValue: 8.0, muscleGroup: 'FULL_BODY' },
  { name: 'Box Jump', nameFa: 'پرش روی جعبه', category: 'HIIT', metValue: 9.0, muscleGroup: 'LEGS' },
  { name: 'Kettlebell Swing', nameFa: 'سوئینگ کتل‌بل', category: 'HIIT', metValue: 9.0, muscleGroup: 'FULL_BODY' },
  { name: 'Battle Rope', nameFa: 'طناب رزمی', category: 'HIIT', metValue: 10.0, muscleGroup: 'ARMS' },

  // YOGA
  { name: 'Hatha Yoga', nameFa: 'هاتا یوگا', category: 'YOGA', metValue: 2.5, muscleGroup: 'FULL_BODY' },
  { name: 'Vinyasa Yoga', nameFa: 'وینیاسا یوگا', category: 'YOGA', metValue: 4.0, muscleGroup: 'FULL_BODY' },
  { name: 'Power Yoga', nameFa: 'پاور یوگا', category: 'YOGA', metValue: 6.0, muscleGroup: 'FULL_BODY' },
  { name: 'Pilates', nameFa: 'پیلاتس', category: 'YOGA', metValue: 3.0, muscleGroup: 'CORE' },

  // FLEXIBILITY
  { name: 'Stretching', nameFa: 'کشش عمومی', category: 'FLEXIBILITY', metValue: 2.3, muscleGroup: 'FULL_BODY' },
  { name: 'Hamstring Stretch', nameFa: 'کشش همسترینگ', category: 'FLEXIBILITY', metValue: 2.3, muscleGroup: 'LEGS' },
  { name: 'Shoulder Stretch', nameFa: 'کشش شانه', category: 'FLEXIBILITY', metValue: 2.3, muscleGroup: 'SHOULDERS' },
];

// ============ FOODS ============
interface FoodSeed {
  name: string;
  nameFa: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

const foods: FoodSeed[] = [
  // ===== Proteins =====
  { name: 'Chicken Breast', nameFa: 'سینه مرغ پخته', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: 'Chicken Thigh', nameFa: 'ران مرغ پخته', calories: 209, protein: 26, carbs: 0, fat: 10.9 },
  { name: 'Beef Steak', nameFa: 'گوشت گوساله', calories: 250, protein: 26, carbs: 0, fat: 15 },
  { name: 'Lamb Meat', nameFa: 'گوشت گوسفند', calories: 294, protein: 25, carbs: 0, fat: 21 },
  { name: 'Salmon', nameFa: 'ماهی قزل‌آلا', calories: 208, protein: 20, carbs: 0, fat: 13 },
  { name: 'Canned Tuna', nameFa: 'تن ماهی', calories: 132, protein: 28, carbs: 0, fat: 1 },
  { name: 'Boiled Egg', nameFa: 'تخم‌مرغ آب‌پز', calories: 155, protein: 13, carbs: 1.1, fat: 11 },
  { name: 'Fried Egg', nameFa: 'تخم‌مرغ نیمرو', calories: 196, protein: 14, carbs: 0.8, fat: 15 },
  { name: 'Shrimp', nameFa: 'میگو پخته', calories: 99, protein: 24, carbs: 0.2, fat: 0.3 },
  { name: 'Sausage', nameFa: 'سوسیس', calories: 301, protein: 12, carbs: 2, fat: 27 },

  // ===== Dairy =====
  { name: 'Whole Milk', nameFa: 'شیر پرچرب', calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3 },
  { name: 'Low-fat Milk', nameFa: 'شیر کم‌چرب', calories: 42, protein: 3.4, carbs: 5, fat: 1 },
  { name: 'Full-fat Yogurt', nameFa: 'ماست پرچرب', calories: 61, protein: 3.5, carbs: 4.7, fat: 3.3 },
  { name: 'Low-fat Yogurt', nameFa: 'ماست کم‌چرب', calories: 56, protein: 5.7, carbs: 7.7, fat: 0.2 },
  { name: 'White Cheese', nameFa: 'پنیر سفید', calories: 264, protein: 14, carbs: 4, fat: 21 },
  { name: 'Mozzarella', nameFa: 'پنیر پیتزا', calories: 280, protein: 22, carbs: 3, fat: 17 },
  { name: 'Kashk', nameFa: 'کشک', calories: 160, protein: 7, carbs: 12, fat: 8 },
  { name: 'Doogh', nameFa: 'دوغ', calories: 36, protein: 1.5, carbs: 4, fat: 1 },
  { name: 'Cream', nameFa: 'خامه', calories: 340, protein: 2.1, carbs: 2.8, fat: 36 },
  { name: 'Butter', nameFa: 'کره', calories: 717, protein: 0.9, carbs: 0.1, fat: 81 },

  // ===== Carbs =====
  { name: 'White Rice Cooked', nameFa: 'برنج سفید پخته', calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { name: 'Brown Rice', nameFa: 'برنج قهوه‌ای', calories: 112, protein: 2.6, carbs: 24, fat: 0.9 },
  { name: 'Lavash Bread', nameFa: 'نان لواش', calories: 260, protein: 9, carbs: 52, fat: 1 },
  { name: 'Sangak Bread', nameFa: 'نان سنگک', calories: 250, protein: 8, carbs: 50, fat: 1.5 },
  { name: 'Barbari Bread', nameFa: 'نان بربری', calories: 270, protein: 9, carbs: 55, fat: 1 },
  { name: 'Toast Bread', nameFa: 'نان تست', calories: 265, protein: 9, carbs: 49, fat: 3.2 },
  { name: 'Pasta Cooked', nameFa: 'ماکارونی پخته', calories: 131, protein: 5, carbs: 25, fat: 1.1 },
  { name: 'Noodles', nameFa: 'رشته', calories: 138, protein: 4.5, carbs: 25, fat: 2.1 },
  { name: 'Boiled Potato', nameFa: 'سیب‌زمینی آب‌پز', calories: 87, protein: 2, carbs: 20, fat: 0.1 },
  { name: 'French Fries', nameFa: 'سیب‌زمینی سرخ‌کرده', calories: 312, protein: 3.4, carbs: 41, fat: 15 },
  { name: 'Oats', nameFa: 'جو دوسر', calories: 389, protein: 17, carbs: 66, fat: 7 },
  { name: 'Bulgur', nameFa: 'بلغور', calories: 342, protein: 12, carbs: 76, fat: 1.3 },
  { name: 'Corn', nameFa: 'ذرت', calories: 86, protein: 3.2, carbs: 19, fat: 1.2 },
  { name: 'Chickpeas', nameFa: 'نخود', calories: 164, protein: 8.9, carbs: 27, fat: 2.6 },
  { name: 'Red Beans', nameFa: 'لوبیا قرمز', calories: 127, protein: 8.7, carbs: 23, fat: 0.5 },
  { name: 'Pinto Beans', nameFa: 'لوبیا چیتی', calories: 143, protein: 9, carbs: 26, fat: 0.7 },
  { name: 'Lentils', nameFa: 'عدس', calories: 116, protein: 9, carbs: 20, fat: 0.4 },
  { name: 'Green Beans', nameFa: 'لوبیا سبز', calories: 31, protein: 1.8, carbs: 7, fat: 0.1 },
  { name: 'Fava Beans', nameFa: 'باقالی', calories: 88, protein: 7.9, carbs: 18, fat: 0.7 },

  // ===== Fruits =====
  { name: 'Apple', nameFa: 'سیب', calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
  { name: 'Banana', nameFa: 'موز', calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
  { name: 'Orange', nameFa: 'پرتقال', calories: 47, protein: 0.9, carbs: 12, fat: 0.1 },
  { name: 'Melon', nameFa: 'خربزه', calories: 34, protein: 0.8, carbs: 8, fat: 0.2 },
  { name: 'Watermelon', nameFa: 'هندوانه', calories: 30, protein: 0.6, carbs: 8, fat: 0.2 },
  { name: 'Grapes', nameFa: 'انگور', calories: 69, protein: 0.7, carbs: 18, fat: 0.2 },
  { name: 'Pomegranate', nameFa: 'انار', calories: 83, protein: 1.7, carbs: 19, fat: 1.2 },
  { name: 'Peach', nameFa: 'هلو', calories: 39, protein: 0.9, carbs: 10, fat: 0.3 },
  { name: 'Cherry', nameFa: 'گیلاس', calories: 50, protein: 1, carbs: 12, fat: 0.3 },
  { name: 'Strawberry', nameFa: 'توت‌فرنگی', calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3 },
  { name: 'Kiwi', nameFa: 'کیوی', calories: 61, protein: 1.1, carbs: 15, fat: 0.5 },
  { name: 'Mango', nameFa: 'انبه', calories: 60, protein: 0.8, carbs: 15, fat: 0.4 },
  { name: 'Pineapple', nameFa: 'آناناس', calories: 50, protein: 0.5, carbs: 13, fat: 0.1 },
  { name: 'Date', nameFa: 'خرما', calories: 282, protein: 2.5, carbs: 75, fat: 0.4 },
  { name: 'Fig', nameFa: 'انجیر', calories: 74, protein: 0.8, carbs: 19, fat: 0.3 },
  { name: 'Plum', nameFa: 'آلو', calories: 46, protein: 0.7, carbs: 11, fat: 0.3 },
  { name: 'Apricot', nameFa: 'زردآلو', calories: 48, protein: 1.4, carbs: 11, fat: 0.4 },
  { name: 'Cantaloupe', nameFa: 'طالبی', calories: 34, protein: 0.8, carbs: 8, fat: 0.2 },
  { name: 'Tangerine', nameFa: 'نارنگی', calories: 53, protein: 0.8, carbs: 13, fat: 0.3 },
  { name: 'Lemon', nameFa: 'لیمو', calories: 29, protein: 1.1, carbs: 9, fat: 0.3 },

  // ===== Vegetables =====
  { name: 'Tomato', nameFa: 'گوجه‌فرنگی', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
  { name: 'Cucumber', nameFa: 'خیار', calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1 },
  { name: 'Lettuce', nameFa: 'کاهو', calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2 },
  { name: 'Carrot', nameFa: 'هویج', calories: 41, protein: 0.9, carbs: 10, fat: 0.2 },
  { name: 'Onion', nameFa: 'پیاز', calories: 40, protein: 1.1, carbs: 9, fat: 0.1 },
  { name: 'Garlic', nameFa: 'سیر', calories: 149, protein: 6.4, carbs: 33, fat: 0.5 },
  { name: 'Cabbage', nameFa: 'کلم', calories: 25, protein: 1.3, carbs: 6, fat: 0.1 },
  { name: 'Broccoli', nameFa: 'کلم بروکلی', calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
  { name: 'Cauliflower', nameFa: 'گل کلم', calories: 25, protein: 1.9, carbs: 5, fat: 0.3 },
  { name: 'Spinach', nameFa: 'اسفناج', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
  { name: 'Bell Pepper', nameFa: 'فلفل دلمه', calories: 31, protein: 1, carbs: 6, fat: 0.3 },
  { name: 'Eggplant', nameFa: 'بادمجان', calories: 25, protein: 1, carbs: 6, fat: 0.2 },
  { name: 'Zucchini', nameFa: 'کدو سبز', calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3 },
  { name: 'Mushroom', nameFa: 'قارچ', calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3 },
  { name: 'Turnip', nameFa: 'شلغم', calories: 28, protein: 0.9, carbs: 6, fat: 0.1 },
  { name: 'Beetroot', nameFa: 'چغندر', calories: 43, protein: 1.6, carbs: 10, fat: 0.2 },

  // ===== Nuts & Dried Fruits =====
  { name: 'Almond', nameFa: 'بادام', calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12.5 },
  { name: 'Walnut', nameFa: 'گردو', calories: 654, protein: 15, carbs: 14, fat: 65, fiber: 6.7 },
  { name: 'Pistachio', nameFa: 'پسته', calories: 560, protein: 20, carbs: 28, fat: 45, fiber: 10 },
  { name: 'Peanut', nameFa: 'بادام زمینی', calories: 567, protein: 26, carbs: 16, fat: 49, fiber: 8.5 },
  { name: 'Hazelnut', nameFa: 'فندق', calories: 628, protein: 15, carbs: 17, fat: 61, fiber: 10 },
  { name: 'Raisin', nameFa: 'کشمش', calories: 299, protein: 3.1, carbs: 79, fat: 0.5, fiber: 3.7 },
  { name: 'Dried Mulberry', nameFa: 'توت خشک', calories: 320, protein: 10, carbs: 70, fat: 3 },
  { name: 'Dried Fig', nameFa: 'انجیر خشک', calories: 249, protein: 3.3, carbs: 64, fat: 0.9, fiber: 9.8 },

  // ===== Iranian Dishes =====
  { name: 'Koobideh Kebab', nameFa: 'کباب کوبیده', calories: 250, protein: 20, carbs: 5, fat: 16 },
  { name: 'Joojeh Kebab', nameFa: 'جوجه کباب', calories: 180, protein: 28, carbs: 2, fat: 6 },
  { name: 'Chelo Kebab', nameFa: 'چلوکباب', calories: 450, protein: 25, carbs: 60, fat: 12 },
  { name: 'Ghormeh Sabzi', nameFa: 'قورمه سبزی', calories: 180, protein: 12, carbs: 10, fat: 10 },
  { name: 'Gheymeh', nameFa: 'قیمه', calories: 200, protein: 14, carbs: 18, fat: 8 },
  { name: 'Fesenjan', nameFa: 'فسنجان', calories: 320, protein: 15, carbs: 20, fat: 20 },
  { name: 'Abgoosht', nameFa: 'آبگوشت', calories: 250, protein: 18, carbs: 20, fat: 10 },
  { name: 'Mirza Ghasemi', nameFa: 'میرزاقاسمی', calories: 180, protein: 7, carbs: 15, fat: 10 },
  { name: 'Kookoo Sabzi', nameFa: 'کوکوسبزی', calories: 220, protein: 8, carbs: 8, fat: 17 },
  { name: 'Kotlet', nameFa: 'کتلت', calories: 280, protein: 14, carbs: 15, fat: 18 },
  { name: 'Ash Reshteh', nameFa: 'آش رشته', calories: 150, protein: 7, carbs: 22, fat: 3 },
  { name: 'Haleem', nameFa: 'حلیم', calories: 180, protein: 8, carbs: 25, fat: 5 },
  { name: 'Tahchin', nameFa: 'ته‌چین مرغ', calories: 320, protein: 15, carbs: 40, fat: 12 },
  { name: 'Zereshk Polo', nameFa: 'زرشک پلو با مرغ', calories: 400, protein: 22, carbs: 55, fat: 10 },
  { name: 'Baghali Polo', nameFa: 'باقالی پلو', calories: 380, protein: 18, carbs: 55, fat: 10 },
  { name: 'Lubia Polo', nameFa: 'لوبیا پلو', calories: 350, protein: 14, carbs: 55, fat: 8 },
  { name: 'Adas Polo', nameFa: 'عدس پلو', calories: 340, protein: 12, carbs: 55, fat: 7 },

  // ===== Drinks =====
  { name: 'Tea (no sugar)', nameFa: 'چای بدون شکر', calories: 1, protein: 0, carbs: 0, fat: 0 },
  { name: 'Coffee (no sugar)', nameFa: 'قهوه بدون شکر', calories: 2, protein: 0.3, carbs: 0, fat: 0 },
  { name: 'Orange Juice', nameFa: 'آب‌پرتقال', calories: 45, protein: 0.7, carbs: 10, fat: 0.2 },
  { name: 'Soda', nameFa: 'نوشابه', calories: 41, protein: 0, carbs: 10, fat: 0 },
  { name: 'Packaged Juice', nameFa: 'آبمیوه صنعتی', calories: 50, protein: 0.2, carbs: 12, fat: 0 },

  // ===== Others =====
  { name: 'Honey', nameFa: 'عسل', calories: 304, protein: 0.3, carbs: 82, fat: 0 },
  { name: 'Sugar', nameFa: 'شکر', calories: 387, protein: 0, carbs: 100, fat: 0 },
  { name: 'Dark Chocolate', nameFa: 'شکلات تلخ', calories: 546, protein: 5, carbs: 61, fat: 31 },
  { name: 'Milk Chocolate', nameFa: 'شکلات شیری', calories: 535, protein: 7.6, carbs: 59, fat: 30 },
  { name: 'Ice Cream', nameFa: 'بستنی', calories: 207, protein: 3.5, carbs: 24, fat: 11 },
  { name: 'Cake', nameFa: 'کیک', calories: 350, protein: 5, carbs: 50, fat: 15 },
  { name: 'Biscuit', nameFa: 'بیسکویت', calories: 450, protein: 7, carbs: 70, fat: 15 },
  { name: 'Chips', nameFa: 'چیپس', calories: 536, protein: 7, carbs: 53, fat: 34 },
  { name: 'Puffed Corn', nameFa: 'پفک', calories: 480, protein: 6, carbs: 60, fat: 25 },
  { name: 'Olive Oil', nameFa: 'روغن زیتون', calories: 884, protein: 0, carbs: 0, fat: 100 },
  { name: 'Vegetable Oil', nameFa: 'روغن مایع', calories: 884, protein: 0, carbs: 0, fat: 100 },
  { name: 'Mayonnaise', nameFa: 'سس مایونز', calories: 680, protein: 1, carbs: 0.6, fat: 75 },
  { name: 'Ketchup', nameFa: 'سس کچاپ', calories: 101, protein: 1.2, carbs: 25, fat: 0.1 },
  { name: 'Pizza', nameFa: 'پیتزا', calories: 266, protein: 11, carbs: 33, fat: 10 },
  { name: 'Hamburger', nameFa: 'همبرگر', calories: 295, protein: 17, carbs: 24, fat: 14 },
  { name: 'Sandwich', nameFa: 'ساندویچ', calories: 250, protein: 12, carbs: 30, fat: 9 },
];

// ============ MAIN ============
async function main() {
  console.log('🌱 شروع seed...\n');

  // ===== Seed Exercises =====
  const existingExercises = await prisma.exercise.count();
  if (existingExercises > 0) {
    console.log(`⚠️  ${existingExercises} تمرین قبلاً ثبت شده. پاک می‌شن...`);
    await prisma.workoutLogExercise.deleteMany();
    await prisma.exercise.deleteMany();
  }

  let exerciseCount = 0;
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
    exerciseCount++;
  }
  console.log(`✅ ${exerciseCount} تمرین اضافه شد.`);

  // ===== Seed Foods =====
  const existingFoods = await prisma.foodItem.count();
  if (existingFoods > 0) {
    console.log(`⚠️  ${existingFoods} غذا قبلاً ثبت شده. پاک می‌شن...`);
    await prisma.mealLogItem.deleteMany();
    await prisma.foodItem.deleteMany();
  }

  let foodCount = 0;
  for (const f of foods) {
    await prisma.foodItem.create({
      data: {
        name: f.name,
        nameFa: f.nameFa,
        brand: f.brand ?? null,
        calories: f.calories,
        protein: f.protein,
        carbs: f.carbs,
        fat: f.fat,
        fiber: f.fiber ?? 0,
        isCustom: false,
        createdBy: null,
      },
    });
    foodCount++;
  }
  console.log(`✅ ${foodCount} غذا اضافه شد.`);

  console.log('\n🎉 seed با موفقیت انجام شد!');
}

main()
  .catch((e) => {
    console.error('❌ خطا در seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });