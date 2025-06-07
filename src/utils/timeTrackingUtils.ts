
import { getData, storeData, getAllData, STORES, initializeDatabase } from './indexedDBUtils';

export interface DailyTimeSpent {
  date: string;
  timeSpent: number; // in seconds
  lastActivity: number; // timestamp
}

export interface TimeTrackingData {
  [date: string]: number; // date -> seconds spent
}

/**
 * Get today's date string in local timezone
 */
const getTodayDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Record time spent on the website
 */
export const recordTimeSpent = async (seconds: number = 1): Promise<void> => {
  const today = getTodayDateString();
  
  try {
    // Ensure database is initialized
    await initializeDatabase();
    
    // Get existing time data for today
    const existingTime = await getData('timeTracking', today);
    const currentTime = existingTime ? existingTime.timeSpent : 0;
    
    // Update time spent
    const timeData: DailyTimeSpent = {
      date: today,
      timeSpent: currentTime + seconds,
      lastActivity: Date.now()
    };
    
    await storeData('timeTracking', timeData);
    console.log(`Recorded ${seconds} seconds for ${today}. Total today: ${timeData.timeSpent}`);
  } catch (error) {
    console.error("Failed to record time spent:", error);
  }
};

/**
 * Get all time tracking data
 */
export const getTimeTrackingData = async (): Promise<TimeTrackingData> => {
  try {
    // Ensure database is initialized
    await initializeDatabase();
    
    const allTimeData = await getAllData('timeTracking');
    const timeMap: TimeTrackingData = {};
    
    allTimeData.forEach((timeEntry: DailyTimeSpent) => {
      timeMap[timeEntry.date] = timeEntry.timeSpent;
    });
    
    return timeMap;
  } catch (error) {
    console.error("Failed to get time tracking data:", error);
    return {};
  }
};

/**
 * Format seconds to human readable time
 */
export const formatTimeSpent = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
};

// Initialize time tracking when user visits
let sessionStartTime = Date.now();
let lastActivityTime = Date.now();
let trackingInterval: NodeJS.Timeout | null = null;

/**
 * Check if current page should track time (only manual and audio counter pages)
 */
const shouldTrackTime = (): boolean => {
  const path = window.location.pathname;
  return path === '/manual' || path === '/audio';
};

/**
 * Start time tracking session - only on manual and audio pages
 */
export const startTimeTracking = (): void => {
  sessionStartTime = Date.now();
  lastActivityTime = Date.now();
  
  // Track user activity
  const updateActivity = () => {
    lastActivityTime = Date.now();
  };
  
  // Listen for user interactions
  document.addEventListener('mousedown', updateActivity);
  document.addEventListener('keydown', updateActivity);
  document.addEventListener('scroll', updateActivity);
  document.addEventListener('touchstart', updateActivity);
  
  // Start tracking interval
  const startTracking = () => {
    if (trackingInterval) {
      clearInterval(trackingInterval);
    }
    
    trackingInterval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityTime;
      
      // Only track time if on correct page and user has been active
      if (shouldTrackTime() && timeSinceLastActivity < 30000) {
        recordTimeSpent(10);
      }
    }, 10000);
  };
  
  // Listen for route changes
  const handleRouteChange = () => {
    if (shouldTrackTime()) {
      startTracking();
    } else if (trackingInterval) {
      clearInterval(trackingInterval);
      trackingInterval = null;
    }
  };
  
  // Initial check
  handleRouteChange();
  
  // Listen for navigation changes
  window.addEventListener('popstate', handleRouteChange);
  
  // Override pushState and replaceState to detect programmatic navigation
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  history.pushState = function(...args) {
    originalPushState.apply(this, args);
    setTimeout(handleRouteChange, 0);
  };
  
  history.replaceState = function(...args) {
    originalReplaceState.apply(this, args);
    setTimeout(handleRouteChange, 0);
  };
  
  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    if (trackingInterval) {
      clearInterval(trackingInterval);
    }
    document.removeEventListener('mousedown', updateActivity);
    document.removeEventListener('keydown', updateActivity);
    document.removeEventListener('scroll', updateActivity);
    document.removeEventListener('touchstart', updateActivity);
    window.removeEventListener('popstate', handleRouteChange);
    
    // Restore original methods
    history.pushState = originalPushState;
    history.replaceState = originalReplaceState;
  });
};

export default {
  recordTimeSpent,
  getTimeTrackingData,
  formatTimeSpent,
  startTimeTracking
};
