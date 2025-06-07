
import { useEffect } from 'react';
import { startTimeTracking } from '@/utils/timeTrackingUtils';

/**
 * Hook to automatically initialize time tracking system
 * This should be used once at the app level
 */
export const useTimeTracking = () => {
  useEffect(() => {
    // Initialize time tracking system
    startTimeTracking();
    
    // The cleanup is handled inside startTimeTracking
    return () => {
      // Cleanup is handled by the beforeunload event in startTimeTracking
    };
  }, []);
};

export default useTimeTracking;
