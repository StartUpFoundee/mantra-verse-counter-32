
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, TrendingUp } from "lucide-react";
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
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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

  // Generate year options based on available data
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const dataDates = Object.keys(timeData).filter(date => timeData[date] > 0);
    
    if (dataDates.length === 0) return [currentYear];
    
    const earliestDate = dataDates.sort()[0];
    const earliestYear = new Date(earliestDate + 'T00:00:00').getFullYear();
    
    if (earliestYear === currentYear) return [currentYear];
    
    const years = [];
    for (let year = earliestYear; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  };

  const yearOptions = generateYearOptions();

  // Calculate stats
  const calculateStats = () => {
    const dates = Object.keys(timeData);
    const activeDays = dates.filter(date => timeData[date] > 0).length;
    const totalTime = dates.reduce((sum, date) => sum + timeData[date], 0);
    const avgTime = activeDays > 0 ? Math.round(totalTime / activeDays) : 0;
    
    return { activeDays, totalTime, avgTime };
  };

  const stats = calculateStats();

  // Generate calendar for selected year
  const generateCalendarData = () => {
    const year = selectedYear;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    const maxMonth = (year === currentYear) ? currentMonth : 11;
    const months = [];
    
    for (let month = 0; month <= maxMonth; month++) {
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
        
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const isToday = dateStr === todayStr;
        
        days.push({
          date: dateStr,
          timeSpent,
          isToday,
          day
        });
      }
      
      months.push({
        name: new Date(year, month).toLocaleDateString('en-US', { month: 'long' }),
        days,
        month
      });
    }
    
    return months;
  };

  const calendarMonths = generateCalendarData();
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const getActivityLevel = (timeSpent: number): string => {
    if (timeSpent === 0) {
      return "bg-red-200/50 dark:bg-red-800/50 border border-red-300 dark:border-red-600";
    }
    return "bg-green-200/70 dark:bg-green-800/50 border border-green-300 dark:border-green-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-zinc-900 dark:via-black dark:to-zinc-800 p-4 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 max-w-6xl mx-auto">
        <Button
          onClick={() => navigate('/active-days')}
          variant="ghost"
          className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-100/50 dark:hover:bg-amber-900/20 backdrop-blur-sm"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Activity
        </Button>
        <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent text-center">
          Time Tracking
        </h1>
        <div className="w-28"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-12 max-w-6xl mx-auto">
        <ModernCard className="p-6 lg:p-8 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 border-blue-300/30 dark:border-blue-600/30" gradient>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <Clock className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg lg:text-xl font-semibold text-blue-600 dark:text-blue-400 mb-1">Total Time</h3>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{formatTimeSpent(stats.totalTime)}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">lifetime usage</p>
            </div>
          </div>
        </ModernCard>

        <ModernCard className="p-6 lg:p-8 bg-gradient-to-br from-green-400/20 to-emerald-500/20 border-green-300/30 dark:border-green-600/30" gradient>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg lg:text-xl font-semibold text-green-600 dark:text-green-400 mb-1">Active Days</h3>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{stats.activeDays}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">days visited</p>
            </div>
          </div>
        </ModernCard>

        <ModernCard className="p-6 lg:p-8 bg-gradient-to-br from-purple-400/20 to-indigo-500/20 border-purple-300/30 dark:border-purple-600/30" gradient>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg lg:text-xl font-semibold text-purple-600 dark:text-purple-400 mb-1">Average Time</h3>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{formatTimeSpent(stats.avgTime)}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">per active day</p>
            </div>
          </div>
        </ModernCard>
      </div>

      {/* Calendar */}
      <div className="max-w-6xl mx-auto mb-8 lg:mb-12">
        <ModernCard className="p-6 lg:p-8 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl border-amber-200/50 dark:border-amber-700/50" gradient>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 lg:w-7 lg:h-7 text-amber-600 dark:text-amber-400" />
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Time Spent Calendar</h2>
              </div>
              {yearOptions.length > 1 && (
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="bg-white dark:bg-zinc-800 border border-amber-200/50 dark:border-amber-700/50 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  {yearOptions.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Green indicates active days, red indicates no activity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {calendarMonths.map((monthData) => (
              <div key={monthData.month} className="bg-white/50 dark:bg-zinc-900/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 text-center">
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
                        return <div key={`empty-${weekIndex}-${dayIndex}`} className="w-8 h-8"></div>;
                      }
                      
                      return (
                        <div
                          key={dayData.date}
                          className={`w-8 h-8 rounded-sm cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-amber-400 relative flex items-center justify-center text-xs ${
                            getActivityLevel(dayData.timeSpent)
                          } ${dayData.isToday ? 'ring-2 ring-amber-500 bg-amber-100 dark:bg-amber-900' : ''}`}
                          onMouseEnter={(e) => {
                            setHoveredDay({ date: dayData.date, timeSpent: dayData.timeSpent });
                            handleMouseMove(e);
                          }}
                          onMouseMove={handleMouseMove}
                          onMouseLeave={() => setHoveredDay(null)}
                        >
                          <span className={`text-xs font-medium ${dayData.isToday ? 'text-amber-700 dark:text-amber-300' : 'text-gray-700 dark:text-gray-300'}`}>
                            {dayData.day}
                          </span>
                        </div>
                      );
                    })
                  ))}
                </div>
              </div>
            ))}
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
