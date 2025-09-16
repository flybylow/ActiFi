import React, { useState } from 'react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  example: string;
  icon: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'portfolio',
    title: 'View Your Portfolio',
    description: 'See your crypto holdings with real-time prices and beautiful visualizations',
    example: 'Try: "Show my portfolio" or "What\'s my portfolio worth?"',
    icon: '📊'
  },
  {
    id: 'prices',
    title: 'Check Live Prices',
    description: 'Get instant cryptocurrency prices with 24h change indicators',
    example: 'Try: "Price of Bitcoin" or "ETH price"',
    icon: '💰'
  },
  {
    id: 'planning',
    title: 'Smart Financial Planning',
    description: 'Get personalized advice on which assets to sell for your needs',
    example: 'Try: "I need $500 for vacation" or "Should I sell some crypto?"',
    icon: '🎯'
  }
];

export const GuidedOnboarding: React.FC<{
  onComplete: () => void;
  onSkip: () => void;
}> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const currentStepData = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            {currentStepData.icon}
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {currentStepData.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {currentStepData.description}
          </p>
        </div>

        {/* Example */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Try this:
          </div>
          <div className="bg-white dark:bg-gray-600 rounded-md p-3 border-l-4 border-blue-500">
            <code className="text-sm text-gray-800 dark:text-gray-200">
              {currentStepData.example}
            </code>
          </div>
        </div>

        {/* Progress */}
        <div className="flex justify-center mb-6">
          <div className="flex space-x-2">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index <= currentStep 
                    ? 'bg-blue-500' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <button
            onClick={onSkip}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm font-medium"
          >
            Skip Tour
          </button>
          
          <div className="space-x-3">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Back
              </button>
            )}
            
            <button
              onClick={() => {
                if (isLastStep) {
                  onComplete();
                } else {
                  setCurrentStep(prev => prev + 1);
                }
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              {isLastStep ? 'Get Started' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
