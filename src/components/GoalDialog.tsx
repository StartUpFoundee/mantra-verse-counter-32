
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Edit, Lock } from "lucide-react";
import ModernCard from "@/components/ModernCard";

interface GoalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  goalType: "weekly" | "monthly" | "yearly";
  currentGoal?: number;
  hasEditedOnce?: boolean;
}

const GoalDialog: React.FC<GoalDialogProps> = ({ 
  isOpen, 
  onClose, 
  goalType, 
  currentGoal,
  hasEditedOnce = false 
}) => {
  const [selectedTarget, setSelectedTarget] = useState<number | null>(currentGoal || null);
  const [customTarget, setCustomTarget] = useState<string>("");
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [isEditing, setIsEditing] = useState(!currentGoal);

  const getPresetTargets = () => {
    switch (goalType) {
      case "weekly":
        return [21000, 41000];
      case "monthly":
        return [50000, 80000];
      case "yearly":
        return [1000000, 2100000];
      default:
        return [];
    }
  };

  const getGoalTitle = () => {
    switch (goalType) {
      case "weekly":
        return "Weekly Goal";
      case "monthly":
        return "Monthly Goal";
      case "yearly":
        return "Yearly Goal";
      default:
        return "Goal";
    }
  };

  const getDaysInPeriod = () => {
    switch (goalType) {
      case "weekly":
        return 7;
      case "monthly":
        return 30;
      case "yearly":
        return 365;
      default:
        return 7;
    }
  };

  const presetTargets = getPresetTargets();
  const daysInPeriod = getDaysInPeriod();
  const dailyTarget = selectedTarget ? Math.ceil(selectedTarget / daysInPeriod) : 0;

  const handleCustomTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setCustomTarget(value);
    }
  };

  const handleCustomTargetSubmit = () => {
    const target = parseInt(customTarget, 10);
    if (!isNaN(target) && target > 0) {
      setSelectedTarget(target);
    }
  };

  const handleEditClick = () => {
    if (hasEditedOnce) {
      setShowEditPassword(true);
    } else {
      setIsEditing(true);
    }
  };

  const handlePasswordSubmit = () => {
    // Simple password validation - you can make this more secure
    if (password === "1234") { // Replace with actual password logic
      setIsEditing(true);
      setShowEditPassword(false);
      setPassword("");
    } else {
      alert("Incorrect password!");
    }
  };

  const renderZigzagRoadmap = () => {
    if (!selectedTarget) return null;

    const days = Array.from({ length: daysInPeriod }, (_, i) => i + 1);
    
    return (
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Daily Roadmap
        </h3>
        <div className="relative">
          {/* Zigzag path lines */}
          <div className="flex flex-wrap gap-4 justify-center">
            {days.map((day, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={day}
                  className={`relative ${
                    isEven ? 'mt-0' : 'mt-8'
                  }`}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {day}
                  </div>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-center text-gray-600 dark:text-gray-400">
                    {dailyTarget}
                  </div>
                  {index < days.length - 1 && (
                    <div className={`absolute top-8 ${isEven ? 'left-16' : 'right-16'} w-8 h-0.5 bg-amber-300`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">{getGoalTitle()}</DialogTitle>
            {currentGoal && !isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEditClick}
                className="p-2"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Goal Badge */}
          {selectedTarget && !isEditing && (
            <div className="flex justify-center">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg">
                🏆 Target: {selectedTarget.toLocaleString()} Jaaps
              </div>
            </div>
          )}

          {/* Target Selection */}
          {isEditing && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Select your {goalType} target:
              </h3>

              {/* Preset Options */}
              <div className="grid grid-cols-2 gap-4">
                {presetTargets.map((target) => (
                  <Button
                    key={target}
                    variant={selectedTarget === target ? "default" : "outline"}
                    className="h-16 text-lg font-medium"
                    onClick={() => setSelectedTarget(target)}
                  >
                    {target.toLocaleString()}
                  </Button>
                ))}
              </div>

              {/* Custom Input */}
              <div className="flex items-center gap-2">
                <span className="text-lg text-gray-700 dark:text-gray-300">Custom:</span>
                <div className="flex flex-1">
                  <Input
                    className="h-12 text-lg font-medium text-center rounded-r-none"
                    placeholder="Enter custom target"
                    value={customTarget}
                    onChange={handleCustomTargetChange}
                    onKeyDown={(e) => e.key === 'Enter' && handleCustomTargetSubmit()}
                  />
                  <Button
                    className="h-12 rounded-l-none"
                    onClick={handleCustomTargetSubmit}
                  >
                    Set
                  </Button>
                </div>
              </div>

              {selectedTarget && (
                <div className="text-center text-gray-600 dark:text-gray-400">
                  Daily target: {dailyTarget} jaaps per day
                </div>
              )}
            </div>
          )}

          {/* Password Dialog */}
          {showEditPassword && (
            <ModernCard className="p-6 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200">
                  Password Required
                </h3>
              </div>
              <p className="text-amber-700 dark:text-amber-300 mb-4">
                You can only edit your goal once. Please enter your password to continue.
              </p>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                />
                <Button onClick={handlePasswordSubmit}>Verify</Button>
              </div>
            </ModernCard>
          )}

          {/* Zigzag Roadmap */}
          {renderZigzagRoadmap()}

          {/* Action Buttons */}
          {isEditing && selectedTarget && (
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  setIsEditing(false);
                  // Here you would save the goal to your storage
                  console.log(`Saving ${goalType} goal:`, selectedTarget);
                }}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              >
                Save Goal
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GoalDialog;
