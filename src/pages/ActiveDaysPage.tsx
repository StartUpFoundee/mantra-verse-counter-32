import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Flame, Target, TrendingUp, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getActivityData, getStreakData } from "@/utils/activityUtils";
import { getTodayCount } from "@/utils/indexedDBUtils";
import ModernCard from "@/components/ModernCard";
import SpiritualJourneyLevels, { getSpiritualLevel } from "@/components/SpiritualJourneyLevels";
import { useIsMobile } from "@/hooks/use-mobile";

interface ActivityData {
  [date: string]: number;
}

interface StreakData {
  currentStreak: number;
  maxStreak: number;
  totalActiveDays: number;
}

const ActiveDaysPage: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activityData, setActivityData] = useState<ActivityData>({});
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    maxStreak: 0,
    totalActiveDays: 0
  });
  const [hoveredDay, setHoveredDay] = useState<{date: string, count: number} | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const loadData = async () => {
      const activity = await getActivityData();
      const streaks = await getStreakData();
      
      // Get today's count from the main counter
      const todayCount = await getTodayCount();
      const today = new Date().toISOString().split('T')[0];
      
      // Update activity data with today's count
      const updatedActivity = { ...activity };
      if (todayCount > 0) {
        updatedActivity[today] = todayCount;
      }
      
      setActivityData(updatedActivity);
      setStreakData(streaks);
    };
    loadData();

    // Refresh data every 2 seconds to catch updates from mantra counter
    const interval = setInterval(loadData, 2000);
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

  // Generate calendar for the selected month
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
      const count = activityData[dateStr] || 0;
      
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const isToday = dateStr === todayStr;
      const isFuture = date > today;
      
      days.push({
        date: dateStr,
        count,
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

  const getActivityLevel = (count: number, isFuture: boolean): string => {
    if (isFuture) return "bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700";
    if (count === 0) return "bg-gray-200/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600";
    const level = getSpiritualLevel(count);
    return "bg-emerald-200/70 dark:bg-emerald-800/50 border border-emerald-300 dark:border-emerald-600";
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-zinc-900 dark:via-black dark:to-zinc-800 ${isMobile ? 'flex flex-col' : 'p-2 md:p-4 lg:p-8'}`}>
      {/* Mobile Layout: 50-50 split */}
      {isMobile ? (
        <>
          {/* Top Section: 50% height */}
          <div className="h-[50vh] overflow-y-auto p-2 pt-safe-top">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <Button
                onClick={() => navigate('/')}
                variant="ghost"
                className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-100/50 dark:hover:bg-amber-900/20 backdrop-blur-sm text-xs"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <h1 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent text-center">
                Active Days
              </h1>
              <Button
                onClick={() => navigate('/time-tracking')}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-blue-400/30 text-xs px-2 py-1"
              >
                <Clock className="w-3 h-3 mr-1" />
                Track Time
              </Button>
            </div>

            {/* Stats Cards - Single row on mobile */}
            <div className="grid grid-cols-3 gap-1 mb-3">
              <ModernCard className="p-2 bg-gradient-to-br from-orange-400/20 to-red-500/20 border-orange-300/30 dark:border-orange-600/30" gradient>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-lg mb-1">
                    <Flame className="w-3 h-3 text-white" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xs font-semibold text-orange-600 dark:text-orange-400">Current</h3>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{streakData.currentStreak}</div>
                  </div>
                </div>
              </ModernCard>

              <ModernCard className="p-2 bg-gradient-to-br from-emerald-400/20 to-green-500/20 border-emerald-300/30 dark:border-emerald-600/30" gradient>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center shadow-lg mb-1">
                    <TrendingUp className="w-3 h-3 text-white" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Max</h3>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{streakData.maxStreak}</div>
                  </div>
                </div>
              </ModernCard>

              <ModernCard className="p-2 bg-gradient-to-br from-purple-400/20 to-indigo-500/20 border-purple-300/30 dark:border-purple-600/30" gradient>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg mb-1">
                    <Target className="w-3 h-3 text-white" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xs font-semibold text-purple-600 dark:text-purple-400">Total</h3>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{streakData.totalActiveDays}</div>
                  </div>
                </div>
              </ModernCard>
            </div>

            {/* Achievement Categories - Compact */}
            <SpiritualJourneyLevels activityData={activityData} />
          </div>

          {/* Bottom Section: 50% height - Calendar */}
          <div className="h-[50vh] p-2 pb-safe-bottom">
            <ModernCard className="h-full p-3 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl border-amber-200/50 dark:border-amber-700/50 flex flex-col" gradient>
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Activity Calendar</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => navigateMonth('prev')}
                    variant="ghost"
                    size="sm"
                    className="p-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => navigateMonth('next')}
                    variant="ghost"
                    size="sm"
                    className="p-1"
                    disabled={selectedDate.getMonth() >= new Date().getMonth() && selectedDate.getFullYear() >= new Date().getFullYear()}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Calendar Content - Flex grow to fill remaining space */}
              <div className="flex-1 bg-white/50 dark:bg-zinc-900/50 rounded-lg p-2 overflow-hidden flex flex-col">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 text-center">
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

                {/* Days grid - Flex grow to fill remaining space */}
                <div className="flex-1 grid grid-cols-7 gap-1 content-start">
                  {Array.from({ length: Math.ceil(monthData.days.length / 7) }).map((_, weekIndex) => (
                    monthData.days.slice(weekIndex * 7, (weekIndex + 1) * 7).map((dayData, dayIndex) => {
                      if (!dayData) {
                        return <div key={`empty-${weekIndex}-${dayIndex}`} className="aspect-square"></div>;
                      }
                      
                      const spiritualLevel = getSpiritualLevel(dayData.count);
                      
                      return (
                        <div
                          key={dayData.date}
                          className={`aspect-square rounded-sm cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-amber-400 relative flex items-center justify-center text-xs ${
                            getActivityLevel(dayData.count, dayData.isFuture)
                          } ${dayData.isToday ? 'ring-2 ring-amber-500 bg-amber-100 dark:bg-amber-900' : ''}`}
                          onMouseEnter={(e) => {
                            if (!dayData.isFuture) {
                              setHoveredDay({ date: dayData.date, count: dayData.count });
                              handleMouseMove(e);
                            }
                          }}
                          onMouseMove={handleMouseMove}
                          onMouseLeave={() => setHoveredDay(null)}
                        >
                          {!dayData.isFuture && dayData.count > 0 && spiritualLevel.icon && (
                            <span className="filter drop-shadow-sm text-xs">
                              {spiritualLevel.icon}
                            </span>
                          )}
                        </div>
                      );
                    })
                  ))}
                </div>
              </div>
            </ModernCard>
          </div>
        </>
      ) : (
        // Desktop Layout - Keep existing code
        <>
          {/* Header */}
          <div className="flex items-center justify-between mb-4 md:mb-8 max-w-6xl mx-auto">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-100/50 dark:hover:bg-amber-900/20 backdrop-blur-sm text-xs md:text-sm"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
              Back
            </Button>
            <h1 className="text-lg md:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent text-center">
              Active Days
            </h1>
            <Button
              onClick={() => navigate('/time-tracking')}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-blue-400/30 text-xs md:text-sm px-2 md:px-4 py-1 md:py-2"
            >
              <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              Track Time
            </Button>
          </div>

          {/* Stats Cards - Desktop layout */}
          <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-4 lg:gap-6 mb-4 md:mb-8 lg:mb-12 max-w-6xl mx-auto">
            <ModernCard className="p-2 md:p-6 lg:p-8 bg-gradient-to-br from-orange-400/20 to-red-500/20 border-orange-300/30 dark:border-orange-600/30" gradient>
              <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4">
                <div className="w-6 h-6 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                  <Flame className="w-3 h-3 md:w-6 md:h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-xs md:text-lg lg:text-xl font-semibold text-orange-600 dark:text-orange-400 mb-0 md:mb-1">Current</h3>
                  <div className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{streakData.currentStreak}</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 hidden md:block">days in a row</p>
                </div>
              </div>
            </ModernCard>

            <ModernCard className="p-2 md:p-6 lg:p-8 bg-gradient-to-br from-emerald-400/20 to-green-500/20 border-emerald-300/30 dark:border-emerald-600/30" gradient>
              <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4">
                <div className="w-6 h-6 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-3 h-3 md:w-6 md:h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-xs md:text-lg lg:text-xl font-semibold text-emerald-600 dark:text-emerald-400 mb-0 md:mb-1">Max</h3>
                  <div className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{streakData.maxStreak}</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 hidden md:block">personal best</p>
                </div>
              </div>
            </ModernCard>

            <ModernCard className="p-2 md:p-6 lg:p-8 bg-gradient-to-br from-purple-400/20 to-indigo-500/20 border-purple-300/30 dark:border-purple-600/30" gradient>
              <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4">
                <div className="w-6 h-6 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                  <Target className="w-3 h-3 md:w-6 md:h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-xs md:text-lg lg:text-xl font-semibold text-purple-600 dark:text-purple-400 mb-0 md:mb-1">Total</h3>
                  <div className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{streakData.totalActiveDays}</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 hidden md:block">active days</p>
                </div>
              </div>
            </ModernCard>
          </div>

          {/* Spiritual Journey Levels - Desktop */}
          <SpiritualJourneyLevels activityData={activityData} />

          {/* Calendar - Desktop */}
          <div className="max-w-6xl mx-auto mb-4 md:mb-8 lg:mb-12">
            <ModernCard className="p-3 md:p-6 lg:p-8 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl border-amber-200/50 dark:border-amber-700/50" gradient>
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <div className="flex items-center gap-2 md:gap-3">
                  <Calendar className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-amber-600 dark:text-amber-400" />
                  <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Activity Calendar</h2>
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
                      
                      const spiritualLevel = getSpiritualLevel(dayData.count);
                      
                      return (
                        <div
                          key={dayData.date}
                          className={`w-8 h-8 md:w-10 md:h-10 rounded-sm cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-amber-400 relative flex items-center justify-center text-xs ${
                            getActivityLevel(dayData.count, dayData.isFuture)
                          } ${dayData.isToday ? 'ring-2 ring-amber-500 bg-amber-100 dark:bg-amber-900' : ''}`}
                          onMouseEnter={(e) => {
                            if (!dayData.isFuture) {
                              setHoveredDay({ date: dayData.date, count: dayData.count });
                              handleMouseMove(e);
                            }
                          }}
                          onMouseMove={handleMouseMove}
                          onMouseLeave={() => setHoveredDay(null)}
                        >
                          {!dayData.isFuture && dayData.count > 0 && spiritualLevel.icon && (
                            <span className="filter drop-shadow-sm text-xs">
                              {spiritualLevel.icon}
                            </span>
                          )}
                        </div>
                      );
                    })
                  ))}
                </div>
              </div>
            </ModernCard>
          </div>
        </>
      )}

      {/* Tooltip */}
      {hoveredDay && (
        <div
          className="fixed z-50 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-amber-200/50 dark:border-amber-700/50 rounded-xl px-4 py-3 text-sm pointer-events-none shadow-xl"
          style={{
            left: mousePosition.x + 10,
            top: mousePosition.y - 50,
          }}
        >
          <div className="text-gray-900 dark:text-white font-medium mb-1">
            {new Date(hoveredDay.date).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
          <div className="text-amber-600 dark:text-amber-400">
            {hoveredDay.count} jaaps completed
          </div>
          <div className="text-gray-500 dark:text-gray-400 text-xs">
            {getSpiritualLevel(hoveredDay.count).name} level
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveDaysPage;
