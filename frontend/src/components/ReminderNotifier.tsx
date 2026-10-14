import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reminderService, type Reminder } from '../services/reminder.service';

function getLocalDateKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function shouldNotifyToday(days: string): boolean {
  const today = new Date().getDay();
  if (days === 'ALL') return true;
  if (days === 'WEEKDAYS') {
    return [6, 0, 1, 2, 3].includes(today);
  }
  if (days === 'WEEKENDS') {
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
    refetchInterval: 60000,
  });

  useEffect(() => {
    if (!reminders) return;

    const checkReminders = () => {
      const now = getCurrentTime();
      const todayKey = getLocalDateKey();

      for (const reminder of reminders) {
        if (!reminder.enabled) continue;
        if (!shouldNotifyToday(reminder.days)) continue;
        if (reminder.time !== now) continue;

        const key = `${reminder.id}-${todayKey}`;
        if (notifiedRef.current.has(key)) continue;

        notifiedRef.current.add(key);
        localStorage.setItem(`reminder-notified-${key}`, 'true');

        showNotification(reminder);
      }
    };

    checkReminders();
    const interval = setInterval(checkReminders, 30000);
    return () => clearInterval(interval);
  }, [reminders]);

  useEffect(() => {
    const todayKey = getLocalDateKey();
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

  return null;
}

function showNotification(reminder: Reminder) {
  const title = `🔔 ${reminder.title}`;
  const body = reminder.message || 'وقتشه!';

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
    alert(`${title}\n\n${body}`);
  }
}