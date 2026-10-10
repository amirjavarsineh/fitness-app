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

**اپلیکیشن تناسب اندام** یک برنامه‌ی کامل و مدرن برای ردیابی تمرینات، تغذیه، آب، وزن و اهداف شماست. این پروژه با تکنولوژی‌های روز ساخته شده و شامل **۱۹ صفحه‌ی کاربری**، **۱۶ مدل دیتابیس**، و **۶۰+ API Endpoint** می‌باشد.

**ویژگی‌های کلیدی:**
- 🌐 **دوزبانه** (فارسی + انگلیسی) با تغییر لحظه‌ای
- 📱 **PWA** — قابل نصب روی گوشی و دسکتاپ
- 🌙 **حالت تاریک** با ذخیره‌ی ترجیح
- 🔒 **امنیت** — bcrypt + JWT + Rate Limiting
- ⚡ **سریع** — Lazy Loading + Smart Caching
- 🕐 **Timezone هوشمند** — همه‌ی تاریخ‌ها بر اساس Asia/Tehran

### ✨ امکانات

<table>
<tr>
<td width="50%">

#### 🏋️ ردیابی تمرینات
- ساخت، ویرایش و حذف تمرینات
- افزودن چند حرکت به هر تمرین
- کاتالوگ **۶۱ تمرین آماده** با مقادیر MET
- انتخاب‌گر هوشمند حرکت با جستجو
- ذخیره تمرین به‌عنوان **قالب** برای استفاده سریع
- ثبت تمرین برای **تاریخ‌های گذشته**

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
- ثبت وزن روزانه
- نمودار خطی تعاملی
- آمار: وزن فعلی، شروع، تغییر، کمینه، بیشینه

#### 📏 اندازه‌های بدن
- ثبت ۸ اندازه (گردن، سینه، کمر، باسن، بازو، ساعد، ران، ساق)
- پیگیری تغییرات
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

**نصب:**
1. اپ رو در مرورگر باز کن
2. بنر «نصب اپلیکیشن» ظاهر می‌شه → بزن «نصب کن»
3. اپ روی صفحه‌ی اصلی قرار می‌گیره

### 🌐 دوزبانه (i18n)

- **فارسی (پیش‌فرض)** با پشتیبانی کامل RTL
- **انگلیسی (LTR)** برای کاربران بین‌المللی
- **تغییر لحظه‌ای** بدون refresh
- **ذخیره‌ی ترجیح** در localStorage
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

**نکته:** برای محصول تجاری، HttpOnly Cookies، Refresh Token، Email Verification و 2FA توصیه می‌شود.

### 🕐 مدیریت تاریخ و Timezone

- همه‌ی تاریخ‌ها بر اساس **Asia/Tehran** محاسبه می‌شن
- رکوردهای روزانه (آب، وزن، چک‌این) در نیمه‌شب تهران ثبت می‌شن
- نمودارها با فرمت locale کاربر نمایش داده می‌شن

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

### 🏋️ Workouts (۷)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workouts` | لیست تمرینات |
| GET | `/api/workouts/templates` | لیست قالب‌ها |
| POST | `/api/workouts/templates/:id/use` | استفاده از قالب |
| GET | `/api/workouts/:id` | دریافت تمرین |
| POST | `/api/workouts` | ساخت تمرین |
| PUT | `/api/workouts/:id` | ویرایش تمرین |
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

**Fitness App** is a complete and modern application for tracking your workouts, nutrition, water intake, weight, and goals. Built with modern technologies, featuring **19 UI pages**, **16 database models**, and **60+ API endpoints**.

**Key Highlights:**
- 🌐 **Bilingual** (Persian + English) with instant switching
- 📱 **PWA** — installable on phone and desktop
- 🌙 **Dark Mode** with persistence
- 🔒 **Security** — bcrypt + JWT + Rate Limiting
- ⚡ **Fast** — Lazy Loading + Smart Caching
- 🕐 **Smart Timezone** — all dates based on Asia/Tehran

### ✨ Features

<table>
<tr>
<td width="50%">

#### 🏋️ Workout Tracking
- Create, edit, and delete workouts
- Add multiple exercises per workout
- **61 pre-loaded exercises** with MET values
- Smart exercise picker with search
- Save workouts as **templates** for quick reuse
- Log workouts for **past dates**

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
- Log daily weight
- Interactive line chart
- Stats: current, start, change, min, max

#### 📏 Body Measurements
- Track 8 measurements (neck, chest, waist, hips, bicep, forearm, thigh, calf)
- Track changes over time
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

**Install:**
1. Open app in browser
2. "Install App" banner appears → click "Install"
3. App added to home screen

### 🌐 Bilingual (i18n)

- **Persian (default)** with full RTL support
- **English (LTR)** for international users
- **Instant switching** without refresh
- **Preference saved** in localStorage
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

**Note:** For production, HttpOnly Cookies, Refresh Tokens, Email Verification, and 2FA are recommended.

### 🕐 Date & Timezone Handling

- All dates computed based on **Asia/Tehran**
- Daily records (water, weight, check-in) stored at Tehran midnight
- Charts formatted based on user's locale

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

### 🏋️ Workouts (7)
| Method | Endpoint |
|--------|----------|
| GET | `/api/workouts` |
| GET | `/api/workouts/templates` |
| POST | `/api/workouts/templates/:id/use` |
| GET | `/api/workouts/:id` |
| POST | `/api/workouts` |
| PUT | `/api/workouts/:id` |
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