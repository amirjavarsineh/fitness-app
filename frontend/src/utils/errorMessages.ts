// ترجمه پیام‌های خطای backend به فارسی

const ERROR_MESSAGES: Record<string, string> = {
  // Auth
  'Invalid credentials': 'ایمیل یا رمز عبور اشتباه است',
  'Email already in use': 'این ایمیل قبلاً ثبت شده است',
  'User not found': 'کاربر پیدا نشد',
  'No token provided': 'لطفاً وارد حساب خود شوید',
  'Invalid or expired token': 'نشست شما منقضی شده است. لطفاً دوباره وارد شوید',

  // Validation
  'title, goalType, and targetValue are required': 'عنوان، دسته‌بندی و مقدار هدف الزامی است',
  'title, goalType, and targetValue are required.': 'عنوان، دسته‌بندی و مقدار هدف الزامی است',
  'targetValue must be a positive number': 'مقدار هدف باید بزرگ‌تر از صفر باشد',
  'type and duration are required': 'نوع تمرین و مدت زمان الزامی است',
  'duration must be a positive number (minutes)': 'مدت زمان باید یه عدد مثبت باشه',
  'foodName, calories, and mealType are required': 'نام غذا، کالری و وعده الزامی است',
  'age, weight, height, gender, activityLevel, goal are required': 'سن، وزن، قد، جنسیت، سطح فعالیت و هدف الزامی هستند',

  // Not found
  'Goal not found': 'هدف پیدا نشد',
  'Workout not found': 'تمرین پیدا نشد',
  'Log not found': 'آیتم پیدا نشد',

  // Generic
  'Server error': 'خطای سرور. لطفاً دوباره تلاش کن',
  'Failed to fetch goals': 'دریافت اهداف با خطا مواجه شد',
  'Failed to fetch goal': 'دریافت هدف با خطا مواجه شد',
  'Failed to create goal': 'ساخت هدف با خطا مواجه شد',
  'Failed to update goal': 'ویرایش هدف با خطا مواجه شد',
  'Failed to delete goal': 'حذف هدف با خطا مواجه شد',
};

export function getPersianError(message: string | undefined | null): string {
  if (!message) return 'خطایی رخ داد. لطفاً دوباره تلاش کن';

  // اگه پیام توی دیکشنری بود، ترجمه کن
  if (ERROR_MESSAGES[message]) {
    return ERROR_MESSAGES[message];
  }

  // اگه پیام شامل "Invalid type" بود، یه پیام مناسب بده
  if (message.startsWith('Invalid type')) {
    return 'نوع تمرین نامعتبر است';
  }

  if (message.startsWith('Invalid goalType')) {
    return 'دسته‌بندی هدف نامعتبر است';
  }

  if (message.startsWith('Invalid gender')) {
    return 'جنسیت نامعتبر است';
  }

  if (message.startsWith('Invalid activityLevel')) {
    return 'سطح فعالیت نامعتبر است';
  }

  if (message.startsWith('Invalid goal')) {
    return 'هدف نامعتبر است';
  }

  if (message.startsWith('Invalid status')) {
    return 'وضعیت نامعتبر است';
  }

  // اگه هیچی مطابقت نکرد، همون پیام انگلیسی رو برگردون
  return message;
}

// استخراج پیام خطا از پاسخ axios
export function extractErrorMessage(error: unknown): string {
  const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
  return getPersianError(msg);
}