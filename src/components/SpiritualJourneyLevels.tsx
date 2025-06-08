
import React from 'react';
import ModernCard from './ModernCard';
import { useIsMobile } from '@/hooks/use-mobile';

interface SpiritualLevel {
  name: string;
  icon: string;
  range: string;
  minJaaps: number;
  maxJaaps: number | null;
  color: string;
}

interface SpiritualJourneyLevelsProps {
  activityData: {[date: string]: number};
}

export const spiritualLevels: SpiritualLevel[] = [
  {
    name: "Rogi",
    icon: "🤒",
    range: "0 jaaps",
    minJaaps: 0,
    maxJaaps: 0,
    color: "bg-gray-100 text-gray-700 border-gray-300"
  },
  {
    name: "Bhogi",
    icon: "🍯",
    range: "1-308",
    minJaaps: 1,
    maxJaaps: 308,
    color: "bg-amber-100 text-amber-800 border-amber-300"
  },
  {
    name: "Yogi",
    icon: "🧘‍♂️",
    range: "309-508",
    minJaaps: 309,
    maxJaaps: 508,
    color: "bg-blue-100 text-blue-800 border-blue-300"
  },
  {
    name: "Sadhak",
    icon: "🕉️",
    range: "509-708",
    minJaaps: 509,
    maxJaaps: 708,
    color: "bg-teal-100 text-teal-800 border-teal-300"
  },
  {
    name: "Tapasvi",
    icon: "🔥",
    range: "709-1007",
    minJaaps: 709,
    maxJaaps: 1007,
    color: "bg-orange-100 text-orange-800 border-orange-300"
  },
  {
    name: "Bhakti",
    icon: "🙏",
    range: "1008+",
    minJaaps: 1008,
    maxJaaps: null,
    color: "bg-pink-100 text-pink-800 border-pink-300"
  }
];

export const getSpiritualLevel = (jaapCount: number): SpiritualLevel => {
  for (let i = spiritualLevels.length - 1; i >= 0; i--) {
    const level = spiritualLevels[i];
    if (jaapCount >= level.minJaaps && (level.maxJaaps === null || jaapCount <= level.maxJaaps)) {
      return level;
    }
  }
  return spiritualLevels[0]; // Default to Rogi
};

const SpiritualJourneyLevels: React.FC<SpiritualJourneyLevelsProps> = ({ activityData }) => {
  const isMobile = useIsMobile();
  
  // Calculate days for each level
  const levelDays = spiritualLevels.map(level => {
    const days = Object.values(activityData).filter(count => {
      if (level.maxJaaps === null) {
        return count >= level.minJaaps;
      }
      return count >= level.minJaaps && count <= level.maxJaaps;
    }).length;
    
    return {
      ...level,
      days
    };
  });

  return (
    <div className={`${isMobile ? 'mb-2' : 'mb-4 md:mb-8 lg:mb-12'} max-w-6xl mx-auto`}>
      <ModernCard className={`${isMobile ? 'p-2' : 'p-3 md:p-6 lg:p-8'} bg-white/90 dark:bg-zinc-800/90 backdrop-blur-xl border-amber-200/50 dark:border-amber-700/50`} gradient>
        <div className={`${isMobile ? 'mb-2' : 'mb-4 md:mb-6'}`}>
          <div className={`flex items-center gap-2 ${isMobile ? 'mb-1' : 'md:gap-3 mb-2'}`}>
            <span className={`${isMobile ? 'text-lg' : 'text-xl md:text-2xl'}`}>🏆</span>
            <h2 className={`${isMobile ? 'text-sm' : 'text-lg md:text-xl lg:text-2xl'} font-bold text-gray-900 dark:text-white`}>Achievement Categories</h2>
          </div>
          <p className={`${isMobile ? 'text-xs' : 'text-sm md:text-base'} text-gray-600 dark:text-gray-400`}>Your progress across different levels of spiritual practice</p>
        </div>

        {/* Mobile: 3-3-2 layout, Desktop: 6 columns */}
        <div className={`grid ${isMobile ? 'grid-cols-3 gap-1' : 'grid-cols-3 md:grid-cols-6 gap-2 md:gap-4'}`}>
          {levelDays.map((level, index) => (
            <div
              key={index}
              className={`rounded-lg ${isMobile ? 'p-1' : 'md:rounded-xl p-2 md:p-4'} text-center transition-all duration-200 hover:scale-105 border-2 ${level.color}`}
            >
              <div className={`flex flex-col items-center h-full justify-between`}>
                <div className={`${isMobile ? 'text-sm mb-1 min-h-[1.5rem]' : 'text-lg md:text-3xl mb-1 md:mb-2 min-h-[2rem] md:min-h-[3rem]'} filter drop-shadow-sm flex items-center justify-center`}>
                  {level.icon && (
                    <span>{level.icon}</span>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className={`font-semibold ${isMobile ? 'text-xs mb-0' : 'text-xs md:text-sm mb-1'}`}>{level.name}</div>
                  <div className={`${isMobile ? 'text-xs opacity-75 mb-1' : 'text-xs opacity-75 mb-1 md:mb-2'}`}>{level.range}</div>
                </div>
                <div className="mt-auto">
                  <div className={`font-bold ${isMobile ? 'text-sm' : 'text-sm md:text-lg'}`}>{level.days}</div>
                  <div className={`${isMobile ? 'text-xs' : 'text-xs'} opacity-75`}>days</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ModernCard>
    </div>
  );
};

export default SpiritualJourneyLevels;
