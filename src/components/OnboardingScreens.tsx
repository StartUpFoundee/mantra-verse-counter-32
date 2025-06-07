
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Mic, Hand, Calendar, Infinity, Sparkles, Volume2 } from 'lucide-react';
import ModernCard from './ModernCard';

interface OnboardingStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  image: string;
}

interface OnboardingScreensProps {
  onComplete: () => void;
}

const OnboardingScreens: React.FC<OnboardingScreensProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: "Welcome to Mantra Verse",
      subtitle: "Begin Your Spiritual Journey",
      description: "Experience the ultimate in spiritual practice. Simplify your meditation and transform your daily routine into a sacred sanctuary.",
      icon: <Sparkles className="w-16 h-16 text-white" />,
      gradient: "from-amber-400 via-orange-500 to-red-500",
      image: "/lovable-uploads/photo-1581091226825-a6a2a5aee158"
    },
    {
      id: 2,
      title: "Manual Counter",
      subtitle: "Traditional Counting Method",
      description: "Tap your screen, use earphone buttons, or volume controls. Take charge of your practice with intuitive manual counting.",
      icon: <Hand className="w-16 h-16 text-white" />,
      gradient: "from-green-400 via-emerald-500 to-teal-600",
      image: "/lovable-uploads/photo-1488590528505-98d2b5aba04b"
    },
    {
      id: 3,
      title: "Smart Audio Detection",
      subtitle: "Voice-Activated Counting",
      description: "Chant with 1-second pauses and let our intelligent system automatically count your mantras. Elevate your practice effortlessly.",
      icon: <Mic className="w-16 h-16 text-white" />,
      gradient: "from-blue-400 via-purple-500 to-indigo-600",
      image: "/lovable-uploads/photo-1649972904349-6e44c42644a7"
    },
    {
      id: 4,
      title: "Track Your Spiritual Growth",
      subtitle: "5000+ Active Practitioners",
      description: "Join thousands of spiritual seekers. Monitor your daily progress, lifetime achievements, and maintain consistent practice streaks.",
      icon: <Calendar className="w-16 h-16 text-white" />,
      gradient: "from-pink-400 via-rose-500 to-red-500",
      image: "/lovable-uploads/photo-1721322800607-8c38375eef04"
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipToEnd = () => {
    onComplete();
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-zinc-900 dark:via-black dark:to-zinc-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <ModernCard className="relative overflow-hidden border-0 shadow-2xl">
          {/* Skip Button */}
          <button
            onClick={skipToEnd}
            className="absolute top-4 right-4 z-10 text-white/80 hover:text-white text-sm font-medium transition-colors"
          >
            Skip
          </button>

          {/* Back Button */}
          {currentStep > 0 && (
            <button
              onClick={prevStep}
              className="absolute top-4 left-4 z-10 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={currentStepData.image}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-br ${currentStepData.gradient} opacity-90`} />
          </div>

          {/* Content */}
          <div className="relative z-10 p-8 text-center text-white min-h-[600px] flex flex-col justify-between">
            {/* Icon */}
            <div className="flex-1 flex flex-col items-center justify-center space-y-6">
              <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                {currentStepData.icon}
              </div>

              {/* Text Content */}
              <div className="space-y-4">
                <h1 className="text-3xl font-bold leading-tight">
                  {currentStepData.title}
                </h1>
                <h2 className="text-lg font-medium text-white/90">
                  {currentStepData.subtitle}
                </h2>
                <p className="text-white/80 text-sm leading-relaxed px-4">
                  {currentStepData.description}
                </p>
              </div>
            </div>

            {/* Progress Indicators */}
            <div className="flex justify-center space-x-2 mb-6">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'w-8 bg-white'
                      : index < currentStep
                      ? 'w-2 bg-white/60'
                      : 'w-2 bg-white/30'
                  }`}
                />
              ))}
            </div>

            {/* Action Button */}
            <Button
              onClick={nextStep}
              className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm h-14 text-lg font-semibold rounded-xl transition-all duration-300 shadow-lg"
            >
              {currentStep === steps.length - 1 ? (
                <span className="flex items-center justify-center gap-2">
                  Get Started
                  <Sparkles className="w-5 h-5" />
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </div>
        </ModernCard>

        {/* Bottom Text */}
        <p className="text-center text-gray-500 dark:text-gray-400 text-xs mt-4">
          Created with 🧡 for your spiritual journey
        </p>
      </div>
    </div>
  );
};

export default OnboardingScreens;
