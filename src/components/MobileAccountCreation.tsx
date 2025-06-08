
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, ArrowLeft, ArrowRight, User, Calendar, Lock, Eye, EyeOff } from 'lucide-react';
import { useBulletproofAuth } from '@/hooks/useBulletproofAuth';
import { useBulletproofAccountManager } from '@/hooks/useBulletproofAccountManager';

interface MobileAccountCreationProps {
  onComplete: (success: boolean) => void;
  onSelectAccount: (slot: number) => void;
}

const MobileAccountCreation: React.FC<MobileAccountCreationProps> = ({ onComplete, onSelectAccount }) => {
  const { createAccount } = useBulletproofAuth();
  const { accounts, isLoading } = useBulletproofAccountManager();
  const [currentSlot, setCurrentSlot] = useState(1);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    password: ''
  });

  // Find first empty slot on mount
  useEffect(() => {
    const firstEmptySlot = accounts.find(acc => acc.isEmpty);
    if (firstEmptySlot) {
      setCurrentSlot(firstEmptySlot.slot);
    }
  }, [accounts]);

  const occupiedSlots = accounts.filter(acc => !acc.isEmpty);
  const currentAccount = accounts.find(acc => acc.slot === currentSlot);

  const handleSlotNavigation = (direction: 'left' | 'right') => {
    if (direction === 'left' && currentSlot > 1) {
      setCurrentSlot(currentSlot - 1);
    } else if (direction === 'right' && currentSlot < 3) {
      setCurrentSlot(currentSlot + 1);
    }
  };

  const handleCreateNewAccount = () => {
    const firstEmptySlot = accounts.find(acc => acc.isEmpty);
    if (firstEmptySlot) {
      setCurrentSlot(firstEmptySlot.slot);
      setShowCreateForm(true);
      setStep(1);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsCreating(true);
      console.log('Creating account for slot:', currentSlot);
      
      const account = await createAccount(formData.name, formData.dob, formData.password);
      console.log('Account created successfully:', account);
      
      // Account creation successful and user is automatically logged in
      onComplete(true);
    } catch (error) {
      console.error('Failed to create account:', error);
      setIsCreating(false);
    }
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-zinc-900 dark:via-black dark:to-zinc-800 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-200 dark:border-amber-800 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-amber-600 dark:text-amber-400 text-lg font-medium">
            Loading accounts...
          </div>
        </div>
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-zinc-900 dark:via-black dark:to-zinc-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <span className="text-sm text-gray-500">Account Slot {currentSlot}</span>
            </div>
            
            <CardTitle className="text-2xl font-bold">
              Create Your Account
            </CardTitle>
            
            {/* Progress indicators */}
            <div className="flex justify-center gap-2 mt-4">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    s === step ? 'bg-amber-500' : s < step ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {step === 1 && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <User className="w-12 h-12 mx-auto text-amber-500 mb-2" />
                    <h3 className="text-lg font-semibold">What's your name?</h3>
                  </div>
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      autoFocus
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!formData.name.trim()}
                    className="w-full"
                  >
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <Calendar className="w-12 h-12 mx-auto text-amber-500 mb-2" />
                    <h3 className="text-lg font-semibold">Date of Birth</h3>
                  </div>
                  <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={formData.dob}
                      onChange={(e) => setFormData({...formData, dob: e.target.value})}
                      required
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" onClick={prevStep} variant="outline" className="flex-1">
                      <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!formData.dob}
                      className="flex-1"
                    >
                      Continue <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <Lock className="w-12 h-12 mx-auto text-amber-500 mb-2" />
                    <h3 className="text-lg font-semibold">Secure Your Account</h3>
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
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
                  <div className="flex gap-2">
                    <Button type="button" onClick={prevStep} variant="outline" className="flex-1">
                      <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={!formData.password.trim() || isCreating}
                      className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    >
                      {isCreating ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      ) : null}
                      Create Account
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-zinc-900 dark:via-black dark:to-zinc-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🕉️</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
            MantraVerse
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Your spiritual journey begins here
          </p>
        </div>

        {/* Account Slot Navigation */}
        {occupiedSlots.length > 0 && (
          <div className="flex items-center justify-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSlotNavigation('left')}
              disabled={currentSlot === 1}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex gap-2">
              {[1, 2, 3].map((slot) => (
                <button
                  key={slot}
                  onClick={() => setCurrentSlot(slot)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    slot === currentSlot
                      ? 'bg-amber-500'
                      : accounts.find(acc => acc.slot === slot && !acc.isEmpty)
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSlotNavigation('right')}
              disabled={currentSlot === 3}
              className="p-2"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Current Slot Display */}
        <Card className="mb-6">
          <CardContent className="p-6 text-center">
            {currentAccount?.isEmpty ? (
              <>
                <div className="w-20 h-20 mx-auto mb-4 border-3 border-dashed border-gray-400 dark:border-gray-500 rounded-full flex items-center justify-center">
                  <Plus className="w-10 h-10 text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="font-bold text-xl text-gray-800 dark:text-gray-200 mb-2">
                  Account Slot {currentSlot}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Create your spiritual identity
                </p>
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Account
                </Button>
              </>
            ) : (
              <>
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {currentAccount.account?.name?.[0] || '?'}
                </div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-2">
                  {currentAccount.account?.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Slot {currentSlot} • Created {new Date(currentAccount.account?.createdAt || '').toLocaleDateString()}
                </p>
                <Button
                  onClick={() => onSelectAccount(currentSlot)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  <User className="w-4 h-4 mr-2" />
                  Continue as {currentAccount.account?.name.split(' ')[0]}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Add Another Account Button */}
        {occupiedSlots.length > 0 && occupiedSlots.length < 3 && (
          <Button
            onClick={handleCreateNewAccount}
            variant="outline"
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Another Account
          </Button>
        )}
      </div>
    </div>
  );
};

export default MobileAccountCreation;
