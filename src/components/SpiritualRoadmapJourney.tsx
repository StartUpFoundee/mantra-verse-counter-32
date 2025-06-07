
import React, { useState, useEffect } from 'react';
import { Flag } from 'lucide-react';
import ModernCard from './ModernCard';
import { getTodayCount } from '@/utils/indexedDBUtils';

interface RoadmapLevel {
  id: number;
  title: string;
  description: string;
  requiredJaaps: number;
  icon: string;
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
    icon: "🏃‍♂️",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    position: { x: 10, y: 70 }
  },
  {
    id: 2,
    title: "Bhogi",
    description: "Experience divine bliss",
    requiredJaaps: 1,
    icon: "🍯",
    color: "text-amber-600",
    bgColor: "bg-amber-100",
    position: { x: 25, y: 30 }
  },
  {
    id: 3,
    title: "Yogi",
    description: "Unite with the divine",
    requiredJaaps: 109,
    icon: "🧘‍♂️",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    position: { x: 40, y: 75 }
  },
  {
    id: 4,
    title: "Sadhak",
    description: "Devoted practitioner",
    requiredJaaps: 501,
    icon: "🕉️",
    color: "text-teal-600",
    bgColor: "bg-teal-100",
    position: { x: 55, y: 25 }
  },
  {
    id: 5,
    title: "Tapasvi",
    description: "Master of austerity",
    requiredJaaps: 1001,
    icon: "🔥",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    position: { x: 70, y: 80 }
  },
  {
    id: 6,
    title: "Rishi",
    description: "Sage of wisdom",
    requiredJaaps: 1501,
    icon: "🔱",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    position: { x: 85, y: 35 }
  },
  {
    id: 7,
    title: "Jivanmukta",
    description: "Liberated soul",
    requiredJaaps: 2100,
    icon: "🪷",
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
    position: { x: 95, y: 60 }
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
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-4"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-4"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
        </div>
      </div>
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

  const getPathProgress = () => {
    const nextLevel = getNextLevelInfo();
    if (!nextLevel) return 100;
    
    const currentLevelJaaps = getCurrentLevelInfo().requiredJaaps;
    const nextLevelJaaps = nextLevel.requiredJaaps;
    const progress = Math.min(100, ((currentCount - currentLevelJaaps) / (nextLevelJaaps - currentLevelJaaps)) * 100);
    return Math.max(0, progress);
  };

  // Create natural zigzag path coordinates
  const createNaturalZigzagPath = () => {
    let path = `M ${roadmapLevels[0].position.x} ${roadmapLevels[0].position.y}`;
    
    for (let i = 1; i < roadmapLevels.length; i++) {
      const current = roadmapLevels[i];
      const prev = roadmapLevels[i - 1];
      
      // Create smooth curves between points
      const midX = (prev.position.x + current.position.x) / 2;
      const controlY = i % 2 === 0 ? Math.min(prev.position.y, current.position.y) - 15 : Math.max(prev.position.y, current.position.y) + 15;
      
      path += ` Q ${midX} ${controlY} ${current.position.x} ${current.position.y}`;
    }
    return path;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Roadmap Container */}
      <ModernCard className="p-4 bg-gradient-to-br from-sky-50/80 to-indigo-50/80 dark:from-slate-900/80 dark:to-slate-800/80">
        <div className="relative h-32 overflow-hidden rounded-xl bg-gradient-to-br from-emerald-100 via-sky-100 to-blue-100 dark:from-emerald-900/30 dark:via-sky-900/30 dark:to-blue-900/30">
          
          {/* Background Mountains */}
          <div className="absolute bottom-0 left-0 w-full h-16 opacity-20">
            <svg viewBox="0 0 100 16" className="w-full h-full">
              <polygon points="0,16 20,4 40,16 60,6 80,16 100,8 100,16 0,16" fill="rgb(34, 197, 94)" />
            </svg>
          </div>

          {/* Road SVG */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Road Shadow */}
            <path
              d={createNaturalZigzagPath()}
              stroke="#1f2937"
              strokeWidth="8"
              fill="none"
              opacity="0.2"
              transform="translate(0.5, 0.5)"
            />
            
            {/* Main Road */}
            <path
              d={createNaturalZigzagPath()}
              stroke="#6b7280"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Progress Road with Zip Effect */}
            <path
              d={createNaturalZigzagPath()}
              stroke="url(#progressGradient)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="100"
              strokeDashoffset={100 - (getPathProgress() * (currentLevel + 1) / roadmapLevels.length * 100)}
              className="transition-all duration-1000 ease-out"
            />
            
            {/* Gradient Definitions */}
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
            </defs>
          </svg>

          {/* Level Markers */}
          {roadmapLevels.map((level, index) => {
            const isCompleted = currentCount >= level.requiredJaaps;
            const isCurrent = index === currentLevel;
            
            return (
              <div
                key={level.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ 
                  left: `${level.position.x}%`, 
                  top: `${level.position.y}%` 
                }}
              >
                {/* Level Circle */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-500 ${
                  isCompleted 
                    ? 'bg-amber-500 text-white shadow-lg scale-110' 
                    : isCurrent 
                      ? 'bg-blue-500 text-white shadow-lg animate-pulse' 
                      : 'bg-gray-300 text-gray-600'
                }`}>
                  {level.icon}
                </div>
                
                {/* Beautiful Flag for current position */}
                {isCurrent && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <Flag className="w-5 h-5 text-red-500 animate-pulse" fill="currentColor" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Animated Mala */}
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-out z-10"
            style={{ 
              left: `${roadmapLevels[currentLevel]?.position.x || 10}%`, 
              top: `${(roadmapLevels[currentLevel]?.position.y || 70) + 5}%` 
            }}
          >
            <div className="text-lg animate-bounce">📿</div>
          </div>
        </div>
      </ModernCard>

      {/* Current Level Card */}
      <ModernCard className="p-4 bg-white/90 dark:bg-gray-800/90">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getCurrentLevelInfo().bgColor} shadow-sm`}>
            <div className="text-xl">{getCurrentLevelInfo().icon}</div>
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{getCurrentLevelInfo().title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{getCurrentLevelInfo().description}</p>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-amber-600">{currentCount}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">jaaps completed today</span>
            </div>
          </div>
        </div>
      </ModernCard>

      {/* Next Level Card */}
      {getNextLevelInfo() ? (
        <ModernCard className="p-4 bg-gradient-to-r from-amber-50/90 to-orange-50/90 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-dashed border-amber-300/50">
          <div className="text-center">
            <div className="text-2xl mb-2">{getNextLevelInfo()!.icon}</div>
            <div className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">
              Next Level: {getNextLevelInfo()!.title}
            </div>
            <div className="text-sm text-amber-700 dark:text-amber-300 mb-3">
              Complete {getNextLevelInfo()!.requiredJaaps - currentCount} more jaaps to reach the next level
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-700 ease-out rounded-full"
                style={{ 
                  width: `${Math.min(100, (currentCount / getNextLevelInfo()!.requiredJaaps) * 100)}%` 
                }}
              ></div>
            </div>
          </div>
        </ModernCard>
      ) : (
        <ModernCard className="p-4 bg-gradient-to-r from-green-50/90 to-emerald-50/90 dark:from-green-900/20 dark:to-emerald-900/20">
          <div className="text-center">
            <div className="text-3xl mb-2">🎉</div>
            <div className="text-lg font-semibold text-green-700 dark:text-green-300 mb-1">
              Congratulations!
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">
              You've completed all spiritual levels for today!
            </div>
          </div>
        </ModernCard>
      )}
    </div>
  );
};

export default SpiritualRoadmapJourney;
