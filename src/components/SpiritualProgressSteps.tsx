
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Trophy, Target } from 'lucide-react';
import ModernCard from './ModernCard';
import { getSpiritualLevel, spiritualLevels } from './SpiritualJourneyLevels';
import { getTodayCount } from '@/utils/indexedDBUtils';

interface SpiritualProgressStepsProps {
  onComplete: () => void;
}

const SpiritualProgressSteps: React.FC<SpiritualProgressStepsProps> = ({ onComplete }) => {
  const [currentCount, setCurrentCount] = useState(0);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const todayCount = await getTodayCount();
        setCurrentCount(todayCount);
        
        // Show congratulations if user has completed significant progress
        if (todayCount >= 108) {
          setShowCongratulations(true);
        }
      } catch (error) {
        console.error("Error loading progress:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProgress();
  }, []);

  const currentLevel = getSpiritualLevel(currentCount);
  const currentLevelIndex = spiritualLevels.findIndex(level => level.name === currentLevel.name);
  const nextLevel = currentLevelIndex < spiritualLevels.length - 1 ? spiritualLevels[currentLevelIndex + 1] : null;
  const progress = nextLevel ? Math.min((currentCount / nextLevel.minJaaps) * 100, 100) : 100;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-zinc-900 dark:via-black dark:to-zinc-800 flex items-center justify-center">
        <div className="text-amber-600 dark:text-amber-400 text-xl">Loading your spiritual journey...</div>
      </div>
    );
  }

  if (showCongratulations) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-zinc-900 dark:via-black dark:to-zinc-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          <ModernCard className="relative overflow-hidden border-0 shadow-2xl">
            {/* Congratulations Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500"></div>
            
            {/* Animated Sparkles */}
            <div className="absolute inset-0">
              <div className="animate-pulse absolute top-10 left-10 text-white/60">✨</div>
              <div className="animate-pulse absolute top-20 right-10 text-white/60" style={{animationDelay: '0.5s'}}>🌟</div>
              <div className="animate-pulse absolute bottom-20 left-16 text-white/60" style={{animationDelay: '1s'}}>✨</div>
              <div className="animate-pulse absolute bottom-10 right-16 text-white/60" style={{animationDelay: '1.5s'}}>🌟</div>
            </div>

            {/* Content */}
            <div className="relative z-10 p-8 text-center text-white min-h-[600px] flex flex-col justify-center">
              <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/30 mx-auto mb-6">
                <Trophy className="w-12 h-12 text-white" />
              </div>

              <h1 className="text-3xl font-bold mb-4">Congratulations! 🎉</h1>
              <h2 className="text-xl font-medium text-white/90 mb-4">
                You've reached the {currentLevel.name} level!
              </h2>
              
              <div className="bg-white/20 rounded-2xl p-6 mb-6 backdrop-blur-sm">
                <div className="text-6xl mb-4">{currentLevel.icon}</div>
                <div className="text-lg font-semibold">
                  {currentCount} Jaaps completed today
                </div>
                <div className="text-white/80 text-sm mt-2">
                  Keep up the amazing spiritual practice!
                </div>
              </div>

              <Button
                onClick={onComplete}
                className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm h-14 text-lg font-semibold rounded-xl transition-all duration-300 shadow-lg"
              >
                <span className="flex items-center justify-center gap-2">
                  Continue Journey
                  <Sparkles className="w-5 h-5" />
                </span>
              </Button>
            </div>
          </ModernCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-zinc-900 dark:via-black dark:to-zinc-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <ModernCard className="relative overflow-hidden border-0 shadow-2xl">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600"></div>

          {/* Content */}
          <div className="relative z-10 p-8 text-center text-white min-h-[600px] flex flex-col justify-between">
            {/* Current Level Display */}
            <div className="flex-1 flex flex-col items-center justify-center space-y-6">
              <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                <Target className="w-12 h-12 text-white" />
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl font-bold">Your Spiritual Progress</h1>
                <h2 className="text-lg font-medium text-white/90">
                  Current Level: {currentLevel.name}
                </h2>
              </div>

              {/* Progress Card */}
              <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm border border-white/30 w-full">
                <div className="text-6xl mb-4">{currentLevel.icon || "🕉️"}</div>
                <div className="text-2xl font-bold mb-2">{currentCount}</div>
                <div className="text-white/80 text-sm mb-4">Jaaps completed today</div>
                
                {nextLevel && (
                  <>
                    <div className="w-full bg-white/20 rounded-full h-3 mb-4">
                      <div 
                        className="bg-white h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="text-sm text-white/90">
                      <span className="font-semibold">{nextLevel.minJaaps - currentCount}</span> more jaaps to reach{" "}
                      <span className="font-semibold">{nextLevel.name}</span> {nextLevel.icon}
                    </div>
                  </>
                )}
                
                {!nextLevel && (
                  <div className="text-sm text-white/90 font-semibold">
                    🎉 Maximum level achieved!
                  </div>
                )}
              </div>

              {/* Motivational Message */}
              <p className="text-white/80 text-sm px-4">
                {currentCount === 0 
                  ? "Start your spiritual journey today! Complete your first jaap to begin."
                  : nextLevel 
                    ? `You're doing great! ${nextLevel.minJaaps - currentCount} more jaaps to reach the next level.`
                    : "You've achieved the highest spiritual level! Keep practicing for continued growth."
                }
              </p>
            </div>

            {/* Action Button */}
            <Button
              onClick={onComplete}
              className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm h-14 text-lg font-semibold rounded-xl transition-all duration-300 shadow-lg mt-6"
            >
              <span className="flex items-center justify-center gap-2">
                {currentCount === 0 ? "Start Practice" : "Continue Journey"}
                <ArrowRight className="w-5 h-5" />
              </span>
            </Button>
          </div>
        </ModernCard>

        {/* Bottom Text */}
        <p className="text-center text-gray-500 dark:text-gray-400 text-xs mt-4">
          Track your progress and unlock spiritual achievements
        </p>
      </div>
    </div>
  );
};

export default SpiritualProgressSteps;
