<div align="center">

# 💪 Fitness App | اپلیکیشن تناسب اندام

**A full-stack fitness tracking application**
**یک اپلیکیشن فول‌استک برای ردیابی تناسب اندام**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa&logoColor=white)](#-pwa)

[🇬🇧 English](#-english) • [🇮🇷 فارسی](#-فارسی)

</div>

---

<div dir="rtl">

## 📖 فارسی

### 🎯 درباره پروژه

**اپلیکیشن تناسب اندام** یک برنامه‌ی کامل و مدرن برای ردیابی تمرینات، تغذیه، آب، وزن و اهداف شماست. این پروژه با تکنولوژی‌های روز ساخته شده و شامل **۳۱ صفحه‌ی کاربری**، **۲۵ مدل دیتابیس**، و **۸۵+ API Endpoint** می‌باشد.

**ویژگی‌های کلیدی:**
- 🌐 **دوزبانه** (فارسی + انگلیسی) با تغییر لحظه‌ای
- 📱 **PWA** — قابل نصب روی گوشی و دسکتاپ
- 🌙 **حالت تاریک** با ذخیره‌ی ترجیح
- 🔒 **امنیت** — bcrypt + JWT + Rate Limiting
- ⚡ **سریع** — Lazy Loading + Smart Caching
- 🕐 **Timezone هوشمند** — همه‌ی تاریخ‌ها بر اساس Asia/Tehran
- 👨‍🏫 **سیستم مربی و شاگرد** با کد دعوت اختصاصی
- 🧮 **۱۲ محاسبه‌ی پیشرفته‌ی بدنی** (BMI، BMR، TDEE، WHtR و...)

### ✨ امکانات

<table>
<tr>
<td width="50%">

#### 🏋️ ردیابی تمرینات
- ساخت، ویرایش و حذف تمرینات
- افزودن چند حرکت به هر تمرین
- **چک‌باکس انجام تمرین** (Completed/Not Completed)
- کاتالوگ **۶۱ تمرین آماده** با مقادیر MET
- انتخاب‌گر هوشمند حرکت با جستجو
- ذخیره تمرین به‌عنوان **قالب** برای استفاده سریع
- ثبت تمرین برای **تاریخ‌های گذشته**
- محاسبه‌ی خودکار کالری سوزانده با فرمول MET

#### 🍎 ثبت تغذیه
- ثبت غذا بر اساس وعده (صبحانه، ناهار، شام، میان‌وعده)
- پیگیری کالری، پروتئین، کربوهیدرات و چربی
- خلاصه‌ی روزانه
- جستجو در **کاتالوگ ۵۰+ غذا**

#### 💧 مصرف آب
- ردیابی مصرف روزانه‌ی آب
- هدف سفارشی روزانه
- نمودار حلقه‌ای پیشرفت
- آمار هفتگی

#### ⚖️ پیشرفت وزن
- ثبت وزن برای **هر تاریخی**
- نمودار خطی تعاملی
- آمار: وزن فعلی، شروع، تغییر، کمینه، بیشینه

#### 📏 اندازه‌های بدن
- ثبت **۱۰ اندازه** (گردن، سینه، شانه، کمر، باسن، بازو، ساعد، مچ، ران، ساق)
- پیگیری تغییرات با نمایش صعودی/نزولی
- تاریخچه‌ی کامل

</td>
<td width="50%">

#### 🎯 اهداف
- ساخت هدف با دسته‌بندی
- نوار پیشرفت بصری
- تکمیل خودکار وقتی به هدف رسیدی
- پشتیبانی از مهلت

#### 🏆 مدال‌ها و دستاوردها
- **۱۸ مدال** در ۶ دسته
- سیستم مدال (برنز، نقره، طلا، الماس)
- فیلتر بر اساس دسته

#### 🥇 چالش‌ها
- ساخت چالش با هدف روزانه
- چک‌این روزانه
- شش چالش آماده (آب، تمرین، عادت)
- ردیابی streak

#### 🔔 یادآورها
- ساخت یادآور با زمان
- روزهای هفته دلخواه
- اعلان مرورگر (Notification API)
- شش یادآور آماده

#### 📊 داشبورد و گزارش
- داشبورد شخصی‌سازی‌شده
- **شمارنده روزهای پیوسته** (Streak)
- گزارش هفتگی با **۵ نمودار تعاملی**

#### 🔮 پیش‌بینی هوشمند
- پیش‌بینی وزن با **Linear Regression**
- پیش‌بینی زمان رسیدن به هدف
- پیش‌بینی کالری و آب
- تحلیل روند اهداف

#### 📈 سیستم XP و سطح
- **۷ فعالیت** برای کسب XP
- ۶ رتبه (مبتدی تا ابرقهرمان)
- نقشه‌ی رتبه‌ها
- نمایش breakdown امتیازات

#### 🧮 محاسبات بدنی پیشرفته
- **BMI** با نمودار رنگی و دسته‌بندی
- **BMR** (فرمول Mifflin-St Jeor)
- **TDEE** با ضریب فعالیت
- **کالری هدف** بر اساس هدف کاربر
- **درشت‌مغذی‌ها** (پروتئین، کربوهیدرات، چربی)
- **هدف آب روزانه** خودکار
- **درصد چربی بدن** (فرمول Navy)
- **جرم بدون چربی** (Lean Body Mass)
- **توده‌ی عضلانی اسکلتی** (SMM)
- **FFMI** (شاخص عضله‌ی بدون چربی)
- **نسبت دور کمر به باسن** (WHR)
- **نسبت دور کمر به قد** (WHtR) — دقیق‌تر از BMI
- **چربی احشایی** (Visceral Fat)
- **نسبت شانه به کمر** (V-Taper)
- **تناسب بالا/پائین‌تنه** (Symmetry)
- **تیپ بدنی** (Somatotype: Ecto/Meso/Endo)
- **اندازه‌ی اسکلت** (ریز/متوسط/درشت‌استخوان)
- **سن متابولیک** — بدنت مثل چند ساله کار می‌کنه
- **امتیاز سلامت کلی** (۰ تا ۱۰۰)

#### 👨‍🏫 سیستم مربی و شاگرد
- فعال‌سازی حالت مربی با **کد اختصاصی** (مثل `FIT-A3B5C7`)
- اتصال شاگرد به مربی با کد
- مدیریت شاگردها
- قطع ارتباط دوطرفه

#### 📋 برنامه‌های تمرینی
- ساخت برنامه‌ی **هفتگی / روزانه / دوره‌ای**
- تعریف روزها و حرکات با ست، تکرار، وزن، استراحت و یادداشت
- ذخیره به‌عنوان **قالب** برای استفاده‌ی مجدد
- دادن برنامه به **چند شاگرد**
- ویرایش هوشمند (حفظ تاریخچه‌ی شاگرد)

#### ✅ چک‌لیست تمرین شاگرد
- نمایش برنامه‌ی دریافتی
- تیک‌زدن هر حرکت
- ثبت مقدار واقعی (ست، تکرار، وزن، زمان)
- یادداشت شخصی برای هر حرکت
- تاریخ انتخابی (پیش‌فرض امروز)

#### 📈 نمودار پیشرفت شاگرد (برای مربی)
- کارت‌های آمار (کل جلسات، تکمیل‌شده، درصد)
- نمودار هفتگی فعالیت
- لیست جلسات با جزئیات کامل
- مشاهده‌ی هر جلسه (چه حرکاتی انجام شده، چقدر زمان برده)

#### 📥 دانلود داده‌ها
- خروجی همه‌ی داده‌ها به فرمت CSV
- پشتیبانی کامل از فارسی (UTF-8 BOM)

</td>
</tr>
</table>

### 🛠️ تکنولوژی‌ها

**Backend:**
| تکنولوژی | توضیح |
|-----------|-------|
| Node.js + Express | REST API |
| TypeScript | Type Safety |
| Prisma ORM | Database Layer |
| PostgreSQL | دیتابیس اصلی |
| JWT + bcrypt | احراز هویت |
| Helmet + express-rate-limit | امنیت |
| express-validator | اعتبارسنجی |
| dayjs / Intl API | مدیریت تاریخ |

**Frontend:**
| تکنولوژی | توضیح |
|-----------|-------|
| React 19 | UI Library |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Tailwind CSS 4 | Styling |
| React Router 6 | Routing |
| TanStack Query 5 | Data Fetching + Cache |
| Zustand | State Management |
| React Hook Form | Form Handling |
| Recharts | Charts |
| vite-plugin-pwa | PWA Support |
| Lucide React | Icons |


### 🚀 راه‌اندازی

#### پیش‌نیازها
- Node.js >= 18
- PostgreSQL >= 14
- npm یا yarn

#### ۱. کلون کردن پروژه

```bash
git clone https://github.com/amirjavarsineh/fitness-app.git
cd fitness-app
```

#### ۲. راه‌اندازی Backend

```bash
cd backend
npm install
cp .env.example .env
```

فایل `.env` رو باز کن و مقادیر رو پر کن:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/fitness_db?schema=public"
SHADOW_DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/fitness_shadow_db?schema=public"
JWT_SECRET="your-super-secret-key-min-32-chars"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

سپس:

```bash
npx prisma migrate dev
npx prisma generate
npm run seed        # ایمپورت ۶۱ تمرین + ۵۰+ غذا
npm run dev
```

سرور روی `http://localhost:5000` اجرا می‌شه.

#### ۳. راه‌اندازی Frontend

```bash
cd ../frontend
npm install
cp .env.example .env
```

محتوای `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

سپس:

```bash
npm run dev
```

اپلیکیشن روی `http://localhost:5173` اجرا می‌شه.

### 📱 PWA

این اپلیکیشن به‌صورت کامل **PWA** پیاده‌سازی شده و می‌تونه روی گوشی و دسکتاپ نصب بشه:

- ✅ **Offline Support** — کش کردن assets
- ✅ **Installable** — دکمه‌ی نصب خودکار
- ✅ **Standalone Display** — مثل یه اپ بومی
- ✅ **Auto Update** — نسخه‌ی جدید خودکار اعمال می‌شه
- ✅ **RTL Support** — مناسب برای فارسی
- ✅ **Theme Color** — نوار مرورگر هم‌رنگ اپ
- ✅ **صفحه‌ی نصب اختصاصی** — راهنمای قدم‌به‌قدم برای Android/iOS/Desktop

**نصب:**
1. اپ رو در مرورگر باز کن
2. بنر «نصب اپلیکیشن» ظاهر می‌شه → بزن «نصب کن»
3. یا از منو به صفحه‌ی **«نصب اپلیکیشن»** برو و راهنمای مخصوص دستگاهت رو دنبال کن
4. اپ روی صفحه‌ی اصلی قرار می‌گیره

### 🌐 دوزبانه (i18n)

- **فارسی (پیش‌فرض)** با پشتیبانی کامل RTL
- **انگلیسی (LTR)** برای کاربران بین‌المللی
- **تغییر لحظه‌ای** بدون refresh
- **ذخیره‌ی ترجیح** در localStorage
- **اعداد هوشمند** — فارسی: ۱۲۳ / انگلیسی: 123
- **ترجمه‌ی کامل** همه‌ی صفحات، پیام‌های خطا و اعلان‌ها

### 🔒 امنیت

- ✅ هش رمز با **bcrypt** (cost 12)
- ✅ احراز هویت با **JWT**
- ✅ **Rate Limiting** روی مسیرهای حساس
- ✅ هدرهای امنیتی با **Helmet**
- ✅ محدودیت حجم بدنه درخواست (10kb)
- ✅ **CORS** محدود به دامنه فرانت‌اند
- ✅ اعتبارسنجی ورودی‌ها
- ✅ جلوگیری از SQL Injection با Prisma
- ✅ **احراز مالکیت** — همه‌ی کوئری‌ها با `userId` فیلتر می‌شن

**نکته:** برای محصول تجاری، HttpOnly Cookies، Refresh Token، Email Verification و 2FA توصیه می‌شود.

### 🕐 مدیریت تاریخ و Timezone

- همه‌ی تاریخ‌ها بر اساس **Asia/Tehran** محاسبه می‌شن
- رکوردهای روزانه (آب، وزن، چک‌این) در نیمه‌شب تهران ثبت می‌شن
- نمودارها با فرمت locale کاربر نمایش داده می‌شن
- تابع `dateKeyToDbDate` برای ذخیره‌ی صحیح در ستون‌های `@db.Date`

### 🚢 دیپلوی

#### Frontend → Vercel / Netlify

```bash
cd frontend
npm run build
```

**روی Vercel:**
1. پروژه رو به Vercel وصل کن
2. Environment: `VITE_API_URL=https://your-backend.com/api`
3. Deploy

**روی Netlify:** مشابه Vercel

#### Backend → Render / Railway

**روی Render:**
1. Web Service جدید بساز
2. Build Command: `npm install && npx prisma generate && npm run build`
3. Start Command: `npm start`
4. Environment Variables:
   - `DATABASE_URL` (از Neon/Supabase)
   - `JWT_SECRET` (حداقل ۳۲ کاراکتر)
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://your-frontend.vercel.app`

#### دیتابیس → Neon / Supabase

- پلن رایگان: **۵۰۰MB - ۱GB**
- Connection String رو در `DATABASE_URL` بذار

**تخمین هزینه:**
| سناریو | هزینه ماهانه |
|--------|---------------|
| کاملاً رایگان | $0 |
| اقتصادی (بدون خواب سرور) | $5 - $15 |
| حرفه‌ای | $25 - $45 |

### 🗺️ Roadmap

- [ ] **Social Login** (Google, Apple)
- [ ] **Email Verification** + **Password Reset**
- [ ] **2FA** (اختیاری با TOTP)
- [ ] **پیام بین مربی و شاگرد**
- [ ] **کامنت مربی روی جلسه‌ی شاگرد**
- [ ] **برنامه‌ی غذایی توسط مربی**
- [ ] **XP برای چک‌این‌های برنامه**
- [ ] **اشتراک‌گذاری تمرین** با دوستان
- [ ] **برنامه‌ریزی تمرین با AI**
- [ ] **Apple Health / Google Fit** integration
- [ ] **نسخه‌ی موبایل** (React Native)
- [ ] **Admin Dashboard**
- [ ] **تست‌ها** (Jest + Playwright)
- [ ] **GraphQL API** (اختیاری)

### 🐛 عیب‌یابی

<details>
<summary><b>خطای Connection Refused روی دیتابیس</b></summary>

مطمئن شو PostgreSQL اجراست:
```bash
# Windows
services.msc → PostgreSQL running

# macOS
brew services list

# Linux
sudo systemctl status postgresql
```
</details>

<details>
<summary><b>خطای Prisma Client not found</b></summary>

```bash
cd backend
npx prisma generate
```
</details>

<details>
<summary><b>خطای CORS در فرانت</b></summary>

- مطمئن شو `FRONTEND_URL` در backend درست تنظیم شده
- مطمئن شو `VITE_API_URL` در frontend درست تنظیم شده
- بعد از تغییر `.env`، سرور رو restart کن
</details>

<details>
<summary><b>تاریخ‌های ذخیره‌شده اشتباه هستن</b></summary>

همه‌ی تاریخ‌ها باید بر اساس **Asia/Tehran** باشن. اگه سرورت روی UTC هست، این طبیعیه و کد هندل می‌کنه. اگه مشکلی دیدی، `backend/src/lib/dates.ts` رو چک کن.
</details>

<details>
<summary><b>PWA نصب نمی‌شه</b></summary>

- فقط روی **HTTPS** یا **localhost** کار می‌کنه
- مطمئن شو `vite-plugin-pwa` درست تنظیم شده
- در Chrome: DevTools → Application → Manifest
- برای تست در حالت development، `devOptions.enabled` رو `true` کن
</details>

<details>
<summary><b>نمی‌تونم به شاگرد جدید برنامه بدم</b></summary>

- مطمئن شو شاگرد بهت وصل شده (از صفحه‌ی «مربی»)
- اگه مشکل ادامه داشت، صفحه رو **رفرش** کن (`Ctrl + Shift + R`) — لیست شاگردها رفرش می‌شه
</details>

<details>
<summary><b>تاریخچه‌ی شاگرد بعد از ویرایش برنامه پاک می‌شه</b></summary>

این مشکل در نسخه‌ی جدید حل شده. `updateProgram` به‌صورت **هوشمندانه** فقط چیزهایی که عوض شدن رو آپدیت می‌کنه و ID روزها و حرکات رو حفظ می‌کنه.
</details>

### 📸 اسکرین‌شات‌ها

*(در حال آماده‌سازی)*

اگه خواستی به پروژه کمک کنی، می‌تونی اسکرین‌شات بگیر و PR بزنی.

### 📄 مجوز

این پروژه تحت **MIT License** منتشر شده. برای جزئیات فایل [LICENSE](LICENSE) رو ببین.

### 🤝 مشارکت

پیشنهادات، گزارش باگ و PRها پذیرفته می‌شن!

1. Fork کن
2. Branch بساز (`git checkout -b feature/amazing`)
3. Commit کن (`git commit -m 'Add amazing feature'`)
4. Push کن (`git push origin feature/amazing`)
5. Pull Request باز کن

---

## 📡 API Endpoints

<details>
<summary><b>🔽 برای دیدن لیست کامل کلیک کن</b></summary>

### 🔐 Auth (۳)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | ثبت‌نام کاربر جدید |
| POST | `/api/auth/login` | ورود کاربر |
| GET | `/api/auth/me` | اطلاعات کاربر فعلی |

### 👤 Profile (۲)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | دریافت پروفایل |
| PUT | `/api/profile` | ذخیره یا ویرایش پروفایل |

### 🏋️ Workouts (۸)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workouts` | لیست تمرینات |
| GET | `/api/workouts/templates` | لیست قالب‌ها |
| POST | `/api/workouts/templates/:id/use` | استفاده از قالب |
| GET | `/api/workouts/:id` | دریافت تمرین |
| POST | `/api/workouts` | ساخت تمرین |
| PUT | `/api/workouts/:id` | ویرایش تمرین |
| PATCH | `/api/workouts/:id/toggle-complete` | تغییر وضعیت انجام |
| DELETE | `/api/workouts/:id` | حذف تمرین |

### 🍎 Nutrition (۴)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/nutrition` | لیست وعده‌ها |
| POST | `/api/nutrition` | ثبت غذا |
| PUT | `/api/nutrition/:id` | ویرایش |
| DELETE | `/api/nutrition/:id` | حذف |

### 💧 Water (۵)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/water/today` | آب امروز |
| GET | `/api/water/stats` | آمار هفتگی |
| POST | `/api/water/add` | افزودن آب |
| PUT | `/api/water/goal` | ویرایش هدف |
| DELETE | `/api/water/today` | ریست امروز |

### ⚖️ Progress (۴)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/progress/weight` | تاریخچه وزن |
| GET | `/api/progress/weight/stats` | آمار وزن |
| POST | `/api/progress/weight` | ثبت وزن |
| DELETE | `/api/progress/weight/:id` | حذف |

### 📏 Measurements (۴)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/measurements` | لیست اندازه‌ها |
| GET | `/api/measurements/stats` | آمار |
| POST | `/api/measurements` | ثبت یا ویرایش |
| DELETE | `/api/measurements/:id` | حذف |

### 🎯 Goals (۵)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/goals` | لیست اهداف |
| GET | `/api/goals/:id` | یک هدف |
| POST | `/api/goals` | ساخت هدف |
| PUT | `/api/goals/:id` | ویرایش |
| DELETE | `/api/goals/:id` | حذف |

### 🥇 Challenges (۷)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/challenges` | لیست چالش‌ها |
| POST | `/api/challenges` | ساخت چالش |
| PUT | `/api/challenges/:id` | ویرایش |
| POST | `/api/challenges/:id/checkin` | چک‌این |
| PATCH | `/api/challenges/:id/cancel` | لغو |
| PATCH | `/api/challenges/:id/reactivate` | فعال‌سازی |
| DELETE | `/api/challenges/:id` | حذف |

### 🔔 Reminders (۵)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reminders` | لیست یادآورها |
| POST | `/api/reminders` | ساخت |
| PUT | `/api/reminders/:id` | ویرایش |
| PATCH | `/api/reminders/:id/toggle` | فعال/غیرفعال |
| DELETE | `/api/reminders/:id` | حذف |

### 🏋️ Exercises (۳)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/exercises` | لیست حرکات |
| GET | `/api/exercises/categories` | دسته‌بندی‌ها |
| GET | `/api/exercises/:id` | یک حرکت |

### 🍽️ Foods (۳)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/foods` | لیست غذاها |
| GET | `/api/foods/brands` | برندها |
| GET | `/api/foods/:id` | یک غذا |

### 📊 Analytics (۵)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats` | آمار داشبورد |
| GET | `/api/report/weekly` | گزارش هفتگی |
| GET | `/api/achievements` | مدال‌ها |
| GET | `/api/xp` | XP و سطح |
| GET | `/api/xp/summary` | خلاصه XP |

### 🔮 Predictions (۱)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/predictions` | پیش‌بینی‌های هوشمند |

### 🧮 Calculations (۴)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/calculations` | محاسبات کامل از پروفایل |
| POST | `/api/calculations/instant` | محاسبه‌ی آنی |
| POST | `/api/calculations/workout-calories` | کالری سوزانده‌شده |
| POST | `/api/calculations/body-fat` | تخمین چربی بدن (Navy) |

### 👨‍🏫 Coach (۷)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/coach/activate` | فعال‌سازی حالت مربی |
| GET | `/api/coach/info` | اطلاعات مربی + شاگردها |
| POST | `/api/coach/regenerate-code` | ساخت کد جدید |
| POST | `/api/coach/join` | عضویت با کد |
| GET | `/api/coach/my-coaches` | لیست مربی‌ها (برای شاگرد) |
| DELETE | `/api/coach/students/:studentId` | حذف شاگرد |
| DELETE | `/api/coach/coaches/:coachId` | قطع ارتباط با مربی |

### 📋 Programs (۸)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/programs` | لیست برنامه‌های مربی |
| POST | `/api/programs` | ساخت برنامه |
| GET | `/api/programs/:id` | جزئیات برنامه |
| PUT | `/api/programs/:id` | ویرایش هوشمند (حفظ تاریخچه) |
| DELETE | `/api/programs/:id` | حذف |
| POST | `/api/programs/:id/assign` | دادن به شاگرد |
| DELETE | `/api/programs/assignments/:assignmentId` | پس گرفتن |
| GET | `/api/programs/assigned` | برنامه‌های دریافتی (برای شاگرد) |

### ✅ Program Progress (۷)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/progress-program/assignment/:assignmentId/day/:dayId` | گرفتن یا ساختن progress |
| PUT | `/api/progress-program/:progressId/exercise/:exerciseId` | آپدیت حرکت |
| PUT | `/api/progress-program/:id` | آپدیت کل progress |
| GET | `/api/progress-program/assignment/:assignmentId/history` | تاریخچه |
| GET | `/api/progress-program/summary/me` | خلاصه‌ی پیشرفت خودم |
| GET | `/api/progress-program/student/:studentId` | پیشرفت شاگرد (برای مربی) |
| GET | `/api/progress-program/detail/:progressId` | جزئیات یک progress |

### 📥 Export (۵)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/export/workouts` | خروجی تمرینات |
| GET | `/api/export/nutrition` | خروجی تغذیه |
| GET | `/api/export/weight` | خروجی وزن |
| GET | `/api/export/water` | خروجی آب |
| GET | `/api/export/goals` | خروجی اهداف |

</details>

</div>

---

<div align="center">

## 🌐

</div>

---

<div dir="ltr">

## 📖 English

### 🎯 About

**Fitness App** is a complete and modern application for tracking your workouts, nutrition, water intake, weight, and goals. Built with modern technologies, featuring **31 UI pages**, **25 database models**, and **85+ API endpoints**.

**Key Highlights:**
- 🌐 **Bilingual** (Persian + English) with instant switching
- 📱 **PWA** — installable on phone and desktop
- 🌙 **Dark Mode** with persistence
- 🔒 **Security** — bcrypt + JWT + Rate Limiting
- ⚡ **Fast** — Lazy Loading + Smart Caching
- 🕐 **Smart Timezone** — all dates based on Asia/Tehran
- 👨‍🏫 **Coach & Student system** with unique invite codes
- 🧮 **12 advanced body calculations** (BMI, BMR, TDEE, WHtR, etc.)

### ✨ Features

<table>
<tr>
<td width="50%">

#### 🏋️ Workout Tracking
- Create, edit, and delete workouts
- Add multiple exercises per workout
- **Completion checkbox** (Completed/Not Completed)
- **61 pre-loaded exercises** with MET values
- Smart exercise picker with search
- Save workouts as **templates** for quick reuse
- Log workouts for **past dates**
- Auto-calculate calories burned via MET formula

#### 🍎 Nutrition Logging
- Log meals by category (Breakfast, Lunch, Dinner, Snack)
- Track calories, protein, carbs, and fat
- Daily summaries
- Search in **50+ food catalog**

#### 💧 Water Intake
- Track daily water consumption
- Customizable daily goal
- Visual progress ring
- Weekly statistics

#### ⚖️ Weight Progress
- Log weight for **any date**
- Interactive line chart
- Stats: current, start, change, min, max

#### 📏 Body Measurements
- Track **10 measurements** (neck, chest, shoulder, waist, hips, bicep, forearm, wrist, thigh, calf)
- Track changes with up/down indicators
- Full history

</td>
<td width="50%">

#### 🎯 Goals
- Create goals with categories
- Visual progress bars
- Auto-complete when target reached
- Deadline support

#### 🏆 Achievements
- **18 unlockable badges** across 6 categories
- Medal system (bronze, silver, gold, diamond)
- Filter by category

#### 🥇 Challenges
- Create challenges with daily targets
- Daily check-in
- 6 pre-built challenges
- Streak tracking

#### 🔔 Reminders
- Create reminders with time
- Custom weekdays
- Browser notifications
- 6 pre-built reminders

#### 📊 Analytics & Reports
- Personalized dashboard
- **Streak counter** for workouts, water, weight
- Weekly report with **5 interactive charts**

#### 🔮 Smart Predictions
- Weight prediction via **Linear Regression**
- Goal completion date estimate
- Calories and water predictions
- Goal trend analysis

#### 📈 XP & Level System
- **7 activities** to earn XP
- 6 ranks (Beginner to Superhero)
- Rank roadmap
- XP breakdown view

#### 🧮 Advanced Body Calculations
- **BMI** with color-coded chart
- **BMR** (Mifflin-St Jeor formula)
- **TDEE** with activity multiplier
- **Target Calories** based on goal
- **Macros** (Protein, Carbs, Fat)
- **Daily Water Goal** — auto
- **Body Fat %** (Navy formula)
- **Lean Body Mass**
- **Skeletal Muscle Mass** (SMM)
- **FFMI** (Fat-Free Mass Index)
- **Waist-to-Hip Ratio** (WHR)
- **Waist-to-Height Ratio** (WHtR) — more accurate than BMI
- **Visceral Fat**
- **Shoulder-to-Waist Ratio** (V-Taper)
- **Upper/Lower Body Symmetry**
- **Somatotype** (Ecto/Meso/Endo)
- **Frame Size** (Small/Medium/Large)
- **Metabolic Age** — how old your body functions as
- **Health Score** (0 to 100)

#### 👨‍🏫 Coach & Student System
- Activate coach mode with **unique code** (e.g. `FIT-A3B5C7`)
- Students join via code
- Manage student list
- Bidirectional disconnect

#### 📋 Training Programs
- Create **Weekly / Daily / Periodic** programs
- Define days and exercises with sets, reps, weight, rest, notes
- Save as **templates** for reuse
- Assign program to **multiple students**
- Smart edit (preserves student history)

#### ✅ Student Workout Checklist
- View assigned program
- Check off each exercise
- Log actual values (sets, reps, weight, time)
- Personal note per exercise
- Selectable date (default: today)

#### 📈 Student Progress Chart (for Coach)
- Stat cards (total sessions, completed, %)
- Weekly activity chart
- Session list with full details
- View each session (which exercises, how long)

#### 📥 Data Export
- Export all data to CSV
- Full UTF-8 Persian support

</td>
</tr>
</table>

### 🛠️ Tech Stack

**Backend:**
| Technology | Purpose |
|-----------|---------|
| Node.js + Express | REST API |
| TypeScript | Type Safety |
| Prisma ORM | Database Layer |
| PostgreSQL | Main Database |
| JWT + bcrypt | Authentication |
| Helmet + express-rate-limit | Security |
| express-validator | Validation |
| Intl API | Date handling |

**Frontend:**
| Technology | Purpose |
|-----------|---------|
| React 19 | UI Library |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Tailwind CSS 4 | Styling |
| React Router 6 | Routing |
| TanStack Query 5 | Data Fetching + Cache |
| Zustand | State Management |
| React Hook Form | Form Handling |
| Recharts | Charts |
| vite-plugin-pwa | PWA Support |
| Lucide React | Icons |


### 🚀 Getting Started

#### Prerequisites
- Node.js >= 18
- PostgreSQL >= 14
- npm or yarn

#### 1. Clone

```bash
git clone https://github.com/amirjavarsineh/fitness-app.git
cd fitness-app
```

#### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/fitness_db?schema=public"
SHADOW_DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/fitness_shadow_db?schema=public"
JWT_SECRET="your-super-secret-key-min-32-chars"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Then:

```bash
npx prisma migrate dev
npx prisma generate
npm run seed        # Import 61 exercises + 50+ foods
npm run dev
```

Server runs at `http://localhost:5000`.

#### 3. Frontend Setup

```bash
cd ../frontend
npm install
cp .env.example .env
```

Content:

```env
VITE_API_URL=http://localhost:5000/api
```

Then:

```bash
npm run dev
```

App runs at `http://localhost:5173`.

### 📱 PWA

The application is fully **PWA-enabled** and can be installed on mobile and desktop:

- ✅ **Offline Support** — assets caching
- ✅ **Installable** — automatic install banner
- ✅ **Standalone Display** — like a native app
- ✅ **Auto Update** — new versions auto-apply
- ✅ **RTL Support** — Persian-friendly
- ✅ **Theme Color** — browser bar matches app
- ✅ **Dedicated install page** — step-by-step guide for Android/iOS/Desktop

**Install:**
1. Open app in browser
2. "Install App" banner appears → click "Install"
3. Or go to the **"Install App"** page from the menu and follow device-specific steps
4. App added to home screen

### 🌐 Bilingual (i18n)

- **Persian (default)** with full RTL support
- **English (LTR)** for international users
- **Instant switching** without refresh
- **Preference saved** in localStorage
- **Smart numbers** — Persian: ۱۲۳ / English: 123
- **Complete translation** of all pages, error messages, and notifications

### 🔒 Security

- ✅ Password hashing with **bcrypt** (cost 12)
- ✅ **JWT** authentication
- ✅ **Rate limiting** on sensitive endpoints
- ✅ Security headers via **Helmet**
- ✅ Request body size limits (10kb)
- ✅ **CORS** restricted to frontend origin
- ✅ Input validation on all endpoints
- ✅ SQL injection protection via Prisma
- ✅ **Ownership check** — all queries filtered by `userId`

**Note:** For production, HttpOnly Cookies, Refresh Tokens, Email Verification, and 2FA are recommended.

### 🕐 Date & Timezone Handling

- All dates computed based on **Asia/Tehran**
- Daily records (water, weight, check-in) stored at Tehran midnight
- Charts formatted based on user's locale
- `dateKeyToDbDate` helper for correct storage in `@db.Date` columns

### 🚢 Deployment

#### Frontend → Vercel / Netlify

```bash
cd frontend
npm run build
```

**On Vercel:**
1. Connect repo to Vercel
2. Environment: `VITE_API_URL=https://your-backend.com/api`
3. Deploy

**On Netlify:** Same as Vercel

#### Backend → Render / Railway

**On Render:**
1. New Web Service
2. Build Command: `npm install && npx prisma generate && npm run build`
3. Start Command: `npm start`
4. Environment Variables:
   - `DATABASE_URL` (from Neon/Supabase)
   - `JWT_SECRET` (min 32 chars)
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://your-frontend.vercel.app`

#### Database → Neon / Supabase

- Free tier: **500MB - 1GB**
- Copy connection string to `DATABASE_URL`

**Cost Estimate:**
| Scenario | Monthly |
|----------|---------|
| Fully free | $0 |
| Budget (no cold start) | $5 - $15 |
| Production | $25 - $45 |

### 🗺️ Roadmap

- [ ] **Social Login** (Google, Apple)
- [ ] **Email Verification** + **Password Reset**
- [ ] **2FA** (optional with TOTP)
- [ ] **Coach-Student messaging**
- [ ] **Coach comments on sessions**
- [ ] **Nutrition plan by coach**
- [ ] **XP for program check-ins**
- [ ] **Share workouts** with friends
- [ ] **AI Workout Planning**
- [ ] **Apple Health / Google Fit** integration
- [ ] **Mobile App** (React Native)
- [ ] **Admin Dashboard**
- [ ] **Tests** (Jest + Playwright)
- [ ] **GraphQL API** (optional)

### 🐛 Troubleshooting

<details>
<summary><b>Database Connection Refused</b></summary>

Make sure PostgreSQL is running:
```bash
# Windows
services.msc → PostgreSQL running

# macOS
brew services list

# Linux
sudo systemctl status postgresql
```
</details>

<details>
<summary><b>Prisma Client not found</b></summary>

```bash
cd backend
npx prisma generate
```
</details>

<details>
<summary><b>CORS error in frontend</b></summary>

- Ensure `FRONTEND_URL` is set correctly in backend
- Ensure `VITE_API_URL` is set correctly in frontend
- Restart servers after `.env` changes
</details>

<details>
<summary><b>Dates saved incorrectly</b></summary>

All dates should follow **Asia/Tehran** timezone. If server is UTC, this is expected and handled by the code. Check `backend/src/lib/dates.ts` if issues persist.
</details>

<details>
<summary><b>PWA not installing</b></summary>

- Works only over **HTTPS** or **localhost**
- Ensure `vite-plugin-pwa` is properly configured
- In Chrome: DevTools → Application → Manifest
- For dev mode, set `devOptions.enabled` to `true`
</details>

<details>
<summary><b>Cannot assign program to new student</b></summary>

- Make sure the student is connected to you (from the "Coach" page)
- If the issue persists, refresh the page (`Ctrl + Shift + R`) — this refetches the student list
</details>

<details>
<summary><b>Student history erased after editing program</b></summary>

This is fixed in the latest version. `updateProgram` now **smartly** updates only what changed and preserves the IDs of days and exercises.
</details>

### 📸 Screenshots

*(Coming soon)*

Want to contribute a screenshot? Feel free to open a PR.

### 📄 License

Released under the **MIT License**. See [LICENSE](LICENSE) for details.

### 🤝 Contributing

Suggestions, bug reports, and PRs are welcome!

1. Fork
2. Create branch (`git checkout -b feature/amazing`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing`)
5. Open Pull Request

---

## 📡 API Endpoints

<details>
<summary><b>🔽 Click to expand full list</b></summary>

### 🔐 Auth (3)
| Method | Endpoint |
|--------|----------|
| POST | `/api/auth/register` |
| POST | `/api/auth/login` |
| GET | `/api/auth/me` |

### 👤 Profile (2)
| Method | Endpoint |
|--------|----------|
| GET | `/api/profile` |
| PUT | `/api/profile` |

### 🏋️ Workouts (8)
| Method | Endpoint |
|--------|----------|
| GET | `/api/workouts` |
| GET | `/api/workouts/templates` |
| POST | `/api/workouts/templates/:id/use` |
| GET | `/api/workouts/:id` |
| POST | `/api/workouts` |
| PUT | `/api/workouts/:id` |
| PATCH | `/api/workouts/:id/toggle-complete` |
| DELETE | `/api/workouts/:id` |

### 🍎 Nutrition (4)
| Method | Endpoint |
|--------|----------|
| GET | `/api/nutrition` |
| POST | `/api/nutrition` |
| PUT | `/api/nutrition/:id` |
| DELETE | `/api/nutrition/:id` |

### 💧 Water (5)
| Method | Endpoint |
|--------|----------|
| GET | `/api/water/today` |
| GET | `/api/water/stats` |
| POST | `/api/water/add` |
| PUT | `/api/water/goal` |
| DELETE | `/api/water/today` |

### ⚖️ Progress (4)
| Method | Endpoint |
|--------|----------|
| GET | `/api/progress/weight` |
| GET | `/api/progress/weight/stats` |
| POST | `/api/progress/weight` |
| DELETE | `/api/progress/weight/:id` |

### 📏 Measurements (4)
| Method | Endpoint |
|--------|----------|
| GET | `/api/measurements` |
| GET | `/api/measurements/stats` |
| POST | `/api/measurements` |
| DELETE | `/api/measurements/:id` |

### 🎯 Goals (5)
| Method | Endpoint |
|--------|----------|
| GET | `/api/goals` |
| GET | `/api/goals/:id` |
| POST | `/api/goals` |
| PUT | `/api/goals/:id` |
| DELETE | `/api/goals/:id` |

### 🥇 Challenges (7)
| Method | Endpoint |
|--------|----------|
| GET | `/api/challenges` |
| POST | `/api/challenges` |
| PUT | `/api/challenges/:id` |
| POST | `/api/challenges/:id/checkin` |
| PATCH | `/api/challenges/:id/cancel` |
| PATCH | `/api/challenges/:id/reactivate` |
| DELETE | `/api/challenges/:id` |

### 🔔 Reminders (5)
| Method | Endpoint |
|--------|----------|
| GET | `/api/reminders` |
| POST | `/api/reminders` |
| PUT | `/api/reminders/:id` |
| PATCH | `/api/reminders/:id/toggle` |
| DELETE | `/api/reminders/:id` |

### 🏋️ Exercises (3)
| Method | Endpoint |
|--------|----------|
| GET | `/api/exercises` |
| GET | `/api/exercises/categories` |
| GET | `/api/exercises/:id` |

### 🍽️ Foods (3)
| Method | Endpoint |
|--------|----------|
| GET | `/api/foods` |
| GET | `/api/foods/brands` |
| GET | `/api/foods/:id` |

### 📊 Analytics (5)
| Method | Endpoint |
|--------|----------|
| GET | `/api/stats` |
| GET | `/api/report/weekly` |
| GET | `/api/achievements` |
| GET | `/api/xp` |
| GET | `/api/xp/summary` |

### 🔮 Predictions (1)
| Method | Endpoint |
|--------|----------|
| GET | `/api/predictions` |

### 🧮 Calculations (4)
| Method | Endpoint |
|--------|----------|
| GET | `/api/calculations` |
| POST | `/api/calculations/instant` |
| POST | `/api/calculations/workout-calories` |
| POST | `/api/calculations/body-fat` |

### 👨‍🏫 Coach (7)
| Method | Endpoint |
|--------|----------|
| POST | `/api/coach/activate` |
| GET | `/api/coach/info` |
| POST | `/api/coach/regenerate-code` |
| POST | `/api/coach/join` |
| GET | `/api/coach/my-coaches` |
| DELETE | `/api/coach/students/:studentId` |
| DELETE | `/api/coach/coaches/:coachId` |

### 📋 Programs (8)
| Method | Endpoint |
|--------|----------|
| GET | `/api/programs` |
| POST | `/api/programs` |
| GET | `/api/programs/:id` |
| PUT | `/api/programs/:id` |
| DELETE | `/api/programs/:id` |
| POST | `/api/programs/:id/assign` |
| DELETE | `/api/programs/assignments/:assignmentId` |
| GET | `/api/programs/assigned` |

### ✅ Program Progress (7)
| Method | Endpoint |
|--------|----------|
| GET | `/api/progress-program/assignment/:assignmentId/day/:dayId` |
| PUT | `/api/progress-program/:progressId/exercise/:exerciseId` |
| PUT | `/api/progress-program/:id` |
| GET | `/api/progress-program/assignment/:assignmentId/history` |
| GET | `/api/progress-program/summary/me` |
| GET | `/api/progress-program/student/:studentId` |
| GET | `/api/progress-program/detail/:progressId` |

### 📥 Export (5)
| Method | Endpoint |
|--------|----------|
| GET | `/api/export/workouts` |
| GET | `/api/export/nutrition` |
| GET | `/api/export/weight` |
| GET | `/api/export/water` |
| GET | `/api/export/goals` |

</details>

</div>

---

<div align="center">

## 👤 Author | نویسنده

**Amir Javarsineh** — [@amirjavarsineh](https://github.com/amirjavarsineh)

---

⭐ **If you like this project, give it a star!**
⭐ **اگه این پروژه رو دوست داشتی، یه ستاره بده!**



</div>