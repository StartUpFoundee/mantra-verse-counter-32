
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
    title: "Rogi",
    description: "0 jaaps",
    requiredJaaps: 0,
    icon: <div className="w-6 h-6 bg-gray-400 rounded-full"></div>,
    color: "text-gray-600",
    bgColor: "bg-gray-500",
    position: { x: 5, y: 80 }
  },
  {
    id: 2,
    title: "Bhogi",
    description: "1-108",
    requiredJaaps: 1,
    icon: <div className="text-lg">🍯</div>,
    color: "text-amber-600",
    bgColor: "bg-amber-500",
    position: { x: 20, y: 40 }
  },
  {
    id: 3,
    title: "Yogi",
    description: "109-500",
    requiredJaaps: 109,
    icon: <div className="text-lg">🧘‍♂️</div>,
    color: "text-blue-600",
    bgColor: "bg-blue-500",
    position: { x: 35, y: 80 }
  },
  {
    id: 4,
    title: "Sadhak",
    description: "501-1000",
    requiredJaaps: 501,
    icon: <div className="text-lg">🕉️</div>,
    color: "text-teal-600",
    bgColor: "bg-teal-500",
    position: { x: 50, y: 40 }
  },
  {
    id: 5,
    title: "Tapasvi",
    description: "1001-1500",
    requiredJaaps: 1001,
    icon: <div className="text-lg">🔥</div>,
    color: "text-orange-600",
    bgColor: "bg-orange-500",
    position: { x: 65, y: 80 }
  },
  {
    id: 6,
    title: "Rishi",
    description: "1501-2100",
    requiredJaaps: 1501,
    icon: <div className="text-lg">🔱</div>,
    color: "text-purple-600",
    bgColor: "bg-purple-500",
    position: { x: 80, y: 40 }
  },
  {
    id: 7,
    title: "Jivanmukta",
    description: "2100+",
    requiredJaaps: 2100,
    icon: <div className="text-lg">🧘‍♀️</div>,
    color: "text-pink-600",
    bgColor: "bg-pink-500",
    position: { x: 95, y: 80 }
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
        for (let i = roadmapLevels.length - 1; i >= 0; i--) {
          if (todayCount >= roadmapLevels[i].requiredJaaps) {
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
  }, []);

  if (isLoading) {
    return (
      <ModernCard className={`p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
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

  const getNextTarget = () => {
    const nextLevel = roadmapLevels[currentLevel + 1];
    if (!nextLevel) return null;
    
    const needed = nextLevel.requiredJaaps - currentCount;
    return {
      level: nextLevel,
      needed: needed
    };
  };

  const nextTarget = getNextTarget();

  // Zigzag path data
  const zigzagPath = "M 20 60 L 120 40 L 220 60 L 320 40 L 420 60 L 520 40 L 620 60 L 720 40 L 820 60";

  return (
    <ModernCard className={`p-4 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-xl border-amber-200/50 dark:border-amber-700/50 ${className}`} gradient>
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
            <Sun className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Spiritual Journey</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Follow the path to enlightenment</p>
          </div>
        </div>
      </div>

      {/* Roadmap Journey - Compact Version */}
      <div className="relative h-24 overflow-hidden rounded-xl bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/20 dark:to-indigo-900/20 mb-4">
        {/* Zigzag Road SVG */}
        <svg 
          className="absolute inset-0 w-full h-full" 
          viewBox="0 0 840 80" 
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Road Background */}
          <path
            d={zigzagPath}
            stroke="#374151"
            strokeWidth="12"
            fill="none"
            className="drop-shadow-sm"
          />
          {/* Road Lines */}
          <path
            d={zigzagPath}
            stroke="#ffffff"
            strokeWidth="2"
            fill="none"
            strokeDasharray="8,6"
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
              <div className={`relative w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ${
                isCompleted 
                  ? `${level.bgColor} text-white scale-110` 
                  : isCurrent 
                    ? 'bg-blue-500 text-white scale-105 animate-pulse shadow-xl' 
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
              }`}>
                {isCompleted ? (
                  <Trophy className="w-5 h-5" />
                ) : (
                  level.icon
                )}
                
                {/* Completion Ring */}
                {isCompleted && (
                  <div className="absolute -inset-1 rounded-full border-2 border-yellow-400 animate-ping"></div>
                )}
              </div>
              
              {/* Level Info - Show only for current and completed */}
              {(isCurrent || isCompleted) && (
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-20 text-center">
                  <div className={`p-2 rounded-lg text-center shadow-md text-xs ${
                    isCompleted 
                      ? 'bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-400' 
                      : 'bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400'
                  }`}>
                    <div className="font-bold">{level.title}</div>
                    <div className="opacity-75">{level.description}</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Card */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-1">{currentCount}</div>
          <div className="text-sm text-gray-700 dark:text-gray-300 mb-3">Jaaps completed today</div>
          
          {/* Next Goal Card */}
          {nextTarget ? (
            <div className="bg-white dark:bg-zinc-700 rounded-lg p-3 border border-amber-200 dark:border-amber-700">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Complete {nextTarget.needed} more jaaps to reach "{nextTarget.level.title}"
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-1000 ease-out rounded-full"
                  style={{ 
                    width: currentCount === 0 ? '0%' : `${Math.min(100, (currentCount / nextTarget.level.requiredJaaps) * 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-700 rounded-lg p-3 border border-green-200 dark:border-green-700">
              <div className="text-lg">🎉</div>
              <div className="text-sm font-medium text-green-700 dark:text-green-300">
                Congratulations! You've reached the highest level!
              </div>
            </div>
          )}
        </div>
      </div>
    </ModernCard>
  );
};

export default SpiritualRoadmapJourney;
