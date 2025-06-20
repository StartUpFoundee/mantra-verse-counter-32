import React, { useState, useEffect } from 'react';
import { Flag, Trophy } from 'lucide-react';
import ModernCard from './ModernCard';
import { getTodayCount } from '@/utils/indexedDBUtils';
import { getSpiritualLevel } from './SpiritualJourneyLevels';
import { useIsMobile } from '@/hooks/use-mobile';

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
    description: "Starting point of the journey",
    requiredJaaps: 0,
    maxJaaps: 0,
    icon: "🤒",
    color: "text-gray-600",
    bgColor: "bg-gray-100"
  },
  {
    id: 2,
    title: "Bhogi",
    description: "Experience divine bliss",
    requiredJaaps: 1,
    maxJaaps: 308,
    icon: "🍯",
    color: "text-amber-600",
    bgColor: "bg-amber-100"
  },
  {
    id: 3,
    title: "Yogi",
    description: "Unite with the divine",
    requiredJaaps: 309,
    maxJaaps: 508,
    icon: "🧘‍♂️",
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  {
    id: 4,
    title: "Sadhak",
    description: "Devoted practitioner",
    requiredJaaps: 509,
    maxJaaps: 708,
    icon: "🕉️",
    color: "text-teal-600",
    bgColor: "bg-teal-100"
  },
  {
    id: 5,
    title: "Tapasvi",
    description: "Master of austerity",
    requiredJaaps: 709,
    maxJaaps: 1007,
    icon: "🔥",
    color: "text-orange-600",
    bgColor: "bg-orange-100"
  },
  {
    id: 6,
    title: "Bhakti",
    description: "Pure devotion and love",
    requiredJaaps: 1008,
    maxJaaps: null,
    icon: "🙏",
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
  const isMobile = useIsMobile();

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

  // Mobile view with stacked layout
  if (isMobile) {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* Text above roadmap */}
        <div className="text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Daily target of 2100 jaapa must complete
          </p>
        </div>

        {/* Mobile Grid Layout */}
        <div className="px-4">
          <div className="grid grid-cols-3 gap-3 mb-6">
            {spiritualLevels.map((level, index) => (
              <div key={level.id} className="flex flex-col items-center space-y-2">
                {/* Level Name and Range */}
                <div className="text-center">
                  <div className={`text-xs font-medium ${
                    isCurrentStep(index) ? 'text-orange-500' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {level.title}
                  </div>
                  <div className="text-xs text-gray-400">
                    {getLevelRange(level)}
                  </div>
                </div>

                {/* Icon Circle with Flag */}
                <div className="relative flex flex-col items-center">
                  {/* Flag above current step */}
                  {isCurrentStep(index) && (
                    <div className="mb-1 animate-pulse">
                      <Flag className="w-4 h-4 text-red-500" fill="currentColor" />
                    </div>
                  )}
                  
                  {/* Icon Circle */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                    isStepCompleted(index) || isCurrentStep(index)
                      ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white scale-110' 
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-500'
                  }`}>
                    <span className="text-base filter drop-shadow-sm">{level.icon}</span>
                  </div>
                </div>

                {/* Progress Line Below Icon */}
                <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-700 ${
                      isStepCompleted(index) || isCurrentStep(index)
                        ? 'bg-gradient-to-r from-orange-400 to-red-500 w-full' 
                        : 'w-0'
                    }`}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Current Level Card - Positioned to touch current icon */}
          <div className="relative">
            {spiritualLevels.map((level, index) => (
              isCurrentStep(index) && (
                <div key={level.id} className="flex justify-center animate-fade-in">
                  <div className="p-4 min-w-[200px] bg-white/95 dark:bg-gray-800/95 rounded-2xl shadow-xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 -mt-2">
                    <div className="text-center">
                      <div className="flex items-center gap-2 mb-2 justify-center">
                        <span className="text-xl">{level.icon}</span>
                        <span className="font-semibold text-base text-gray-900 dark:text-white">{level.title}</span>
                      </div>
                      <div className="text-orange-600 font-bold text-2xl mb-1">{currentCount}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">jaaps today</div>
                      
                      {getNextLevelInfo() && (
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-semibold text-orange-600">{getNextLevelInfo()!.requiredJaaps - currentCount}</span> more for{' '}
                          <span className="font-medium">{getNextLevelInfo()!.title}</span>
                        </div>
                      )}
                      
                      {allStepsCompleted && (
                        <div className="text-sm text-green-600 font-semibold">
                          🎉 Highest level!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        {/* ... keep existing code (completion message) */}
        {allStepsCompleted && (
          <ModernCard className="p-6 bg-gradient-to-r from-green-50/90 to-emerald-50/90 dark:from-green-900/20 dark:to-emerald-900/20">
            <div className="text-center">
              <Flag className="w-12 h-12 text-green-500 mx-auto mb-4" fill="currentColor" />
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">
                🎉 Congratulations! 🎉
              </div>
              <div className="text-lg text-green-600 dark:text-green-400 mb-2">
                You have reached Bhakti level!
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                You've achieved the highest spiritual level. Keep practicing for continued growth!
              </div>
            </div>
          </ModernCard>
        )}
      </div>
    );
  }

  // Desktop view with horizontal layout
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Text above roadmap - minimal space */}
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Daily target of 2100 jaapa must complete
        </p>
      </div>

      {/* Progress Steps - No background card */}
      <div className="p-6">
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
          <div className="relative flex items-center justify-between mb-2">
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
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                  isStepCompleted(index) 
                    ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white' 
                    : isCurrentStep(index) 
                      ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-500'
                }`}>
                  <span className="text-lg filter drop-shadow-sm">{level.icon}</span>
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

          {/* White Card Below Current Level - Positioned to touch the icon */}
          <div className="flex justify-between">
            {spiritualLevels.map((level, index) => (
              <div key={level.id} className="flex flex-col items-center" style={{ width: `${100 / spiritualLevels.length}%` }}>
                {isCurrentStep(index) && (
                  <div className="-mt-1 p-3 min-w-[120px] bg-white/95 dark:bg-gray-800/95 rounded-xl shadow-lg backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 animate-scale-in">
                    <div className="text-center">
                      <div className="flex items-center gap-1 mb-1 justify-center">
                        <span className="text-lg">{level.icon}</span>
                        <span className="font-semibold text-sm text-gray-900 dark:text-white">{level.title}</span>
                      </div>
                      <div className="text-orange-600 font-bold text-lg mb-1">{currentCount}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">jaaps today</div>
                      
                      {getNextLevelInfo() && (
                        <div className="text-xs text-gray-700 dark:text-gray-300">
                          <span className="font-semibold text-orange-600">{getNextLevelInfo()!.requiredJaaps - currentCount}</span> more for <span className="font-medium">{getNextLevelInfo()!.title}</span>
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
              You have reached Bhakti level!
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
