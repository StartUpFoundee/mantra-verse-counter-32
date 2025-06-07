
import React from 'react';
import { formatTimeSpent } from '@/utils/timeTrackingUtils';

interface TimeSpentTooltipProps {
  date: string;
  timeSpent: number;
  mousePosition: { x: number; y: number };
}

const TimeSpentTooltip: React.FC<TimeSpentTooltipProps> = ({ date, timeSpent, mousePosition }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const tooltipStyle = {
    position: 'fixed' as const,
    left: mousePosition.x + 10,
    top: mousePosition.y - 10,
    zIndex: 1000,
    pointerEvents: 'none' as const,
  };

  return (
    <div 
      style={tooltipStyle}
      className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg border border-gray-700 max-w-xs"
    >
      <div className="font-semibold mb-1">{formatDate(date)}</div>
      <div className="text-gray-300">
        {timeSpent > 0 ? (
          <>
            <div>Time spent: {formatTimeSpent(timeSpent)}</div>
            <div className="text-green-400 text-xs mt-1">Active day</div>
          </>
        ) : (
          <div className="text-red-400">No activity this day</div>
        )}
      </div>
    </div>
  );
};

export default TimeSpentTooltip;
