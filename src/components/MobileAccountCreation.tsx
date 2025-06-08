
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, UserPlus, Calendar, Shield, Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';
import { useBulletproofAuth } from '@/hooks/useBulletproofAuth';
import { toast } from '@/components/ui/sonner';
import SpiritualIconSelector from './SpiritualIconSelector';
import { useBulletproofAccountManager } from '@/hooks/useBulletproofAccountManager';

interface MobileAccountCreationProps {
  onComplete: (accountCreated: boolean) => void;
}

const MobileAccountCreation: React.FC<MobileAccountCreationProps> = ({ onComplete }) => {
  const { createAccount } = useBulletproofAuth();
  const { accounts } = useBulletproofAccountManager();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentAccountIndex, setCurrentAccountIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    selectedIcon: 'om',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const totalSteps = 4;
  const existingAccounts = accounts.filter(acc => !acc.isEmpty);
  const hasAccounts = existingAccounts.length > 0;
  const canCreateMore = existingAccounts.length < 3;

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        handleCreateAccount();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      setShowCreateForm(false);
      setCurrentStep(1);
    }
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        if (!formData.name.trim()) {
          toast.error('Please enter your name');
          return false;
        }
        if (formData.name.trim().length < 2) {
          toast.error('Name must be at least 2 characters');
          return false;
        }
        break;
      case 2:
        if (!formData.dob) {
          toast.error('Please select your date of birth');
          return false;
        }
        break;
      case 3:
        break;
      case 4:
        if (!formData.password) {
          toast.error('Password is required');
          return false;
        }
        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          return false;
        }
        break;
    }
    return true;
  };

  const handleCreateAccount = async () => {
    setIsCreating(true);
    try {
      await createAccount(formData.name.trim(), formData.dob, formData.password);
      toast.success('Account created successfully!');
      setTimeout(() => {
        onComplete(true);
      }, 1000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create account');
      setIsCreating(false);
    }
  };

  const handleAddAnotherAccount = () => {
    if (!canCreateMore) {
      toast.error('Maximum 3 accounts allowed');
      return;
    }
    setShowCreateForm(true);
    setCurrentStep(1);
    setFormData({
      name: '',
      dob: '',
      selectedIcon: 'om',
      password: '',
      confirmPassword: ''
    });
  };

  const handleSwipeAccount = (direction: 'left' | 'right') => {
    if (direction === 'right' && currentAccountIndex < existingAccounts.length - 1) {
      setCurrentAccountIndex(currentAccountIndex + 1);
    } else if (direction === 'left' && currentAccountIndex > 0) {
      setCurrentAccountIndex(currentAccountIndex - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <UserPlus className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold">What's your name?</h3>
              <p className="text-sm text-gray-500">This will be displayed on your account</p>
            </div>
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-white/80 dark:bg-zinc-900/80"
                autoFocus
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Calendar className="w-12 h-12 text-blue-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold">When were you born?</h3>
              <p className="text-sm text-gray-500">This helps create your unique identity</p>
            </div>
            <div>
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData(prev => ({ ...prev, dob: e.target.value }))}
                className="bg-white/80 dark:bg-zinc-900/80"
                autoFocus
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🕉️</div>
              <h3 className="text-lg font-semibold">Choose your spiritual symbol</h3>
              <p className="text-sm text-gray-500">Select an icon that represents your spiritual journey</p>
            </div>
            <SpiritualIconSelector
              selectedIcon={formData.selectedIcon}
              onSelectIcon={(icon) => setFormData(prev => ({ ...prev, selectedIcon: icon }))}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Shield className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold">Secure your account</h3>
              <p className="text-sm text-gray-500">Create a strong password to protect your data</p>
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="bg-white/80 dark:bg-zinc-900/80 pr-10"
                  autoFocus
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="bg-white/80 dark:bg-zinc-900/80 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (showCreateForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-zinc-900 dark:via-black dark:to-zinc-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm mx-auto bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm border-amber-200/50 dark:border-zinc-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h2 className="text-lg font-semibold">Create Account</h2>
              </div>
            </div>
            
            <div className="mb-6">
              <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span className={currentStep >= 1 ? 'text-amber-600 font-medium' : ''}>Name</span>
                <span className={currentStep >= 2 ? 'text-amber-600 font-medium' : ''}>DOB</span>
                <span className={currentStep >= 3 ? 'text-amber-600 font-medium' : ''}>Icon</span>
                <span className={currentStep >= 4 ? 'text-amber-600 font-medium' : ''}>Password</span>
              </div>
            </div>
            
            {renderStep()}
            
            <div className="flex gap-3 mt-6">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                  disabled={isCreating}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              
              <Button
                onClick={handleNext}
                disabled={isCreating}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              >
                {isCreating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </div>
                ) : currentStep < totalSteps ? (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Create Account
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main account overview screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-zinc-900 dark:via-black dark:to-zinc-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🕉️</div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
            Mantra Verse
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Your spiritual accounts
          </p>
        </div>

        {/* Account Display Area */}
        {hasAccounts ? (
          <div className="mb-6">
            <Card className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm border-amber-200/50 dark:border-zinc-700/50 mb-4">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {existingAccounts[currentAccountIndex]?.account?.avatar || '🕉️'}
                </div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-2">
                  {existingAccounts[currentAccountIndex]?.account?.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Slot {existingAccounts[currentAccountIndex]?.slot}
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  onClick={() => onComplete(true)}
                >
                  Continue Journey
                </Button>
              </CardContent>
            </Card>

            {/* Swipe Navigation */}
            {existingAccounts.length > 1 && (
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSwipeAccount('left')}
                  disabled={currentAccountIndex === 0}
                  className="bg-white/60 dark:bg-zinc-800/60"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="flex gap-1">
                  {existingAccounts.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentAccountIndex
                          ? 'bg-amber-500'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSwipeAccount('right')}
                  disabled={currentAccountIndex === existingAccounts.length - 1}
                  className="bg-white/60 dark:bg-zinc-800/60"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          // First account slot (empty state)
          <Card className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm border-amber-200/50 dark:border-zinc-700/50 mb-6">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 border-3 border-dashed border-gray-400 dark:border-gray-500 rounded-full flex items-center justify-center">
                <UserPlus className="w-10 h-10 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="font-bold text-xl text-gray-800 dark:text-gray-200 mb-2">
                First Account
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                Create your spiritual identity
              </p>
              <Button 
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                onClick={handleAddAnotherAccount}
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Create Account
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Add Another Account Button */}
        {hasAccounts && canCreateMore && (
          <Button
            variant="outline"
            onClick={handleAddAnotherAccount}
            className="w-full bg-white/60 dark:bg-zinc-800/60 backdrop-blur-sm border-amber-200/50 dark:border-zinc-700/50 mb-4"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Another Account ({existingAccounts.length}/3)
          </Button>
        )}

        {/* Account limit reached */}
        {!canCreateMore && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Maximum accounts reached (3/3)
          </p>
        )}
      </div>
    </div>
  );
};

export default MobileAccountCreation;
