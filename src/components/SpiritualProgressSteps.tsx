
import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Sparkles, Trophy, Target, Star } from 'lucide-react';
import ModernCard from './ModernCard';
import { getSpiritualLevel, spiritualLevels } from './SpiritualJourneyLevels';
import { getTodayCount } from '@/utils/indexedDBUtils';

interface ProgressStep {
  id: number;
  title: string;
  description: string;
  requiredJaaps: number;
  icon: string;
  color: string;
  bgColor: string;
}

const progressSteps: ProgressStep[] = [
  {
    id: 1,
    title: "First Steps",
    description: "Begin your spiritual journey",
    requiredJaaps: 5,
    icon: "🌱",
    color: "text-green-600",
    bgColor: "bg-green-100"
  },
  {
    id: 2,
    title: "Growing Faith",
    description: "Build your daily practice",
    requiredJaaps: 25,
    icon: "🌿",
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  {
    id: 3,
    title: "Dedicated Soul",
    description: "Strengthen your devotion",
    requiredJaaps: 108,
    icon: "🕉️",
    color: "text-purple-600",
    bgColor: "bg-purple-100"
  },
  {
    id: 4,
    title: "Spiritual Warrior",
    description: "Advanced practice mastery",
    requiredJaaps: 500,
    icon: "🔱",
    color: "text-orange-600",
    bgColor: "bg-orange-100"
  },
  {
    id: 5,
    title: "Enlightened Being",
    description: "Highest spiritual achievement",
    requiredJaaps: 1000,
    icon: "✨",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100"
  }
];

interface SpiritualProgressStepsProps {
  className?: string;
}

const SpiritualProgressSteps: React.FC<SpiritualProgressStepsProps> = ({ className = "" }) => {
  const [currentCount, setCurrentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const todayCount = await getTodayCount();
        setCurrentCount(todayCount);
        
        // Find current step based on count
        let stepIndex = 0;
        for (let i = progressSteps.length - 1; i >= 0; i--) {
          if (todayCount >= progressSteps[i].requiredJaaps) {
            stepIndex = i;
            break;
          }
        }
        setCurrentStepIndex(stepIndex);
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
      <ModernCard className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </ModernCard>
    );
  }

  const getStepStatus = (stepIndex: number) => {
    if (currentCount >= progressSteps[stepIndex].requiredJaaps) {
      return 'completed';
    } else if (stepIndex === currentStepIndex + 1 || (currentCount === 0 && stepIndex === 0)) {
      return 'current';
    } else {
      return 'upcoming';
    }
  };

  const getCurrentStepProgress = () => {
    const nextStep = progressSteps[currentStepIndex + 1];
    if (!nextStep) return 100;
    
    const previousStep = progressSteps[currentStepIndex];
    const previousRequired = previousStep ? previousStep.requiredJaaps : 0;
    const progress = ((currentCount - previousRequired) / (nextStep.requiredJaaps - previousRequired)) * 100;
    return Math.max(0, Math.min(100, progress));
  };

  return (
    <ModernCard className={`p-6 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-xl border-amber-200/50 dark:border-amber-700/50 ${className}`} gradient>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Spiritual Journey</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Your daily progress path</p>
          </div>
        </div>
        
        {/* Current Count Display */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{currentCount}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Jaaps completed today</div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="space-y-4">
        {progressSteps.map((step, index) => {
          const status = getStepStatus(index);
          const isCompleted = status === 'completed';
          const isCurrent = status === 'current';
          const isUpcoming = status === 'upcoming';
          
          return (
            <div key={step.id} className="relative">
              {/* Connection Line */}
              {index < progressSteps.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200 dark:bg-gray-700 z-0"></div>
              )}
              
              {/* Step Content */}
              <div className={`relative z-10 flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                isCompleted 
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700' 
                  : isCurrent 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 shadow-lg' 
                    : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'
              }`}>
                
                {/* Step Icon */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-green-500 text-white shadow-lg' 
                    : isCurrent 
                      ? 'bg-blue-500 text-white shadow-lg animate-pulse' 
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : isCurrent ? (
                    <div className="text-xl">{step.icon}</div>
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </div>
                
                {/* Step Details */}
                <div className="flex-1">
                  <h4 className={`font-semibold ${
                    isCompleted 
                      ? 'text-green-700 dark:text-green-400' 
                      : isCurrent 
                        ? 'text-blue-700 dark:text-blue-400' 
                        : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {step.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
                  <div className="text-xs mt-1">
                    <span className={`font-medium ${
                      isCompleted 
                        ? 'text-green-600 dark:text-green-400' 
                        : isCurrent 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-500 dark:text-gray-500'
                    }`}>
                      {step.requiredJaaps} jaaps required
                    </span>
                  </div>
                </div>
                
                {/* Step Status */}
                <div className="text-right">
                  {isCompleted && (
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <Trophy className="w-4 h-4" />
                      <span className="text-sm font-medium">Complete!</span>
                    </div>
                  )}
                  {isCurrent && (
                    <div className="text-blue-600 dark:text-blue-400">
                      <div className="text-sm font-medium">
                        {step.requiredJaaps - currentCount} more to go
                      </div>
                      {/* Progress Bar for Current Step */}
                      <div className="w-20 h-2 bg-blue-200 dark:bg-blue-800 rounded-full mt-1 overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-500 ease-out"
                          style={{ width: `${getCurrentStepProgress()}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  {isUpcoming && (
                    <div className="text-gray-400 dark:text-gray-500">
                      <Star className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Motivational Message */}
      <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl">
        <div className="text-center text-amber-700 dark:text-amber-300">
          {currentCount === 0 ? (
            <p className="text-sm">🌅 Start your spiritual journey today! Complete your first 5 jaaps to unlock the next level.</p>
          ) : progressSteps[currentStepIndex + 1] ? (
            <p className="text-sm">🚀 You're doing great! Just {progressSteps[currentStepIndex + 1].requiredJaaps - currentCount} more jaaps to reach "{progressSteps[currentStepIndex + 1].title}"</p>
          ) : (
            <p className="text-sm">🎉 Congratulations! You've completed all spiritual milestones for today. Keep practicing for continued growth!</p>
          )}
        </div>
      </div>
    </ModernCard>
  );
};

export default SpiritualProgressSteps;
