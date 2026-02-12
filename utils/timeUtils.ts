import { addHours, addMinutes, format, parse, differenceInMinutes, differenceInSeconds } from 'date-fns';

// Constants
export const WORK_HOURS = 8;
export const WORK_MINUTES = 35;

/**
 * Calculates the logout time based on a login time string (HH:mm)
 */
export const calculateLogoutTime = (loginTimeStr: string): Date => {
  const today = new Date();
  // Parse the input time ("09:00") into a Date object for today
  const startTime = parse(loginTimeStr, 'HH:mm', today);
  
  // Add 8 hours
  const withHours = addHours(startTime, WORK_HOURS);
  // Add 35 minutes
  const logoutTime = addMinutes(withHours, WORK_MINUTES);
  
  return logoutTime;
};

/**
 * Formats a Date object to 12-hour time string (e.g., "05:35 PM")
 */
export const formatTimeDisplay = (date: Date): string => {
  return format(date, 'h:mm a');
};

/**
 * Gets the current time formatted as HH:mm for input fields
 */
export const getCurrentTimeInput = (): string => {
  return format(new Date(), 'HH:mm');
};

/**
 * Returns readable duration string (e.g., "3h 15m remaining")
 */
export const getTimeRemaining = (targetDate: Date): string => {
  const now = new Date();
  const diffInMinutes = differenceInMinutes(targetDate, now);
  
  if (diffInMinutes <= 0) return "You're free to go!";
  
  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  }
  return `${minutes}m remaining`;
};

/**
 * Calculate progress percentage (0 to 100)
 */
export const calculateProgress = (startTimeStr: string, targetDate: Date): number => {
  const now = new Date();
  const today = new Date();
  const startTime = parse(startTimeStr, 'HH:mm', today);
  
  const totalSeconds = differenceInSeconds(targetDate, startTime);
  const elapsedSeconds = differenceInSeconds(now, startTime);
  
  if (totalSeconds === 0) return 0;
  
  const progress = (elapsedSeconds / totalSeconds) * 100;
  return Math.min(Math.max(progress, 0), 100);
};