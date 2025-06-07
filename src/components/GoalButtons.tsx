
import React from "react";
import { Calendar, Target, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import ModernCard from "@/components/ModernCard";

interface GoalButtonsProps {
  onWeeklyGoalClick: () => void;
  onMonthlyGoalClick: () => void;
  onYearlyGoalClick: () => void;
}

const GoalButtons: React.FC<GoalButtonsProps> = ({
  onWeeklyGoalClick,
  onMonthlyGoalClick,
  onYearlyGoalClick
}) => {
  return (
    <div className="space-y-4 lg:space-y-6">
      <h2 className="text-lg lg:text-xl xl:text-2xl font-semibold text-gray-900 dark:text-white px-1">
        Set Your Goals
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <ModernCard 
          onClick={onWeeklyGoalClick}
          className="p-4 lg:p-6 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 border-blue-300/30 dark:border-blue-600/30 cursor-pointer hover:scale-[1.02] transition-all duration-300"
          gradient
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg lg:text-xl font-semibold text-blue-600 dark:text-blue-400 mb-1">Weekly Goal</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Set 7-day targets</p>
            </div>
          </div>
        </ModernCard>

        <ModernCard 
          onClick={onMonthlyGoalClick}
          className="p-4 lg:p-6 bg-gradient-to-br from-green-400/20 to-emerald-500/20 border-green-300/30 dark:border-green-600/30 cursor-pointer hover:scale-[1.02] transition-all duration-300"
          gradient
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <Target className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg lg:text-xl font-semibold text-green-600 dark:text-green-400 mb-1">Monthly Goal</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Set 30-day targets</p>
            </div>
          </div>
        </ModernCard>

        <ModernCard 
          onClick={onYearlyGoalClick}
          className="p-4 lg:p-6 bg-gradient-to-br from-purple-400/20 to-indigo-500/20 border-purple-300/30 dark:border-purple-600/30 cursor-pointer hover:scale-[1.02] transition-all duration-300"
          gradient
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
              <Trophy className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg lg:text-xl font-semibold text-purple-600 dark:text-purple-400 mb-1">Yearly Goal</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Set annual targets</p>
            </div>
          </div>
        </ModernCard>
      </div>
    </div>
  );
};

export default GoalButtons;
