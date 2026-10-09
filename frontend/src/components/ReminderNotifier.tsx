import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reminderService, type Reminder } from '../services/reminder.service';

function shouldNotifyToday(days: string): boolean {
  const today = new Date().getDay(); // 0=Sunday (یکشنبه در استاندارد میلادی)
  // توی ایران شنبه شروع هفته‌ست: شنبه=6, یکشنبه=0, دوشنبه=1, سه‌شنبه=2, چهارشنبه=3, پنجشنبه=4, جمعه=5
  // ولی ما از getDay() استفاده می‌کنیم: 0=Sunday, 1=Monday, ..., 6=Saturday

  if (days === 'ALL') return true;
  if (days === 'WEEKDAYS') {
    // شنبه تا چهارشنبه = Saturday(6), Sunday(0), Monday(1), Tuesday(2), Wednesday(3)
    return [6, 0, 1, 2, 3].includes(today);
  }
  if (days === 'WEEKENDS') {
    // پنجشنبه و جمعه = Thursday(4), Friday(5)
    return [4, 5].includes(today);
  }
  return true;
}

function getCurrentTime(): string {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export default function ReminderNotifier() {
  const notifiedRef = useRef<Set<string>>(new Set());

  // درخواست اجازه‌ی نوتیفیکیشن
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      setTimeout(() => {
        Notification.requestPermission();
      }, 5000);
    }
  }, []);

  const { data: reminders } = useQuery({
    queryKey: ['reminders'],
    queryFn: reminderService.getAll,
    refetchInterval: 60000, // هر دقیقه
  });

  useEffect(() => {
    if (!reminders) return;

    const checkReminders = () => {
      const now = getCurrentTime();
      const todayKey = new Date().toISOString().slice(0, 10);

      for (const reminder of reminders) {
        if (!reminder.enabled) continue;
        if (!shouldNotifyToday(reminder.days)) continue;

        // چک کن ساعتش رسیده یا نه
        if (reminder.time !== now) continue;

        // چک کن امروز قبلاً اعلان داده نشده
        const key = `${reminder.id}-${todayKey}`;
        if (notifiedRef.current.has(key)) continue;

        // ذخیره کن که امروز اعلان دادیم
        notifiedRef.current.add(key);
        localStorage.setItem(`reminder-notified-${key}`, 'true');

        // نمایش اعلان
        showNotification(reminder);
      }
    };

    // چک فوری
    checkReminders();

    // چک هر 30 ثانیه
    const interval = setInterval(checkReminders, 30000);
    return () => clearInterval(interval);
  }, [reminders]);

  // چک کن که کدوم‌ها امروز قبلاً اعلان داده شده
  useEffect(() => {
    const todayKey = new Date().toISOString().slice(0, 10);
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('reminder-notified-') && key.endsWith(todayKey)) {
        const id = key
          .replace('reminder-notified-', '')
          .replace(`-${todayKey}`, '');
        keys.push(id);
      }
    }
    keys.forEach((k) => notifiedRef.current.add(k));
  }, []);

  return null; // این کامپوننت چیزی نشون نمی‌ده
}

function showNotification(reminder: Reminder) {
  const title = `🔔 ${reminder.title}`;
  const body = reminder.message || 'وقتشه!';

  // اگه مرورگر پشتیبانی می‌کنه
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body,
      icon: '/icons/icon.svg',
      badge: '/icons/icon.svg',
      tag: reminder.id,
      requireInteraction: true,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  } else {
    // اگه نوتیفیکیشن پشتیبانی نمی‌شه، از alert استفاده کن
    alert(`${title}\n\n${body}`);
  }
}