import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { addHours, format, formatISO, parseISO } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert time between timezones
export function convertTime(
  time: string | Date,
  fromTimeZone: string,
  toTimeZone: string
): Date {
  // If string is provided, parse it first
  const date = typeof time === "string" ? parseISO(time) : time;
  
  // Convert to UTC first
  const utcDate = fromZonedTime(date, fromTimeZone);
  
  // Then convert to target timezone
  return toZonedTime(utcDate, toTimeZone);
}

// Format time for display with timezone
export function formatTimeWithZone(
  date: Date | string,
  timezone: string,
  formatStr = "h:mm a"
): string {
  const zonedDate = typeof date === "string" 
    ? toZonedTime(parseISO(date), timezone)
    : toZonedTime(date, timezone);
  
  return format(zonedDate, formatStr);
}

// Format date for API
export function formatDateForAPI(date: Date): string {
  return formatISO(date);
}

// Calculate time difference between two timezones
export function getTimezoneDifference(timezone1: string, timezone2: string): number {
  const now = new Date();
  const time1 = toZonedTime(now, timezone1);
  const time2 = toZonedTime(now, timezone2);
  
  // Calculate difference in hours
  const diffInMs = time2.getTime() - time1.getTime();
  return Math.round(diffInMs / (1000 * 60 * 60));
}

// Format timezone difference for display
export function formatTimezoneDifference(hourDiff: number): string {
  if (hourDiff === 0) return "same time";
  const sign = hourDiff > 0 ? "+" : "";
  return `${sign}${hourDiff} hours`;
}

// Get readable time range
export function getTimeRange(startTime: string | Date, endTime: string | Date, timezone: string): string {
  return `${formatTimeWithZone(startTime, timezone)} - ${formatTimeWithZone(endTime, timezone)}`;
}

// Format date for display
export function formatDate(date: Date | string, formatStr = "PP"): string {
  const parsedDate = typeof date === "string" ? parseISO(date) : date;
  return format(parsedDate, formatStr);
}

// Check if today
export function isToday(date: Date | string): boolean {
  const today = new Date();
  const checkDate = typeof date === "string" ? parseISO(date) : date;
  
  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  );
}

// Check if tomorrow
export function isTomorrow(date: Date | string): boolean {
  const tomorrow = addHours(new Date(), 24);
  const checkDate = typeof date === "string" ? parseISO(date) : date;
  
  return (
    checkDate.getDate() === tomorrow.getDate() &&
    checkDate.getMonth() === tomorrow.getMonth() &&
    checkDate.getFullYear() === tomorrow.getFullYear()
  );
}

// Get relative day label (Today, Tomorrow, or date)
export function getRelativeDayLabel(date: Date | string): string {
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  
  return formatDate(date, "PP");
}
