
import { useEffect } from 'react';
import { startTimeTracking } from '@/utils/timeTrackingUtils';

/**
 * Hook to automatically initialize time tracking system
 * This should be used once at the app level
 */
export const useTimeTracking = () => {
  useEffect(() => {
    console.log('useTimeTracking hook initializing...');
    // Initialize time tracking system
    startTimeTracking();
    
    // The cleanup is handled inside startTimeTracking
    return () => {
      console.log('useTimeTracking hook cleanup');
      // Cleanup is handled by the beforeunload event in startTimeTracking
    };
  }, []);
};

export default useTimeTracking;
