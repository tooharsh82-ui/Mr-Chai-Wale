import { CartConfig } from '../data/cart';

/**
 * Checks if a phone or WhatsApp number is configured with real digits
 * (not a placeholder containing 'X').
 */
export function isPhoneNumberValid(phone?: string): boolean {
  if (!phone) return false;
  if (phone.includes('X') || phone.includes('x')) return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10;
}

/**
 * Formats a 24-hour time string ("06:30" or "22:00") into 12-hour format ("6:30 AM", "10:00 PM").
 */
export function format12Hour(time24: string): string {
  if (!time24 || !time24.includes(':')) return time24;
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr || '0', 10);
  const period = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  const mFormatted = m < 10 ? `0${m}` : `${m}`;
  return `${h}:${mFormatted} ${period}`;
}

/**
 * Computes live open/closed status in the Asia/Kolkata timezone, honoring statusOverride.
 */
export function getCartStatus(hours: CartConfig['hours']): {
  isOpen: boolean;
  pillText: string;
} {
  if (hours.statusOverride === 'open') {
    return {
      isOpen: true,
      pillText: `Open Now · Closes ${format12Hour(hours.close)}`,
    };
  }
  if (hours.statusOverride === 'closed') {
    return {
      isOpen: false,
      pillText: `Closed · Opens ${format12Hour(hours.open)}`,
    };
  }

  try {
    // Current time in Asia/Kolkata
    const now = new Date();
    const kolkataDateStr = now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    const kolkataDate = new Date(kolkataDateStr);

    const currentDay = kolkataDate.getDay(); // 0 = Sun, 1 = Mon ...
    const currentMinutes = kolkataDate.getHours() * 60 + kolkataDate.getMinutes();

    const [openH, openM] = hours.open.split(':').map(Number);
    const [closeH, closeM] = hours.close.split(':').map(Number);
    const openMinutes = openH * 60 + (openM || 0);
    // Treat a close time of "00:00" as 24:00 (1440 minutes)
    const closeMinutes =
      hours.close === '00:00' || (closeH === 0 && closeM === 0)
        ? 24 * 60
        : closeH * 60 + (closeM || 0);

    const isTodayOpenDay = hours.days.includes(currentDay);
    const isWithinHours = currentMinutes >= openMinutes && currentMinutes < closeMinutes;
    const isOpen = isTodayOpenDay && isWithinHours;

    if (isOpen) {
      return {
        isOpen: true,
        pillText: `Open Now · Closes ${format12Hour(hours.close)}`,
      };
    } else {
      return {
        isOpen: false,
        pillText: `Closed · Opens ${format12Hour(hours.open)}`,
      };
    }
  } catch {
    // Fallback if timezone resolution fails
    return {
      isOpen: true,
      pillText: `Open Today · ${format12Hour(hours.open)} - ${format12Hour(hours.close)}`,
    };
  }
}
