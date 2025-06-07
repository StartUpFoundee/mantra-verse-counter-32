
import React, { useState, useEffect } from 'react';
import { Trophy, Star, Sparkles, Crown, Flame, Mountain, Sun, Flag } from 'lucide-react';
import ModernCard from './ModernCard';
import { getTodayCount } from '@/utils/indexedDBUtils';

interface RoadmapLevel {
  id: number;
  title: string;
  description: string;
  requiredJaaps: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  position: { x: number; y: number };
}

const roadmapLevels: RoadmapLevel[] = [
  {
    id: 1,
    title: "Rogi",
    description: "Start your journey",
    requiredJaaps: 0,
    icon: <div className="text-lg">🏃‍♂️</div>,
    color: "text-gray-600",
    bgColor: "bg-gray-500",
    position: { x: 10, y: 60 }
  },
  {
    id: 2,
    title: "Bhogi",
    description: "Experience divine bliss",
    requiredJaaps: 1,
    icon: <div className="text-lg">🍯</div>,
    color: "text-amber-600",
    bgColor: "bg-amber-500",
    position: { x: 25, y: 40 }
  },
  {
    id: 3,
    title: "Yogi",
    description: "Unite with the divine",
    requiredJaaps: 109,
    icon: <div className="text-lg">🧘‍♂️</div>,
    color: "text-blue-600",
    bgColor: "bg-blue-500",
    position: { x: 40, y: 60 }
  },
  {
    id: 4,
    title: "Sadhak",
    description: "Devoted practitioner",
    requiredJaaps: 501,
    icon: <div className="text-lg">🕉️</div>,
    color: "text-teal-600",
    bgColor: "bg-teal-500",
    position: { x: 55, y: 40 }
  },
  {
    id: 5,
    title: "Tapasvi",
    description: "Master of austerity",
    requiredJaaps: 1001,
    icon: <div className="text-lg">🔥</div>,
    color: "text-orange-600",
    bgColor: "bg-orange-500",
    position: { x: 70, y: 60 }
  },
  {
    id: 6,
    title: "Rishi",
    description: "Sage of wisdom",
    requiredJaaps: 1501,
    icon: <div className="text-lg">🔱</div>,
    color: "text-purple-600",
    bgColor: "bg-purple-500",
    position: { x: 85, y: 40 }
  }
];

interface SpiritualRoadmapJourneyProps {
  className?: string;
}

