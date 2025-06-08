
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface DigitalClockProps {
  className?: string;
  showDate?: boolean;
}

const DigitalClock: React.FC<DigitalClockProps> = ({ className = '', showDate = true }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
      <div className="text-center">
        <div className="text-lg font-bold text-gray-900 dark:text-white">
          {formatTime(time)}
        </div>
        {showDate && (
          <div className="text-xs text-gray-600 dark:text-gray-300">
            {formatDate(time)}
          </div>
        )}
      </div>
    </div>
  );
};

export default DigitalClock;
