
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Flame, Target, TrendingUp, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getActivityData, getStreakData } from "@/utils/activityUtils";
import { getTodayCount } from "@/utils/indexedDBUtils";
import ModernCard from "@/components/ModernCard";
import SpiritualJourneyLevels, { getSpiritualLevel } from "@/components/SpiritualJourneyLevels";

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
  const [activityData, setActivityData] = useState<ActivityData>({});
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    maxStreak: 0,
    totalActiveDays: 0
  });
  const [hoveredDay, setHoveredDay] = useState<{date: string, count: number} | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      const activity = await getActivityData();
      const streaks = await getStreakData();
      
      const todayCount = await getTodayCount();
      const today = new Date().toISOString().split('T')[0];
      
      const updatedActivity = { ...activity };
      if (todayCount > 0) {
        updatedActivity[today] = todayCount;
      }
      
      setActivityData(updatedActivity);
      setStreakData(streaks);
    };
    loadData();

    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, []);

  // Generate single month calendar for current display
  const generateCurrentMonthData = () => {
    const currentDate = new Date();
    const displayMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + currentMonthOffset, 1);
    const year = displayMonth.getFullYear();
    const month = displayMonth.getMonth();
    
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
      
      const today = new Date();
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
      name: displayMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      days,
      month: displayMonth.getMonth(),
      year: displayMonth.getFullYear()
    };
  };

  const currentMonthData = generateCurrentMonthData();
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

  const canGoBack = () => {
    const earliestDate = Object.keys(activityData).filter(date => activityData[date] > 0).sort()[0];
    if (!earliestDate) return false;
    
    const earliestMonth = new Date(earliestDate + 'T00:00:00');
    const currentDisplay = new Date();
    currentDisplay.setMonth(currentDisplay.getMonth() + currentMonthOffset);
    
    return currentDisplay > earliestMonth;
  };

  const canGoForward = () => {
    return currentMonthOffset < 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-zinc-900 dark:via-black dark:to-zinc-800 p-2 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 max-w-6xl mx-auto">
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-100/50 dark:hover:bg-amber-900/20 backdrop-blur-sm p-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">Back</span>
        </Button>
        <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent text-center">
          Active Days
        </h1>
        <Button
          onClick={() => navigate('/time-tracking')}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-blue-400/30 p-2 text-xs sm:text-sm"
        >
          <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          <span className="hidden sm:inline">Track</span>
        </Button>
      </div>

      {/* Stats Cards - Single Row */}
      <div className="flex gap-2 mb-4 max-w-6xl mx-auto">
        <ModernCard className="flex-1 p-3 bg-gradient-to-br from-orange-400/20 to-red-500/20 border-orange-300/30 dark:border-orange-600/30" gradient>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-lg">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-semibold text-orange-600 dark:text-orange-400 truncate">Current</h3>
              <div className="text-lg font-bold text-gray-900 dark:text-white">{streakData.currentStreak}</div>
            </div>
          </div>
        </ModernCard>

        <ModernCard className="flex-1 p-3 bg-gradient-to-br from-emerald-400/20 to-green-500/20 border-emerald-300/30 dark:border-emerald-600/30" gradient>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center shadow-lg">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 truncate">Max</h3>
              <div className="text-lg font-bold text-gray-900 dark:text-white">{streakData.maxStreak}</div>
            </div>
          </div>
        </ModernCard>

        <ModernCard className="flex-1 p-3 bg-gradient-to-br from-purple-400/20 to-indigo-500/20 border-purple-300/30 dark:border-purple-600/30" gradient>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
              <Target className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-semibold text-purple-600 dark:text-purple-400 truncate">Total</h3>
              <div className="text-lg font-bold text-gray-900 dark:text-white">{streakData.totalActiveDays}</div>
            </div>
          </div>
        </ModernCard>
      </div>

      {/* Spiritual Journey Levels - Smaller */}
      <div className="mb-4 max-w-6xl mx-auto">
        <ModernCard className="p-3 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-xl border-amber-200/50 dark:border-amber-700/50" gradient>
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">🏆</span>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">Achievement Categories</h2>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-2">
            {[
              { name: "Rogi", icon: "🤒", range: "0", color: "bg-gray-100 text-gray-700 border-gray-300" },
              { name: "Bhogi", icon: "🍯", range: "1-308", color: "bg-amber-100 text-amber-800 border-amber-300" },
              { name: "Yogi", icon: "🧘‍♂️", range: "309-508", color: "bg-blue-100 text-blue-800 border-blue-300" },
              { name: "Sadhak", icon: "🕉️", range: "509-708", color: "bg-teal-100 text-teal-800 border-teal-300" },
              { name: "Tapasvi", icon: "🔥", range: "709-1007", color: "bg-orange-100 text-orange-800 border-orange-300" },
              { name: "Bhakti", icon: "🙏", range: "1008+", color: "bg-pink-100 text-pink-800 border-pink-300" }
            ].map((level, index) => {
              const days = Object.values(activityData).filter(count => {
                if (level.range === "0") return count === 0;
                if (level.range === "1008+") return count >= 1008;
                const [min, max] = level.range.split('-').map(Number);
                return count >= min && count <= max;
              }).length;
              
              return (
                <div key={index} className={`rounded-lg p-2 text-center border ${level.color}`}>
                  <div className="text-sm mb-1">{level.icon}</div>
                  <div className="text-xs font-semibold">{level.name}</div>
                  <div className="text-xs font-bold">{days}</div>
                </div>
              );
            })}
          </div>
        </ModernCard>
      </div>

      {/* Calendar - Single Month */}
      <div className="max-w-6xl mx-auto">
        <ModernCard className="p-4 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl border-amber-200/50 dark:border-amber-700/50" gradient>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Activity Calendar</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setCurrentMonthOffset(currentMonthOffset - 1)}
                  disabled={!canGoBack()}
                  variant="ghost"
                  size="sm"
                  className="p-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setCurrentMonthOffset(currentMonthOffset + 1)}
                  disabled={!canGoForward()}
                  variant="ghost"
                  size="sm"
                  className="p-1"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white/50 dark:bg-zinc-900/50 rounded-lg p-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
              {currentMonthData.name}
            </h3>
            
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekdays.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: Math.ceil(currentMonthData.days.length / 7) }).map((_, weekIndex) => (
                currentMonthData.days.slice(weekIndex * 7, (weekIndex + 1) * 7).map((dayData, dayIndex) => {
                  if (!dayData) {
                    return <div key={`empty-${weekIndex}-${dayIndex}`} className="w-12 h-12"></div>;
                  }
                  
                  const spiritualLevel = getSpiritualLevel(dayData.count);
                  
                  return (
                    <div
                      key={dayData.date}
                      className={`w-12 h-12 rounded-lg cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-amber-400 relative flex flex-col items-center justify-center text-xs ${
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
                      <div className="text-xs font-medium mb-1">{dayData.day}</div>
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
