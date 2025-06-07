
import React, { useState, useEffect } from 'react';
import { Flag, Trophy } from 'lucide-react';
import ModernCard from './ModernCard';
import { getTodayCount } from '@/utils/indexedDBUtils';
import { getSpiritualLevel } from './SpiritualJourneyLevels';

interface SpiritualLevel {
  id: number;
  title: string;
  description: string;
  requiredJaaps: number;
  maxJaaps: number | null;
  icon: string;
  color: string;
  bgColor: string;
}

const spiritualLevels: SpiritualLevel[] = [
  {
    id: 1,
    title: "Rogi",
    description: "Start your journey",
    requiredJaaps: 0,
    maxJaaps: 0,
    icon: "🏃‍♂️",
    color: "text-gray-600",
    bgColor: "bg-gray-100"
  },
  {
    id: 2,
    title: "Bhogi",
    description: "Experience divine bliss",
    requiredJaaps: 1,
    maxJaaps: 108,
    icon: "🍯",
    color: "text-amber-600",
    bgColor: "bg-amber-100"
  },
  {
    id: 3,
    title: "Yogi",
    description: "Unite with the divine",
    requiredJaaps: 109,
    maxJaaps: 500,
    icon: "🧘‍♂️",
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  {
    id: 4,
    title: "Sadhak",
    description: "Devoted practitioner",
    requiredJaaps: 501,
    maxJaaps: 1000,
    icon: "🕉️",
    color: "text-teal-600",
    bgColor: "bg-teal-100"
  },
  {
    id: 5,
    title: "Tapasvi",
    description: "Master of austerity",
    requiredJaaps: 1001,
    maxJaaps: 1500,
    icon: "🔥",
    color: "text-orange-600",
    bgColor: "bg-orange-100"
  },
  {
    id: 6,
    title: "Rishi",
    description: "Sage of wisdom",
    requiredJaaps: 1501,
    maxJaaps: 2100,
    icon: "🔱",
    color: "text-purple-600",
    bgColor: "bg-purple-100"
  },
  {
    id: 7,
    title: "Jivanmukta",
    description: "Liberated soul",
    requiredJaaps: 2101,
    maxJaaps: null,
    icon: "🪷",
    color: "text-pink-600",
    bgColor: "bg-pink-100"
  }
];

interface SpiritualRoadmapJourneyProps {
  className?: string;
}

const SpiritualRoadmapJourney: React.FC<SpiritualRoadmapJourneyProps> = ({ className = "" }) => {
  const [currentCount, setCurrentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLevel, setCurrentLevel] = useState(0);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const todayCount = await getTodayCount();
        setCurrentCount(todayCount);
        
        // Find current level
        let levelIndex = 0;
        for (let i = spiritualLevels.length - 1; i >= 0; i--) {
          if (todayCount >= spiritualLevels[i].requiredJaaps) {
            levelIndex = i;
            break;
          }
        }
        setCurrentLevel(levelIndex);
      } catch (error) {
        console.error("Error loading progress:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProgress();

    // Listen for jaap count updates
    const handleStorageChange = () => {
      loadProgress();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('jaapCountUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('jaapCountUpdated', handleStorageChange);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-4"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const getCurrentLevelInfo = () => {
    return spiritualLevels[currentLevel];
  };

  const getNextLevelInfo = () => {
    if (currentLevel + 1 < spiritualLevels.length) {
      return spiritualLevels[currentLevel + 1];
    }
    return null;
  };

  const isStepCompleted = (stepIndex: number) => {
    return stepIndex < currentLevel;
  };

  const isCurrentStep = (stepIndex: number) => {
    return stepIndex === currentLevel;
  };

  const getLevelRange = (level: SpiritualLevel) => {
    if (level.maxJaaps === null) {
      return `${level.requiredJaaps}+`;
    }
    if (level.requiredJaaps === 0 && level.maxJaaps === 0) {
      return "0";
    }
    return `${level.requiredJaaps}-${level.maxJaaps}`;
  };

  const allStepsCompleted = currentLevel === spiritualLevels.length - 1 && 
    (spiritualLevels[currentLevel].maxJaaps === null || currentCount >= spiritualLevels[currentLevel].maxJaaps!);

  // Get current level info for activity calendar display
  const currentSpiritualLevel = getSpiritualLevel(currentCount);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Progress Steps */}
      <ModernCard className="p-6 bg-white/90 dark:bg-gray-800/90">
        <div className="relative">
          {/* Step Names and Ranges */}
          <div className="flex justify-between mb-4">
            {spiritualLevels.map((level, index) => (
              <div key={level.id} className="flex flex-col items-center" style={{ width: `${100 / spiritualLevels.length}%` }}>
                <div className={`text-sm font-medium ${
                  isCurrentStep(index) ? 'text-orange-500' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {level.title}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {getLevelRange(level)}
                </div>
              </div>
            ))}
          </div>

          {/* Progress Line and Circles */}
          <div className="relative flex items-center justify-between mb-6">
            {/* Continuous Progress Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 transform -translate-y-1/2 z-0">
              <div 
                className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-700"
                style={{ width: `${(currentLevel / (spiritualLevels.length - 1)) * 100}%` }}
              ></div>
            </div>

            {/* Step Circles */}
            {spiritualLevels.map((level, index) => (
              <div key={level.id} className="relative z-10 flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isStepCompleted(index) 
                    ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white' 
                    : isCurrentStep(index) 
                      ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-500'
                }`}>
                  {isStepCompleted(index) ? (
                    <span className="text-lg">✓</span>
                  ) : (
                    <span className="text-lg">{level.icon}</span>
                  )}
                </div>

                {/* Current Step Flag */}
                {isCurrentStep(index) && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <Flag className="w-6 h-6 text-red-500 animate-pulse" fill="currentColor" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Small Progress Card Below Current Level - Removed background */}
          <div className="flex justify-between">
            {spiritualLevels.map((level, index) => (
              <div key={level.id} className="flex flex-col items-center" style={{ width: `${100 / spiritualLevels.length}%` }}>
                {isCurrentStep(index) && (
                  <div className="rounded-lg p-2 shadow-sm border border-orange-200/30 dark:border-orange-700/30 min-w-[100px] bg-transparent">
                    <div className="text-center">
                      <div className="flex items-center gap-1 mb-1 justify-center">
                        <span className="text-sm">{level.icon}</span>
                        <span className="font-medium text-xs text-gray-900 dark:text-white">{level.title}</span>
                      </div>
                      <div className="text-orange-600 font-bold text-sm mb-1">{currentCount}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">jaaps today</div>
                      
                      {getNextLevelInfo() && (
                        <div className="text-xs text-gray-700 dark:text-gray-300">
                          <span className="font-medium text-orange-600">{getNextLevelInfo()!.requiredJaaps - currentCount}</span> more for <span className="font-medium">{getNextLevelInfo()!.title}</span>
                        </div>
                      )}
                      
                      {allStepsCompleted && (
                        <div className="text-xs text-green-600 font-semibold">
                          🎉 Highest level!
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </ModernCard>

      {/* Activity Calendar Information */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xl">📅</span>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Activity Calendar</h3>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Your daily practice is tracked and displayed with spiritual level icons in the calendar grid.
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <span className="text-lg">🍯</span>
            <div className="text-xs">
              <div className="font-medium text-gray-900 dark:text-white">Bhogi</div>
              <div className="text-gray-600 dark:text-gray-400">1-108 jaaps</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <span className="text-lg">🧘‍♂️</span>
            <div className="text-xs">
              <div className="font-medium text-gray-900 dark:text-white">Yogi</div>
              <div className="text-gray-600 dark:text-gray-400">109-500 jaaps</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <span className="text-lg">🕉️</span>
            <div className="text-xs">
              <div className="font-medium text-gray-900 dark:text-white">Sadhak</div>
              <div className="text-gray-600 dark:text-gray-400">501-1000 jaaps</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <span className="text-lg">🪷</span>
            <div className="text-xs">
              <div className="font-medium text-gray-900 dark:text-white">Jivanmukta</div>
              <div className="text-gray-600 dark:text-gray-400">2100+ jaaps</div>
            </div>
          </div>
        </div>

        <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
          <div className="flex items-center gap-2">
            <span className="text-lg">{currentSpiritualLevel.icon}</span>
            <div className="text-sm">
              <span className="font-medium text-amber-800 dark:text-amber-200">Today's Level: {currentSpiritualLevel.name}</span>
              <div className="text-amber-700 dark:text-amber-300">With {currentCount} jaaps, you've reached {currentSpiritualLevel.name} level today!</div>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Message */}
      {allStepsCompleted && (
        <ModernCard className="p-6 bg-gradient-to-r from-green-50/90 to-emerald-50/90 dark:from-green-900/20 dark:to-emerald-900/20">
          <div className="text-center">
            <Flag className="w-12 h-12 text-green-500 mx-auto mb-4" fill="currentColor" />
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">
              🎉 Congratulations! 🎉
            </div>
            <div className="text-lg text-green-600 dark:text-green-400 mb-2">
              You have reached Jivanmukta level!
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">
              You've achieved the highest spiritual level. Keep practicing for continued growth!
            </div>
          </div>
        </ModernCard>
      )}
    </div>
  );
};

export default SpiritualRoadmapJourney;
