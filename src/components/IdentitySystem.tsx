
import React, { useState } from 'react';
import { useBulletproofAuth } from '@/hooks/useBulletproofAuth';
import MobileAccountCreation from './MobileAccountCreation';
import BulletproofLoginDialog from './BulletproofLoginDialog';
import OnboardingController from './OnboardingController';

export type IdentityView = 'onboarding' | 'mobile-creation' | 'login';

interface IdentitySystemProps {
  onAuthSuccess: () => void;
}

const IdentitySystem: React.FC<IdentitySystemProps> = ({ onAuthSuccess }) => {
  const { isAuthenticated } = useBulletproofAuth();
  const [currentView, setCurrentView] = useState<IdentityView>('onboarding');
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  // If authenticated, don't show identity system
  if (isAuthenticated) {
    return null;
  }

  const handleOnboardingComplete = () => {
    setCurrentView('mobile-creation');
  };

  const handleAccountCreated = (accountCreated: boolean) => {
    if (accountCreated) {
      // Account was created and user is automatically logged in
      // Directly call onAuthSuccess without delay
      onAuthSuccess();
    }
  };

  const handleLoginSuccess = () => {
    // User successfully logged in, trigger auth success to redirect to home
    onAuthSuccess();
  };

  const handleCancel = () => {
    setCurrentView('mobile-creation');
    setSelectedSlot(null);
  };

  switch (currentView) {
    case 'onboarding':
      return <OnboardingController onComplete={handleOnboardingComplete} />;

    case 'login':
      return (
        <BulletproofLoginDialog
          targetSlot={selectedSlot!}
          onSuccess={handleLoginSuccess}
          onCancel={handleCancel}
        />
      );

    default:
      return (
        <MobileAccountCreation
          onComplete={handleAccountCreated}
        />
      );
  }
};

export default IdentitySystem;
