
import React, { useState, useEffect } from 'react';
import { Flag, Sun } from 'lucide-react';
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
    bgColor: "bg-gray-500",
    position: { x: 15, y: 60 }
  },
  {
    id: 2,
    title: "Bhogi",
    description: "Experience divine bliss",
    requiredJaaps: 1,
    icon: "🍯",
    color: "text-amber-600",
    bgColor: "bg-amber-500",
    position: { x: 30, y: 25 }
  },
  {
    id: 3,
    title: "Yogi",
    description: "Unite with the divine",
    requiredJaaps: 109,
    icon: "🧘‍♂️",
    color: "text-blue-600",
    bgColor: "bg-blue-500",
    position: { x: 45, y: 75 }
  },
  {
    id: 4,
    title: "Sadhak",
    description: "Devoted practitioner",
    requiredJaaps: 501,
    icon: "🕉️",
    color: "text-teal-600",
    bgColor: "bg-teal-500",
    position: { x: 60, y: 30 }
  },
  {
    id: 5,
    title: "Tapasvi",
    description: "Master of austerity",
    requiredJaaps: 1001,
    icon: "🔥",
    color: "text-orange-600",
    bgColor: "bg-orange-500",
    position: { x: 75, y: 70 }
  },
  {
    id: 6,
    title: "Rishi",
    description: "Sage of wisdom",
    requiredJaaps: 1501,
    icon: "🔱",
    color: "text-purple-600",
    bgColor: "bg-purple-500",
    position: { x: 90, y: 35 }
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

  const getPathProgress = () => {
    const totalLevels = roadmapLevels.length;
    const completedLevels = currentLevel + 1;
    return (completedLevels / totalLevels) * 100;
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

  // Create zigzag path coordinates
  const createZigzagPath = () => {
    let path = "M 10 60";
    for (let i = 0; i < roadmapLevels.length; i++) {
      const level = roadmapLevels[i];
      if (i === 0) {
        path += ` L ${level.position.x} ${level.position.y}`;
      } else {
        path += ` Q ${level.position.x - 5} ${level.position.y + (i % 2 === 0 ? -10 : 10)} ${level.position.x} ${level.position.y}`;
      }
    }
    return path;
  };

  return (
    <ModernCard className={`p-6 bg-gradient-to-br from-sky-50/80 to-indigo-50/80 dark:from-slate-900/80 dark:to-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-2xl ${className}`}>
      {/* Roadmap Container */}
      <div className="relative h-48 mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-100 via-sky-100 to-blue-100 dark:from-emerald-900/30 dark:via-sky-900/30 dark:to-blue-900/30 border border-white/30 dark:border-gray-600/30">
        
        {/* Background Elements */}
        <div className="absolute inset-0">
          {/* Clouds */}
          <div className="absolute top-4 left-8 w-12 h-6 bg-white/60 rounded-full"></div>
          <div className="absolute top-6 left-12 w-8 h-4 bg-white/50 rounded-full"></div>
          <div className="absolute top-3 right-16 w-10 h-5 bg-white/70 rounded-full"></div>
          
          {/* Mountains in background */}
          <div className="absolute bottom-0 left-0 w-full h-20 opacity-30">
            <svg viewBox="0 0 100 20" className="w-full h-full">
              <polygon points="0,20 15,5 30,20 45,8 60,20 75,6 90,20 100,20 100,20 0,20" fill="rgb(34, 197, 94)" />
              <polygon points="5,20 20,10 35,20 50,12 65,20 80,9 95,20 100,20 100,20 0,20" fill="rgb(16, 185, 129)" />
            </svg>
          </div>
        </div>

        {/* Road Base */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Road Shadow */}
          <path
            d={createZigzagPath()}
            stroke="#1f2937"
            strokeWidth="12"
            fill="none"
            opacity="0.3"
            transform="translate(1, 1)"
          />
          
          {/* Main Road */}
          <path
            d={createZigzagPath()}
            stroke="#374151"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Road Progress with Zip Effect */}
          <path
            d={createZigzagPath()}
            stroke="url(#roadGradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="100"
            strokeDashoffset={100 - getPathProgress()}
            className="transition-all duration-2000 ease-out"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(251, 191, 36, 0.5))'
            }}
          />
          
          {/* Road Center Line */}
          <path
            d={createZigzagPath()}
            stroke="#ffffff"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="4,4"
            opacity="0.8"
            strokeLinecap="round"
          />
          
          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            
            <linearGradient id="flagGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>
        </svg>

        {/* Journey Levels */}
        {roadmapLevels.map((level, index) => {
          const isCompleted = currentCount >= level.requiredJaaps;
          const isCurrent = index === currentLevel;
          const isReached = index <= currentLevel;
          
          return (
            <div
              key={level.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700"
              style={{ 
                left: `${level.position.x}%`, 
                top: `${level.position.y}%` 
              }}
            >
              {/* Level Marker with Enhanced Design */}
              <div className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${
                isCompleted 
                  ? `${level.bgColor} text-white scale-110 shadow-2xl ring-4 ring-white/50` 
                  : isCurrent 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white scale-105 shadow-2xl ring-4 ring-blue-300/50 animate-pulse' 
                    : isReached
                      ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-xl'
                      : 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-600 dark:from-gray-600 dark:to-gray-700 dark:text-gray-400'
              }`}>
                <div className="text-xl">{level.icon}</div>
                
                {/* Beautiful Flag for current position */}
                {isCurrent && (
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                    <div className="relative">
                      {/* Flag Pole */}
                      <div className="w-1 h-10 bg-gradient-to-b from-amber-600 to-amber-800 rounded-full mx-auto"></div>
                      {/* Flag */}
                      <svg className="absolute top-0 left-1 w-8 h-6" viewBox="0 0 32 24">
                        <path
                          d="M2 2 L28 2 L26 12 L28 22 L2 22 Z"
                          fill="url(#flagGradient)"
                          className="animate-pulse"
                        />
                        <path
                          d="M2 2 L28 2 L26 12 L28 22 L2 22 Z"
                          fill="none"
                          stroke="#b91c1c"
                          strokeWidth="0.5"
                        />
                      </svg>
                    </div>
                  </div>
                )}
                
                {/* Completion Ring */}
                {isCompleted && (
                  <div className="absolute -inset-3 rounded-full border-3 border-yellow-400 animate-ping opacity-75"></div>
                )}
              </div>

              {/* Level Title */}
              <div className="absolute top-16 left-1/2 transform -translate-x-1/2 text-center">
                <div className={`font-bold text-sm whitespace-nowrap px-2 py-1 rounded-lg backdrop-blur-sm ${
                  isCurrent 
                    ? 'bg-blue-500/90 text-white' 
                    : isCompleted 
                      ? 'bg-green-500/90 text-white'
                      : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300'
                }`}>
                  {level.title}
                </div>
              </div>
            </div>
          );
        })}

        {/* Animated Mala Character */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-2000 ease-out z-10"
          style={{ 
            left: `${roadmapLevels[currentLevel]?.position.x || 15}%`, 
            top: `${(roadmapLevels[currentLevel]?.position.y || 60) + 8}%` 
          }}
        >
          <div className="text-3xl animate-bounce filter drop-shadow-lg">📿</div>
        </div>
      </div>

      {/* Current Level Card with Animation */}
      <div className="mb-4">
        <div className="bg-gradient-to-r from-white/90 to-blue-50/90 dark:from-gray-800/90 dark:to-gray-700/90 rounded-2xl p-6 border border-white/50 dark:border-gray-600/50 shadow-xl backdrop-blur-sm animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${getCurrentLevelInfo().bgColor} text-white shadow-lg transform rotate-3`}>
              <div className="text-2xl">{getCurrentLevelInfo().icon}</div>
            </div>
            <div className="flex-1">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{getCurrentLevelInfo().title}</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-2">{getCurrentLevelInfo().description}</p>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{currentCount}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">jaaps completed today</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Step Card with Enhanced Animation */}
      {getNextLevelInfo() ? (
        <div className="bg-gradient-to-r from-amber-50/90 to-orange-50/90 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl p-6 border-2 border-dashed border-amber-300/70 dark:border-amber-600/70 backdrop-blur-sm animate-pulse">
          <div className="text-center">
            <div className="text-3xl mb-3">{getNextLevelInfo()!.icon}</div>
            <div className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
              Next Level: {getNextLevelInfo()!.title}
            </div>
            <div className="text-amber-700 dark:text-amber-300 font-semibold mb-4">
              Complete {getNextLevelInfo()!.requiredJaaps - currentCount} more jaaps to reach the next level
            </div>
            
            {/* Enhanced Progress Bar */}
            <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 transition-all duration-1000 ease-out rounded-full shadow-sm"
                style={{ 
                  width: `${Math.min(100, (currentCount / getNextLevelInfo()!.requiredJaaps) * 100)}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-green-50/90 to-emerald-50/90 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl p-6 border border-green-200/70 dark:border-green-700/70 backdrop-blur-sm">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">
              Congratulations!
            </div>
            <div className="text-green-600 dark:text-green-400">
              You've completed all spiritual levels for today. Your dedication is truly inspiring!
            </div>
          </div>
        </div>
      )}

      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-zinc-800 rounded-3xl p-8 mx-4 max-w-md text-center animate-scale-in shadow-2xl">
            <div className="text-6xl mb-4 animate-bounce">🎊</div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Amazing Achievement!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {getCelebrationMessage()}
            </p>
            <div className="text-5xl animate-pulse">✨ 📿 ✨</div>
          </div>
        </div>
      )}
    </ModernCard>
  );
};

export default SpiritualRoadmapJourney;
