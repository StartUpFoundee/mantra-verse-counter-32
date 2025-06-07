
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

// Global tracking variables
let trackingInterval: NodeJS.Timeout | null = null;
let lastActivityTime = Date.now();
let isTrackingInitialized = false;

/**
 * Check if current page should track time (only manual and audio counter pages)
 */
const shouldTrackTime = (): boolean => {
  const path = window.location.pathname;
  return path === '/manual' || path === '/audio';
};

/**
 * Update activity timestamp
 */
const updateActivity = () => {
  lastActivityTime = Date.now();
};

/**
 * Start time tracking session - automatically starts on manual and audio pages
 */
export const startTimeTracking = (): void => {
  if (isTrackingInitialized) return; // Prevent multiple initializations
  
  console.log('Initializing time tracking system...');
  isTrackingInitialized = true;
  lastActivityTime = Date.now();
  
  // Listen for user interactions to track activity
  const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove', 'click'];
  events.forEach(eventType => {
    document.addEventListener(eventType, updateActivity, { passive: true });
  });
  
  // Function to start/stop tracking based on current page
  const handleRouteChange = () => {
    if (shouldTrackTime()) {
      console.log(`Starting time tracking on ${window.location.pathname}`);
      startActiveTracking();
    } else {
      console.log(`Stopping time tracking, not on counter page`);
      stopActiveTracking();
    }
  };
  
  // Start active tracking
  const startActiveTracking = () => {
    if (trackingInterval) return; // Already tracking
    
    trackingInterval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityTime;
      
      // Only record time if user has been active within last 30 seconds
      if (timeSinceLastActivity < 30000) {
        recordTimeSpent(10); // Record 10 seconds every 10 seconds
      }
    }, 10000); // Check every 10 seconds
  };
  
  // Stop active tracking
  const stopActiveTracking = () => {
    if (trackingInterval) {
      clearInterval(trackingInterval);
      trackingInterval = null;
    }
  };
  
  // Initial route check
  handleRouteChange();
  
  // Listen for navigation changes (both programmatic and browser)
  window.addEventListener('popstate', handleRouteChange);
  
  // Override pushState and replaceState to detect programmatic navigation
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  history.pushState = function(...args) {
    originalPushState.apply(this, args);
    setTimeout(handleRouteChange, 100); // Small delay to ensure route change is processed
  };
  
  history.replaceState = function(...args) {
    originalReplaceState.apply(this, args);
    setTimeout(handleRouteChange, 100);
  };
  
  // Clean up on page unload
  const cleanup = () => {
    console.log('Cleaning up time tracking...');
    stopActiveTracking();
    isTrackingInitialized = false;
    
    // Remove event listeners
    events.forEach(eventType => {
      document.removeEventListener(eventType, updateActivity);
    });
    
    window.removeEventListener('popstate', handleRouteChange);
    window.removeEventListener('beforeunload', cleanup);
    
    // Restore original history methods
    history.pushState = originalPushState;
    history.replaceState = originalReplaceState;
  };
  
  window.addEventListener('beforeunload', cleanup);
};

// Auto-initialize time tracking when this module is imported
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startTimeTracking);
  } else {
    // DOM is already ready
    setTimeout(startTimeTracking, 100);
  }
}

export default {
  recordTimeSpent,
  getTimeTrackingData,
  formatTimeSpent,
  startTimeTracking
};
