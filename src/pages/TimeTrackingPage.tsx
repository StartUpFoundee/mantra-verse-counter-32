
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTimeTrackingData, formatTimeSpent } from "@/utils/timeTrackingUtils";
import ModernCard from "@/components/ModernCard";
import TimeSpentTooltip from "@/components/TimeSpentTooltip";

interface TimeTrackingData {
  [date: string]: number;
}

const TimeTrackingPage: React.FC = () => {
  const navigate = useNavigate();
  const [timeData, setTimeData] = useState<TimeTrackingData>({});
  const [hoveredDay, setHoveredDay] = useState<{date: string, timeSpent: number} | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const loadTimeData = async () => {
      const data = await getTimeTrackingData();
      setTimeData(data);
    };
    loadTimeData();

    // Refresh data every 30 seconds
    const interval = setInterval(loadTimeData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Navigate to previous/next month
  const navigateMonth = (direction: 'prev' | 'next') => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  // Calculate stats
  const calculateStats = () => {
    const dates = Object.keys(timeData);
    const activeDays = dates.filter(date => timeData[date] > 0).length;
    const totalTime = dates.reduce((sum, date) => sum + timeData[date], 0);
    const avgTime = activeDays > 0 ? Math.round(totalTime / activeDays) : 0;
    
    return { activeDays, totalTime, avgTime };
  };

  const stats = calculateStats();

  // Generate calendar for selected month
  const generateMonthCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const today = new Date();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const timeSpent = timeData[dateStr] || 0;
      
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const isToday = dateStr === todayStr;
      const isFuture = date > today;
      
      days.push({
        date: dateStr,
        timeSpent,
        isToday,
        isFuture,
        day
      });
    }
    
    return {
      name: selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      days
    };
  };

  const monthData = generateMonthCalendar();
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const getActivityLevel = (timeSpent: number, isFuture: boolean): string => {
    if (isFuture) {
      return "bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700";
    }
    if (timeSpent === 0) {
      return "bg-red-200/50 dark:bg-red-800/50 border border-red-300 dark:border-red-600";
    }
    return "bg-green-200/70 dark:bg-green-800/50 border border-green-300 dark:border-green-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-zinc-900 dark:via-black dark:to-zinc-800 p-2 md:p-4 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-8 max-w-6xl mx-auto">
        <Button
          onClick={() => navigate('/active-days')}
          variant="ghost"
          className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-100/50 dark:hover:bg-amber-900/20 backdrop-blur-sm text-xs md:text-sm"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
          Back
        </Button>
        <h1 className="text-lg md:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent text-center">
          Time Tracking
        </h1>
        <div className="w-16 md:w-28"></div>
      </div>

      {/* Stats Cards - Mobile: Single row, Desktop: Three columns */}
      <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-4 lg:gap-6 mb-4 md:mb-8 lg:mb-12 max-w-6xl mx-auto">
        <ModernCard className="p-2 md:p-6 lg:p-8 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 border-blue-300/30 dark:border-blue-600/30" gradient>
          <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4">
            <div className="w-6 h-6 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
              <Clock className="w-3 h-3 md:w-6 md:h-6 lg:w-8 lg:h-8 text-white" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xs md:text-lg lg:text-xl font-semibold text-blue-600 dark:text-blue-400 mb-0 md:mb-1">Total</h3>
              <div className="text-sm md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{formatTimeSpent(stats.totalTime)}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 hidden md:block">lifetime usage</p>
            </div>
          </div>
        </ModernCard>

        <ModernCard className="p-2 md:p-6 lg:p-8 bg-gradient-to-br from-green-400/20 to-emerald-500/20 border-green-300/30 dark:border-green-600/30" gradient>
          <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4">
            <div className="w-6 h-6 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="w-3 h-3 md:w-6 md:h-6 lg:w-8 lg:h-8 text-white" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xs md:text-lg lg:text-xl font-semibold text-green-600 dark:text-green-400 mb-0 md:mb-1">Active</h3>
              <div className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{stats.activeDays}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 hidden md:block">days visited</p>
            </div>
          </div>
        </ModernCard>

        <ModernCard className="p-2 md:p-6 lg:p-8 bg-gradient-to-br from-purple-400/20 to-indigo-500/20 border-purple-300/30 dark:border-purple-600/30" gradient>
          <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4">
            <div className="w-6 h-6 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-3 h-3 md:w-6 md:h-6 lg:w-8 lg:h-8 text-white" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xs md:text-lg lg:text-xl font-semibold text-purple-600 dark:text-purple-400 mb-0 md:mb-1">Average</h3>
              <div className="text-sm md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{formatTimeSpent(stats.avgTime)}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 hidden md:block">per active day</p>
            </div>
          </div>
        </ModernCard>
      </div>

      {/* Calendar */}
      <div className="max-w-6xl mx-auto mb-4 md:mb-8 lg:mb-12">
        <ModernCard className="p-3 md:p-6 lg:p-8 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl border-amber-200/50 dark:border-amber-700/50" gradient>
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center gap-2 md:gap-3">
              <Clock className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-amber-600 dark:text-amber-400" />
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Time Spent Calendar</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => navigateMonth('prev')}
                variant="ghost"
                size="sm"
                className="p-1 md:p-2"
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
              <Button
                onClick={() => navigateMonth('next')}
                variant="ghost"
                size="sm"
                className="p-1 md:p-2"
                disabled={selectedDate.getMonth() >= new Date().getMonth() && selectedDate.getFullYear() >= new Date().getFullYear()}
              >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </div>
          </div>

          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4">
            Green indicates active days, red indicates no activity (past dates only)
          </p>

          {/* Single Month Calendar */}
          <div className="bg-white/50 dark:bg-zinc-900/50 rounded-lg p-3 md:p-4">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3 text-center">
              {monthData.name}
            </h3>
            
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekdays.map((day) => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: Math.ceil(monthData.days.length / 7) }).map((_, weekIndex) => (
                monthData.days.slice(weekIndex * 7, (weekIndex + 1) * 7).map((dayData, dayIndex) => {
                  if (!dayData) {
                    return <div key={`empty-${weekIndex}-${dayIndex}`} className="w-8 h-8 md:w-10 md:h-10"></div>;
                  }
                  
                  return (
                    <div
                      key={dayData.date}
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-sm cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-amber-400 relative flex items-center justify-center ${
                        getActivityLevel(dayData.timeSpent, dayData.isFuture)
                      } ${dayData.isToday ? 'ring-2 ring-amber-500 bg-amber-100 dark:bg-amber-900' : ''}`}
                      onMouseEnter={(e) => {
                        if (!dayData.isFuture) {
                          setHoveredDay({ date: dayData.date, timeSpent: dayData.timeSpent });
                          handleMouseMove(e);
                        }
                      }}
                      onMouseMove={handleMouseMove}
                      onMouseLeave={() => setHoveredDay(null)}
                    >
                      {/* Empty boxes - no content */}
                    </div>
                  );
                })
              ))}
            </div>
          </div>
        </ModernCard>
      </div>

      {/* Tooltip */}
      {hoveredDay && (
        <TimeSpentTooltip
          date={hoveredDay.date}
          timeSpent={hoveredDay.timeSpent}
          mousePosition={mousePosition}
        />
      )}
    </div>
  );
};

export default TimeTrackingPage;
