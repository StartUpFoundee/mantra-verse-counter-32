
import React, { useState, useEffect } from 'react';
import OnboardingScreens from './OnboardingScreens';

interface OnboardingControllerProps {
  onComplete: () => void;
}

const OnboardingController: React.FC<OnboardingControllerProps> = ({ onComplete }) => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has seen onboarding before
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    
    if (!hasSeenOnboarding) {
      // Small delay to make the experience smoother
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      // User has seen onboarding, proceed directly
      onComplete();
    }
  }, [onComplete]);

  const handleOnboardingComplete = () => {
    // Mark onboarding as seen
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
    onComplete();
  };

  if (!showOnboarding) {
    return null;
  }

  return <OnboardingScreens onComplete={handleOnboardingComplete} />;
};

export default OnboardingController;
