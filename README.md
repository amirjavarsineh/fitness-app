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

[🇬🇧 English](#-english) • [🇮🇷 فارسی](#-فارسی)

</div>

---

<div dir="rtl">

## 📖 فارسی

### 🎯 درباره پروژه

**اپلیکیشن تناسب اندام** یک برنامه‌ی کامل و مدرن برای ردیابی تمرینات، تغذیه، آب، وزن و اهداف شماست. این پروژه با تکنولوژی‌های روز ساخته شده و شامل **۱۳ صفحه‌ی کاربری**، **۱۵+ مدل دیتابیس**، و **۵۰+ API Endpoint** می‌باشد.

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

#### 🍎 ثبت تغذیه
- ثبت غذا بر اساس وعده (صبحانه، ناهار، شام، میان‌وعده)
- پیگیری کالری، پروتئین، کربوهیدرات و چربی
- خلاصه‌ی روزانه

#### 💧 مصرف آب
- ردیابی مصرف روزانه‌ی آب
- هدف سفارشی روزانه
- نمودار حلقه‌ای پیشرفت
- آمار هفتگی

#### ⚖️ پیشرفت وزن
- ثبت وزن روزانه
- نمودار خطی تعاملی
- آمار: وزن فعلی، شروع، تغییر، کمینه، بیشینه

</td>
<td width="50%">

#### 🎯 اهداف
- ساخت هدف با دسته‌بندی (وزن، کالری، عضله‌سازی و...)
- نوار پیشرفت بصری
- تکمیل خودکار وقتی به هدف رسیدی
- پشتیبانی از مهلت

#### 🏆 مدال‌ها و دستاوردها
- **۱۸ مدال** در ۶ دسته
- سیستم مدال (برنز، نقره، طلا، الماس)
- فیلتر بر اساس دسته

#### 📊 داشبورد و گزارش
- داشبورد شخصی‌سازی‌شده
- **شمارنده روزهای پیوسته** (Streak)
- گزارش هفتگی با **۵ نمودار تعاملی**

#### 📥 دانلود داده‌ها
- خروجی همه‌ی داده‌ها به فرمت CSV
- پشتیبانی کامل از فارسی (UTF-8)

#### 🎨 رابط کاربری
- 🌙 **حالت تاریک** با ذخیره‌ی ترجیح
- 📱 **کاملاً Responsive**
- ✨ انیمیشن‌های روان
- 🌐 **فارسی** با پشتیبانی RTL

</td>
</tr>
</table>

### 🛠️ تکنولوژی‌ها

**Backend:**
- Node.js + Express — REST API
- TypeScript — Type Safety
- Prisma ORM + PostgreSQL — دیتابیس
- JWT + bcrypt — احراز هویت
- Helmet + express-rate-limit — امنیت

**Frontend:**
- React 19 + TypeScript
- Vite — Build Tool
- Tailwind CSS — استایل
- React Router + TanStack Query + Zustand
- React Hook Form + Recharts

### 📁 ساختار پروژه

```
fitness-app/
├── backend/               # سرور (Node.js + Express)
│   ├── prisma/           # اسکیما و Migration ها
│   ├── src/
│   │   ├── controllers/  # کنترلرها
│   │   ├── routes/       # مسیرها
│   │   ├── services/     # منطق تجاری
│   │   └── middlewares/  # میدل‌ورها
│   └── .env.example
│
└── frontend/              # کلاینت (React + Vite)
    ├── src/
    │   ├── pages/        # صفحات
    │   ├── components/   # کامپوننت‌ها
    │   ├── services/     # سرویس‌های API
    │   ├── store/        # State Management
    │   └── utils/        # ابزارها
    └── .env.example
```

### 🚀 راه‌اندازی

#### پیش‌نیازها
- Node.js >= 18
- PostgreSQL >= 14
- npm

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
JWT_SECRET="your-super-secret-key"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

سپس:

```bash
npx prisma migrate dev
npx prisma generate
npm run seed
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

### 🔒 امنیت

- ✅ هش رمز با **bcrypt** (cost 12)
- ✅ احراز هویت با **JWT**
- ✅ **Rate Limiting** روی مسیرهای حساس
- ✅ هدرهای امنیتی با **Helmet**
- ✅ محدودیت حجم بدنه درخواست
- ✅ **CORS** محدود به دامنه فرانت‌اند
- ✅ اعتبارسنجی ورودی‌ها
- ✅ جلوگیری از SQL Injection با Prisma

### 📸 اسکرین‌شات‌ها

*(به‌زودی اضافه می‌شود)*

</div>

---

<div align="center">

## 🌐

</div>

---

<div dir="ltr">

## 📖 English

### 🎯 About

**Fitness App** is a complete and modern application for tracking your workouts, nutrition, water intake, weight, and goals. Built with modern technologies, featuring **13 UI pages**, **15+ database models**, and **50+ API endpoints**.

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

#### 🍎 Nutrition Logging
- Log meals by category (Breakfast, Lunch, Dinner, Snack)
- Track calories, protein, carbs, and fat
- Daily summaries

#### 💧 Water Intake
- Track daily water consumption
- Customizable daily goal
- Visual progress ring
- Weekly statistics

#### ⚖️ Weight Progress
- Log daily weight
- Interactive line chart
- Stats: current, start, change, min, max

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

#### 📊 Analytics & Reports
- Personalized dashboard
- **Streak counter** for workouts, water, weight
- Weekly report with **5 interactive charts**

#### 📥 Data Export
- Export all data to CSV
- Full UTF-8 Persian support

#### 🎨 UI/UX
- 🌙 **Dark Mode** with persistence
- 📱 **Fully responsive**
- ✨ Smooth animations
- 🌐 **Persian (Farsi)** with RTL support

</td>
</tr>
</table>

### 🛠️ Tech Stack

**Backend:**
- Node.js + Express — REST API
- TypeScript — Type safety
- Prisma ORM + PostgreSQL — Database
- JWT + bcrypt — Authentication
- Helmet + express-rate-limit — Security

**Frontend:**
- React 19 + TypeScript
- Vite — Build tool
- Tailwind CSS — Styling
- React Router + TanStack Query + Zustand
- React Hook Form + Recharts

### 📁 Project Structure

```
fitness-app/
├── backend/               # Server (Node.js + Express)
│   ├── prisma/           # Schema & migrations
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── middlewares/  # Middlewares
│   └── .env.example
│
└── frontend/              # Client (React + Vite)
    ├── src/
    │   ├── pages/        # Page components
    │   ├── components/   # Reusable components
    │   ├── services/     # API services
    │   ├── store/        # State management
    │   └── utils/        # Utilities
    └── .env.example
```

### 🚀 Getting Started

#### Prerequisites
- Node.js >= 18
- PostgreSQL >= 14
- npm

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
JWT_SECRET="your-super-secret-key"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Then:

```bash
npx prisma migrate dev
npx prisma generate
npm run seed
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

### 🔒 Security

- ✅ Password hashing with **bcrypt** (cost 12)
- ✅ **JWT** authentication
- ✅ **Rate limiting** on sensitive endpoints
- ✅ Security headers via **Helmet**
- ✅ Request body size limits
- ✅ **CORS** restricted to frontend origin
- ✅ Input validation on all endpoints
- ✅ SQL injection protection via Prisma

### 📸 Screenshots

*(Coming soon)*

</div>

---

## 📡 API Endpoints

<details>
<summary><b>🔽 Click to expand | برای دیدن کلیک کن</b></summary>

### 🔐 Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### 🏋️ Workouts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workouts` | List workouts |
| GET | `/api/workouts/templates` | List templates |
| POST | `/api/workouts` | Create workout |
| POST | `/api/workouts/templates/:id/use` | Use template |
| GET | `/api/workouts/:id` | Get workout |
| PUT | `/api/workouts/:id` | Update workout |
| DELETE | `/api/workouts/:id` | Delete workout |

### 🍎 Nutrition
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/nutrition` | List logs |
| POST | `/api/nutrition` | Create log |
| PUT | `/api/nutrition/:id` | Update log |
| DELETE | `/api/nutrition/:id` | Delete log |

### 💧 Water
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/water/today` | Today's water |
| GET | `/api/water/stats` | Weekly stats |
| POST | `/api/water/add` | Add water |
| PUT | `/api/water/goal` | Update goal |

### ⚖️ Progress
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/progress/weight` | List weights |
| GET | `/api/progress/weight/stats` | Weight stats |
| POST | `/api/progress/weight` | Add weight |

### 🎯 Goals
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/goals` | List goals |
| POST | `/api/goals` | Create goal |
| PUT | `/api/goals/:id` | Update goal |
| DELETE | `/api/goals/:id` | Delete goal |

### 🏋️ Exercises
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/exercises` | List exercises |
| GET | `/api/exercises/categories` | Get categories |

### 📊 Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats` | Dashboard stats |
| GET | `/api/report/weekly` | Weekly report |
| GET | `/api/achievements` | Achievements |

### 📥 Export
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/export/workouts` | Export workouts |
| GET | `/api/export/nutrition` | Export nutrition |
| GET | `/api/export/weight` | Export weight |
| GET | `/api/export/water` | Export water |
| GET | `/api/export/goals` | Export goals |

</details>

---

<div align="center">

## 👤 Author | نویسنده

**Amir Javarsineh** — [@amirjavarsineh](https://github.com/amirjavarsineh)

---

⭐ **If you like this project, give it a star!**
⭐ **اگه این پروژه رو دوست داشتی، یه ستاره بده!**



</div>