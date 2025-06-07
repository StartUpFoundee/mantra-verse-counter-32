
import React, { useState, useEffect } from 'react';
import { Flag, Trophy } from 'lucide-react';
import ModernCard from './ModernCard';
import { getTodayCount } from '@/utils/indexedDBUtils';

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
    requiredJaaps: 2100,
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
    
    // Custom event for same-tab updates
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

  const allStepsCompleted = currentLevel === spiritualLevels.length - 1 && 
    (spiritualLevels[currentLevel].maxJaaps === null || currentCount >= spiritualLevels[currentLevel].maxJaaps!);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Simple Step Progress Bar */}
      <ModernCard className="p-4 bg-white/90 dark:bg-gray-800/90">
        <div className="flex items-center justify-between mb-6">
          {spiritualLevels.map((level, index) => (
            <div key={level.id} className="flex flex-col items-center relative">
              {/* Connection Line */}
              {index < spiritualLevels.length - 1 && (
                <div className="absolute top-6 left-8 w-12 sm:w-16 md:w-20 lg:w-24 h-1 bg-gray-200 dark:bg-gray-700 z-0">
                  {isStepCompleted(index) && (
                    <div className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-500"></div>
                  )}
                </div>
              )}
              
              {/* Step Circle */}
              <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                isStepCompleted(index) 
                  ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white scale-110' 
                  : isCurrentStep(index) 
                    ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white scale-110' 
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-500'
              }`}>
                {isStepCompleted(index) ? (
                  <span className="text-lg">✓</span>
                ) : isCurrentStep(index) ? (
                  <span className="text-lg">{level.icon}</span>
                ) : (
                  <span className="text-lg">{level.icon}</span>
                )}
              </div>
              
              {/* Step Label */}
              <div className="mt-2 text-center">
                <div className={`text-xs font-medium ${
                  isCurrentStep(index) ? 'text-orange-500' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {index === 0 ? 'Step 1' : 
                   index === spiritualLevels.length - 1 ? 'Finish' : 
                   `Step ${index + 1}`}
                </div>
                {isCurrentStep(index) && (
                  <div className="text-xs text-orange-500 font-semibold">Current step</div>
                )}
              </div>

              {/* Current Step Flag */}
              {isCurrentStep(index) && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Flag className="w-4 h-4 text-red-500 animate-pulse" fill="currentColor" />
                </div>
              )}
            </div>
          ))}
        </div>
      </ModernCard>

      {/* Current Level Card */}
      <ModernCard className="p-4 bg-white/90 dark:bg-gray-800/90">
        <div className="flex items-center gap-3">
          <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${getCurrentLevelInfo().bgColor} shadow-sm`}>
            <div className="text-2xl">{getCurrentLevelInfo().icon}</div>
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-bold text-gray-900 dark:text-white">{getCurrentLevelInfo().title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{getCurrentLevelInfo().description}</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-orange-500">{currentCount}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">jaaps completed today</span>
            </div>
          </div>
        </div>
      </ModernCard>

      {/* Next Level Card or Completion */}
      {!allStepsCompleted && getNextLevelInfo() ? (
        <ModernCard className="p-4 bg-gradient-to-r from-orange-50/90 to-amber-50/90 dark:from-orange-900/20 dark:to-amber-900/20 border-2 border-dashed border-orange-300/50">
          <div className="text-center">
            <div className="text-3xl mb-2">{getNextLevelInfo()!.icon}</div>
            <div className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-1">
              Next Level: {getNextLevelInfo()!.title}
            </div>
            <div className="text-sm text-orange-700 dark:text-orange-300 mb-3">
              You are at {getCurrentLevelInfo().title}. To reach {getNextLevelInfo()!.title}, do {getNextLevelInfo()!.requiredJaaps} naam jaapa
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-700 ease-out rounded-full"
                style={{ 
                  width: `${Math.min(100, (currentCount / getNextLevelInfo()!.requiredJaaps) * 100)}%` 
                }}
              ></div>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              {currentCount} / {getNextLevelInfo()!.requiredJaaps} jaaps
            </div>
          </div>
        </ModernCard>
      ) : (
        <ModernCard className="p-6 bg-gradient-to-r from-green-50/90 to-emerald-50/90 dark:from-green-900/20 dark:to-emerald-900/20">
          <div className="text-center">
            <Flag className="w-12 h-12 text-green-500 mx-auto mb-4" fill="currentColor" />
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">
              🎉 Congratulations! 🎉
            </div>
            <div className="text-lg text-green-600 dark:text-green-400 mb-2">
              You have finished all steps for today!
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">
              You've reached the highest spiritual level. Keep practicing for continued growth!
            </div>
          </div>
        </ModernCard>
      )}
    </div>
  );
};

export default SpiritualRoadmapJourney;
