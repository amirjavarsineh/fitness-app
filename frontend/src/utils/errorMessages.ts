import { useLanguageStore } from '../store/language.store';

type Lang = 'fa' | 'en';

const MESSAGES: Record<string, { fa: string; en: string }> = {
  'Invalid credentials': {
    fa: 'ایمیل یا رمز عبور اشتباه است',
    en: 'Invalid email or password',
  },
  'Email already in use': {
    fa: 'این ایمیل قبلاً ثبت شده است',
    en: 'This email is already registered',
  },
  'User not found': {
    fa: 'کاربر پیدا نشد',
    en: 'User not found',
  },
  'No token provided': {
    fa: 'لطفاً وارد حساب خود شوید',
    en: 'Please log in',
  },
  'Invalid or expired token': {
    fa: 'نشست شما منقضی شده است. لطفاً دوباره وارد شوید',
    en: 'Session expired. Please log in again',
  },
  'title, goalType, and targetValue are required': {
    fa: 'عنوان، دسته‌بندی و مقدار هدف الزامی است',
    en: 'Title, category, and target value are required',
  },
  'title, goalType, and targetValue are required.': {
    fa: 'عنوان، دسته‌بندی و مقدار هدف الزامی است',
    en: 'Title, category, and target value are required',
  },
  'targetValue must be a positive number': {
    fa: 'مقدار هدف باید بزرگ‌تر از صفر باشد',
    en: 'Target value must be greater than zero',
  },
  'type and duration are required': {
    fa: 'نوع تمرین و مدت زمان الزامی است',
    en: 'Workout type and duration are required',
  },
  'duration must be a positive number (minutes)': {
    fa: 'مدت زمان باید یه عدد مثبت باشه',
    en: 'Duration must be a positive number',
  },
  'foodName, calories, and mealType are required': {
    fa: 'نام غذا، کالری و وعده الزامی است',
    en: 'Food name, calories, and meal type are required',
  },
  'age, weight, height, gender, activityLevel, goal are required': {
    fa: 'سن، وزن، قد، جنسیت، سطح فعالیت و هدف الزامی هستند',
    en: 'Age, weight, height, gender, activity level, and goal are required',
  },
  'Goal not found': {
    fa: 'هدف پیدا نشد',
    en: 'Goal not found',
  },
  'Workout not found': {
    fa: 'تمرین پیدا نشد',
    en: 'Workout not found',
  },
  'Log not found': {
    fa: 'آیتم پیدا نشد',
    en: 'Log not found',
  },
  'Server error': {
    fa: 'خطای سرور. لطفاً دوباره تلاش کن',
    en: 'Server error. Please try again',
  },
  'Failed to fetch goals': {
    fa: 'دریافت اهداف با خطا مواجه شد',
    en: 'Failed to fetch goals',
  },
  'Failed to fetch goal': {
    fa: 'دریافت هدف با خطا مواجه شد',
    en: 'Failed to fetch goal',
  },
  'Failed to create goal': {
    fa: 'ساخت هدف با خطا مواجه شد',
    en: 'Failed to create goal',
  },
  'Failed to update goal': {
    fa: 'ویرایش هدف با خطا مواجه شد',
    en: 'Failed to update goal',
  },
  'Failed to delete goal': {
    fa: 'حذف هدف با خطا مواجه شد',
    en: 'Failed to delete goal',
  },
};

const PREFIX_MESSAGES: Array<{ prefix: string; fa: string; en: string }> = [
  { prefix: 'Invalid type', fa: 'نوع تمرین نامعتبر است', en: 'Invalid workout type' },
  { prefix: 'Invalid goalType', fa: 'دسته‌بندی هدف نامعتبر است', en: 'Invalid goal category' },
  { prefix: 'Invalid gender', fa: 'جنسیت نامعتبر است', en: 'Invalid gender' },
  { prefix: 'Invalid activityLevel', fa: 'سطح فعالیت نامعتبر است', en: 'Invalid activity level' },
  { prefix: 'Invalid goal', fa: 'هدف نامعتبر است', en: 'Invalid goal' },
  { prefix: 'Invalid status', fa: 'وضعیت نامعتبر است', en: 'Invalid status' },
];

const GENERIC_ERROR: Record<Lang, string> = {
  fa: 'خطایی رخ داد. لطفاً دوباره تلاش کن',
  en: 'An error occurred. Please try again',
};

export function getErrorMessage(
  message: string | undefined | null,
  language: Lang = 'fa'
): string {
  if (!message) return GENERIC_ERROR[language];

  const exact = MESSAGES[message];
  if (exact) return exact[language];

  for (const p of PREFIX_MESSAGES) {
    if (message.startsWith(p.prefix)) return p[language];
  }

  return message;
}

export function extractErrorMessage(error: unknown): string {
  const language = useLanguageStore.getState().language;
  const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
  return getErrorMessage(msg, language);
}

// سازگاری با کدهای قبلی
export function getPersianError(message: string | undefined | null): string {
  return getErrorMessage(message, 'fa');
}