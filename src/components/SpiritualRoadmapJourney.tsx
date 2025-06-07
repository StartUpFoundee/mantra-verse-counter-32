
import React, { useState, useEffect } from 'react';
import { Trophy, Star, Sparkles, Crown, Flame, Mountain, Sun } from 'lucide-react';
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
    title: "Seeker",
    description: "Begin your journey",
    requiredJaaps: 5,
    icon: <Star className="w-6 h-6" />,
    color: "text-cyan-600",
    bgColor: "bg-cyan-500",
    position: { x: 10, y: 80 }
  },
  {
    id: 2,
    title: "Devotee",
    description: "Growing stronger",
    requiredJaaps: 25,
    icon: <Sparkles className="w-6 h-6" />,
    color: "text-green-600",
    bgColor: "bg-green-500",
    position: { x: 25, y: 60 }
  },
  {
    id: 3,
    title: "Practitioner",
    description: "Dedicated path",
    requiredJaaps: 108,
    icon: <Flame className="w-6 h-6" />,
    color: "text-orange-600",
    bgColor: "bg-orange-500",
    position: { x: 50, y: 40 }
  },
  {
    id: 4,
    title: "Sage",
    description: "Wisdom awakens",
    requiredJaaps: 500,
    icon: <Mountain className="w-6 h-6" />,
    color: "text-purple-600",
    bgColor: "bg-purple-500",
    position: { x: 75, y: 25 }
  },
  {
    id: 5,
    title: "Enlightened",
    description: "Divine consciousness",
    requiredJaaps: 1000,
    icon: <Crown className="w-6 h-6" />,
    color: "text-yellow-600",
    bgColor: "bg-yellow-500",
    position: { x: 90, y: 10 }
  }
];

interface SpiritualRoadmapJourneyProps {
  className?: string;
}