const SpiritualRoadmapJourney: React.FC<SpiritualRoadmapJourneyProps> = ({ className = "" }) => {
  const [currentCount, setCurrentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const todayCount = await getTodayCount();
        setCurrentCount(todayCount);
        
        // Find current level
        let levelIndex = 0;
        for (let i = roadmapLevels.length - 1; i >= 0; i--) {
          if (todayCount >= roadmapLevels[i].requiredJaaps) {
            levelIndex = i;
            break;
          }
        }
        setCurrentLevel(levelIndex);

        // Show celebration if user completed all levels
        if (levelIndex === roadmapLevels.length - 1 && todayCount >= roadmapLevels[levelIndex].requiredJaaps) {
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 5000);
        }
      } catch (error) {
        console.error("Error loading progress:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProgress();
  }, []);

  if (isLoading) {
    return (
      <ModernCard className={`p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </ModernCard>
    );
  }

  const getCurrentLevelInfo = () => {
    return roadmapLevels[currentLevel];
  };

  const getNextLevelInfo = () => {
    if (currentLevel + 1 < roadmapLevels.length) {
      return roadmapLevels[currentLevel + 1];
    }
    return null;
  };

  const getPathLength = () => {
    if (currentLevel === 0 && currentCount === 0) return 0;
    return ((currentLevel + 1) / roadmapLevels.length) * 100;
  };

  const getCelebrationMessage = () => {
    const messages = [
      "🎉 Congratulations! You've completed your spiritual journey for today!",
      "✨ Amazing! You've reached the highest level of practice today!",
      "🌟 Excellent work! Your dedication is truly inspiring!",
      "🏆 Fantastic! You've achieved spiritual mastery for today!"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <ModernCard className={`p-6 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-xl border-amber-200/50 dark:border-amber-700/50 ${className}`} gradient>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
            <Sun className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Spiritual Journey</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Follow the path to enlightenment</p>
          </div>
        </div>
      </div>

      {/* Animated Roadmap */}
      <div className="relative h-40 mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/20 dark:to-indigo-900/20">
        {/* Background Road */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Road Base */}
          <path
            d="M 5 60 Q 20 30 35 50 Q 50 20 65 40 Q 80 20 95 50"
            stroke="#374151"
            strokeWidth="8"
            fill="none"
            className="drop-shadow-sm"
          />
          
          {/* Animated Progress Path */}
          <path
            d="M 5 60 Q 20 30 35 50 Q 50 20 65 40 Q 80 20 95 50"
            stroke="url(#progressGradient)"
            strokeWidth="6"
            fill="none"
            strokeDasharray="100"
            strokeDashoffset={100 - getPathLength()}
            className="transition-all duration-1000 ease-out"
          />
          
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>
          
          {/* Road Dashes */}
          <path
            d="M 5 60 Q 20 30 35 50 Q 50 20 65 40 Q 80 20 95 50"
            stroke="#ffffff"
            strokeWidth="1"
            fill="none"
            strokeDasharray="3,3"
            className="opacity-60"
          />
        </svg>

        {/* Journey Levels */}
        {roadmapLevels.map((level, index) => {
          const isCompleted = currentCount >= level.requiredJaaps;
          const isCurrent = index === currentLevel;
          const isReached = index <= currentLevel;
          
          return (
            <div
              key={level.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
              style={{ 
                left: `${level.position.x}%`, 
                top: `${level.position.y}%` 
              }}
            >
              {/* Level Marker */}
              <div className={`relative w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ${
                isCompleted 
                  ? `${level.bgColor} text-white scale-110 shadow-xl` 
                  : isCurrent 
                    ? 'bg-blue-500 text-white scale-105 animate-pulse shadow-xl' 
                    : isReached
                      ? 'bg-amber-400 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
              }`}>
                {level.icon}
                
                {/* Flag for current position */}
                {isCurrent && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <Flag className="w-6 h-6 text-red-500 animate-bounce" />
                  </div>
                )}
                
                {/* Completion Ring */}
                {isCompleted && (
                  <div className="absolute -inset-2 rounded-full border-2 border-yellow-400 animate-ping"></div>
                )}
              </div>
            </div>
          );
        })}

        {/* Animated Mala/Character */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-out"
          style={{ 
            left: `${roadmapLevels[currentLevel]?.position.x || 10}%`, 
            top: `${(roadmapLevels[currentLevel]?.position.y || 60) + 15}%` 
          }}
        >
          <div className="text-2xl animate-bounce">📿</div>
        </div>
      </div>

      {/* Current Level Info */}
      <div className="mb-4">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4">
          <div className="flex items-center gap-4 mb-3">
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${getCurrentLevelInfo().bgColor} text-white shadow-lg`}>
              {getCurrentLevelInfo().icon}
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">{getCurrentLevelInfo().title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{getCurrentLevelInfo().description}</p>
              <div className="text-lg font-semibold text-amber-600 dark:text-amber-400 mt-1">
                {currentCount} jaaps completed
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Step Card */}
      {getNextLevelInfo() ? (
        <div className="bg-white dark:bg-zinc-700 rounded-xl p-4 border-2 border-dashed border-amber-300 dark:border-amber-600">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🎯 Next Goal: {getNextLevelInfo()!.title}
            </div>
            <div className="text-amber-600 dark:text-amber-400 font-semibold">
              Complete {getNextLevelInfo()!.requiredJaaps - currentCount} more jaaps to reach the next level
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-600 rounded-full mt-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-1000 ease-out rounded-full"
                style={{ 
                  width: `${Math.min(100, (currentCount / getNextLevelInfo()!.requiredJaaps) * 100)}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-700">
          <div className="text-center">
            <div className="text-2xl mb-2">🎉</div>
            <div className="text-lg font-bold text-green-700 dark:text-green-300 mb-1">
              Congratulations!
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">
              You've completed all spiritual levels for today. Your dedication is truly inspiring!
            </div>
          </div>
        </div>
      )}

      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 mx-4 max-w-md text-center animate-scale-in">
            <div className="text-6xl mb-4 animate-bounce">🎊</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Amazing Achievement!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {getCelebrationMessage()}
            </p>
            <div className="text-4xl animate-pulse">✨ 📿 ✨</div>
          </div>
        </div>
      )}
    </ModernCard>
  );
};

export default SpiritualRoadmapJourney;
