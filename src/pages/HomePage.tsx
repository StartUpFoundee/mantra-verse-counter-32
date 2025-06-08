import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Mic, 
  Edit3, 
  BarChart3, 
  Calendar, 
  User, 
  Settings, 
  Download,
  Clock,
  Trophy,
  Target,
  Flame
} from "lucide-react";
import { getStoredUserData } from "@/utils/spiritualIdUtils";
import { getMantrasCount, getDailyGoal, getStreakCount } from "@/utils/indexedDBUtils";
import ModernCard from "@/components/ModernCard";
import DigitalClock from "@/components/DigitalClock";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [stats, setStats] = useState({
    mantrasCount: 0,
    dailyGoal: 108,
    streakCount: 0
  });

  useEffect(() => {
    // Load user data
    const userData = getStoredUserData();
    setUserInfo(userData);

    // Load stats
    const loadStats = async () => {
      try {
        const [mantras, goal, streak] = await Promise.all([
          getMantrasCount(),
          getDailyGoal(),
          getStreakCount()
        ]);
        
        setStats({
          mantrasCount: mantras || 0,
          dailyGoal: goal || 108,
          streakCount: streak || 0
        });
      } catch (error) {
        console.error("Failed to load stats:", error);
      }
    };

    loadStats();
  }, []);

  const progressPercentage = Math.min((stats.mantrasCount / stats.dailyGoal) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-zinc-900 dark:via-black dark:to-zinc-800 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Clock */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
              Welcome Back{userInfo?.name ? `, ${userInfo.name.split(' ')[0]}` : ''}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Continue your spiritual journey with mantras
            </p>
          </div>
          
          {/* Digital Clock */}
          <ModernCard className="p-4 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border-amber-200/50 dark:border-amber-700/50">
            <DigitalClock showDate={false} />
          </ModernCard>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-12">
          <ModernCard className="p-6 lg:p-8 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 border-blue-300/30 dark:border-blue-600/30" gradient>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Target className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg lg:text-xl font-semibold text-blue-600 dark:text-blue-400 mb-1">Today's Goal</h3>
                <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{stats.mantrasCount}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">of {stats.dailyGoal} mantras</p>
                <div className="w-full bg-blue-200/50 dark:bg-blue-800/50 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </ModernCard>

          <ModernCard className="p-6 lg:p-8 bg-gradient-to-br from-orange-400/20 to-red-500/20 border-orange-300/30 dark:border-orange-600/30" gradient>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <Flame className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg lg:text-xl font-semibold text-orange-600 dark:text-orange-400 mb-1">Streak</h3>
                <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{stats.streakCount}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">days in a row</p>
              </div>
            </div>
          </ModernCard>

          <ModernCard className="p-6 lg:p-8 bg-gradient-to-br from-green-400/20 to-emerald-500/20 border-green-300/30 dark:border-green-600/30" gradient>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <Trophy className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg lg:text-xl font-semibold text-green-600 dark:text-green-400 mb-1">Achievement</h3>
                <div className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">
                  {progressPercentage >= 100 ? 'Goal Complete!' : `${Math.round(progressPercentage)}% Done`}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">today's progress</p>
              </div>
            </div>
          </ModernCard>
        </div>

        {/* Main Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-8 lg:mb-12">
          <ModernCard 
            className="p-6 lg:p-8 cursor-pointer hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-amber-400/20 to-orange-500/20 border-amber-300/30 dark:border-amber-600/30 hover:scale-105" 
            gradient
            onClick={() => navigate('/audio')}
          >
            <div className="flex items-center gap-4 lg:gap-6">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Mic className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl lg:text-2xl font-bold text-amber-600 dark:text-amber-400 mb-2">Audio Counting</h2>
                <p className="text-gray-700 dark:text-gray-300 text-sm lg:text-base">
                  Use voice commands or sound detection to count your mantras automatically
                </p>
              </div>
            </div>
          </ModernCard>

          <ModernCard 
            className="p-6 lg:p-8 cursor-pointer hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-blue-400/20 to-purple-500/20 border-blue-300/30 dark:border-blue-600/30 hover:scale-105" 
            gradient
            onClick={() => navigate('/manual')}
          >
            <div className="flex items-center gap-4 lg:gap-6">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Edit3 className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">Manual Counting</h2>
                <p className="text-gray-700 dark:text-gray-300 text-sm lg:text-base">
                  Track your mantras manually with an intuitive tap interface
                </p>
              </div>
            </div>
          </ModernCard>
        </div>

        {/* Secondary Features Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <ModernCard 
            className="p-4 lg:p-6 cursor-pointer hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border-gray-200/50 dark:border-zinc-700/50 hover:scale-105" 
            onClick={() => navigate('/active-days')}
          >
            <div className="text-center">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg">
                <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm lg:text-base mb-1">Active Days</h3>
              <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-300">View your progress calendar</p>
            </div>
          </ModernCard>

          <ModernCard 
            className="p-4 lg:p-6 cursor-pointer hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border-gray-200/50 dark:border-zinc-700/50 hover:scale-105" 
            onClick={() => navigate('/spiritual-id')}
          >
            <div className="text-center">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm lg:text-base mb-1">Profile</h3>
              <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-300">Manage your spiritual identity</p>
            </div>
          </ModernCard>

          <ModernCard 
            className="p-4 lg:p-6 cursor-pointer hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border-gray-200/50 dark:border-zinc-700/50 hover:scale-105" 
            onClick={() => navigate('/time-tracking')}
          >
            <div className="text-center">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg">
                <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm lg:text-base mb-1">Time Tracking</h3>
              <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-300">See your usage patterns</p>
            </div>
          </ModernCard>

          <ModernCard 
            className="p-4 lg:p-6 cursor-pointer hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border-gray-200/50 dark:border-zinc-700/50 hover:scale-105" 
            onClick={() => navigate('/identity-guide')}
          >
            <div className="text-center">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg">
                <Download className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm lg:text-base mb-1">Guide</h3>
              <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-300">Learn about features</p>
            </div>
          </ModernCard>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
