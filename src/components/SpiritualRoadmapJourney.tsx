
import React from 'react';
import { CheckCircle2, Target, Calendar, Trophy } from 'lucide-react';

const SpiritualRoadmapJourney: React.FC = () => {
  const roadmapSteps = [
    {
      id: 1,
      title: "Begin Your Journey",
      description: "Start with your first mantra",
      icon: Target,
      completed: true,
      position: 'left'
    },
    {
      id: 2,
      title: "Daily Practice",
      description: "Maintain consistent daily jaaps",
      icon: Calendar,
      completed: true,
      position: 'right'
    },
    {
      id: 3,
      title: "Spiritual Milestone",
      description: "Achieve your spiritual goals",
      icon: Trophy,
      completed: false,
      position: 'left'
    }
  ];

  return (
    <div className="relative bg-white/50 dark:bg-zinc-900/50 rounded-lg p-6 mb-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Track Your Journey
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Daily target of 2100 jaapa must complete
        </p>
      </div>
      
      {/* Zigzag roadmap */}
      <div className="relative">
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
          <defs>
            <linearGradient id="roadmapGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#d97706" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#92400e" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          
          {/* First connection line */}
          <path
            d="M 120 40 Q 200 20 280 40"
            stroke="url(#roadmapGradient)"
            strokeWidth="3"
            fill="none"
            strokeDasharray="8,4"
            className="animate-pulse"
          />
          
          {/* Second connection line */}
          <path
            d="M 360 40 Q 440 60 520 40"
            stroke="url(#roadmapGradient)"
            strokeWidth="3"
            fill="none"
            strokeDasharray="8,4"
            className="animate-pulse"
          />
        </svg>
        
        {/* Steps */}
        <div className="relative flex justify-between items-center py-8" style={{ zIndex: 2 }}>
          {roadmapSteps.map((step, index) => (
            <div
              key={step.id}
              className={`flex flex-col items-center max-w-[120px] ${
                step.position === 'right' ? 'mt-8' : ''
              }`}
            >
              {/* Icon container */}
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                  step.completed
                    ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg scale-110'
                    : 'bg-gradient-to-br from-amber-200 to-amber-400 shadow-md'
                }`}
              >
                {step.completed ? (
                  <CheckCircle2 className="w-8 h-8 text-white" />
                ) : (
                  <step.icon className="w-8 h-8 text-amber-800" />
                )}
              </div>
              
              {/* Step content */}
              <div className="text-center">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  {step.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Progress indicator */}
      <div className="mt-4 flex justify-center">
        <div className="flex gap-2">
          {roadmapSteps.map((step) => (
            <div
              key={step.id}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                step.completed
                  ? 'bg-emerald-500 shadow-sm'
                  : 'bg-amber-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpiritualRoadmapJourney;