const SpiritualRoadmapJourney: React.FC<SpiritualRoadmapJourneyProps> = ({ className = "" }) => {
  const [currentCount, setCurrentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [showCongrats, setShowCongrats] = useState(false);

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
        
        // Show congrats if user completed a level
        if (levelIndex === roadmapLevels.length - 1 && todayCount >= roadmapLevels[levelIndex].requiredJaaps) {
          setShowCongrats(true);
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
      <ModernCard className={`p-8 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </ModernCard>
    );
  }

  const getLevelStatus = (levelIndex: number) => {
    if (currentCount >= roadmapLevels[levelIndex].requiredJaaps) {
      return 'completed';
    } else if (levelIndex === currentLevel + 1 || (currentCount === 0 && levelIndex === 0)) {
      return 'current';
    } else {
      return 'upcoming';
    }
  };

  const getProgressPercentage = () => {
    const nextLevel = roadmapLevels[currentLevel + 1];
    if (!nextLevel) return 100;
    
    const currentRequired = roadmapLevels[currentLevel]?.requiredJaaps || 0;
    const progress = ((currentCount - currentRequired) / (nextLevel.requiredJaaps - currentRequired)) * 100;
    return Math.max(0, Math.min(100, progress));
  };

  // SVG Path for the winding road
  const pathData = "M 50 400 Q 150 350 250 300 Q 350 250 450 200 Q 550 150 650 100 Q 750 50 850 25";

  return (
    <ModernCard className={`p-6 lg:p-8 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-xl border-amber-200/50 dark:border-amber-700/50 ${className}`} gradient>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
            <Sun className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Spiritual Journey</h3>
            <p className="text-gray-600 dark:text-gray-400">Follow the path to enlightenment</p>
          </div>
        </div>
        
        {/* Current Progress Display */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 mb-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-amber-600 dark:text-amber-400 mb-2">{currentCount}</div>
            <div className="text-lg text-gray-700 dark:text-gray-300 mb-4">Jaaps completed today</div>
            
            {/* Next Goal */}
            {roadmapLevels[currentLevel + 1] && (
              <div className="flex items-center justify-center gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Next: {roadmapLevels[currentLevel + 1].title}
                </div>
                <div className="flex-1 max-w-48 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-1000 ease-out"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
                <div className="text-sm font-medium text-amber-600 dark:text-amber-400">
                  {roadmapLevels[currentLevel + 1].requiredJaaps - currentCount} more
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Roadmap Journey */}
      <div className="relative h-80 lg:h-96 overflow-hidden rounded-2xl bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/20 dark:to-indigo-900/20">
        {/* Winding Road SVG */}
        <svg 
          className="absolute inset-0 w-full h-full" 
          viewBox="0 0 900 400" 
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Road Background */}
          <path
            d={pathData}
            stroke="#374151"
            strokeWidth="40"
            fill="none"
            className="drop-shadow-lg"
          />
          {/* Road Lines */}
          <path
            d={pathData}
            stroke="#ffffff"
            strokeWidth="4"
            fill="none"
            strokeDasharray="20,15"
            className="animate-pulse"
          />
        </svg>

        {/* Journey Levels */}
        {roadmapLevels.map((level, index) => {
          const status = getLevelStatus(index);
          const isCompleted = status === 'completed';
          const isCurrent = status === 'current';
          
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
              <div className={`relative w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center shadow-xl transition-all duration-500 ${
                isCompleted 
                  ? `${level.bgColor} text-white scale-110 animate-bounce` 
                  : isCurrent 
                    ? 'bg-blue-500 text-white scale-105 animate-pulse shadow-2xl' 
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
              }`}>
                {isCompleted ? (
                  <Trophy className="w-8 h-8 lg:w-10 lg:h-10" />
                ) : (
                  level.icon
                )}
                
                {/* Completion Ring */}
                {isCompleted && (
                  <div className="absolute -inset-2 rounded-full border-4 border-yellow-400 animate-ping"></div>
                )}
              </div>
              
              {/* Level Info Card */}
              <div className={`absolute top-20 left-1/2 transform -translate-x-1/2 w-32 lg:w-40 transition-all duration-300 ${
                isCurrent || isCompleted ? 'opacity-100 scale-100' : 'opacity-60 scale-90'
              }`}>
                <div className={`p-3 lg:p-4 rounded-xl text-center shadow-lg ${
                  isCompleted 
                    ? 'bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700' 
                    : isCurrent 
                      ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700' 
                      : 'bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-600'
                }`}>
                  <h4 className={`font-bold text-sm lg:text-base mb-1 ${
                    isCompleted 
                      ? 'text-green-700 dark:text-green-400' 
                      : isCurrent 
                        ? 'text-blue-700 dark:text-blue-400' 
                        : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {level.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{level.description}</p>
                  <div className="text-xs font-medium">
                    <span className={`${
                      isCompleted 
                        ? 'text-green-600 dark:text-green-400' 
                        : isCurrent 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-500 dark:text-gray-500'
                    }`}>
                      {level.requiredJaaps} jaaps
                    </span>
                  </div>
                  {isCompleted && (
                    <div className="mt-2 text-green-600 dark:text-green-400 text-xs font-bold">
                      ✓ Complete!
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Motivational Message */}
      <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl">
        <div className="text-center">
          {showCongrats ? (
            <div className="space-y-3">
              <div className="text-4xl animate-bounce">🎉</div>
              <h4 className="text-xl font-bold text-amber-700 dark:text-amber-300">
                Congratulations! 
              </h4>
              <p className="text-amber-600 dark:text-amber-200">
                You've completed all levels for today! You are truly on the path to enlightenment.
              </p>
            </div>
          ) : currentCount === 0 ? (
            <div className="space-y-2">
              <div className="text-2xl">🌅</div>
              <p className="text-amber-700 dark:text-amber-300">
                Start your spiritual journey today! Complete your first 5 jaaps to begin.
              </p>
            </div>
          ) : roadmapLevels[currentLevel + 1] ? (
            <div className="space-y-2">
              <div className="text-2xl">🚀</div>
              <p className="text-amber-700 dark:text-amber-300">
                You're making great progress! Just {roadmapLevels[currentLevel + 1].requiredJaaps - currentCount} more jaaps to reach "{roadmapLevels[currentLevel + 1].title}"
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </ModernCard>
  );
};

export default SpiritualRoadmapJourney;
