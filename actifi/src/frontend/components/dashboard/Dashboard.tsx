import React, { useState, useEffect } from 'react';
import { PortfolioChart } from '../charts/PortfolioChart';
import { PriceChart } from '../charts/PriceChart';
import { PerformanceChart } from '../charts/PerformanceChart';
import { GuidedOnboarding } from '../conversation/GuidedOnboarding';
import { ContextualSuggestions } from '../conversation/ContextualSuggestions';
import { Portfolio } from '../../types/portfolio';

// Mock portfolio data - in production this would come from the API
const mockPortfolio: Portfolio = {
  totalValue: 15847.23,
  assets: [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      balance: 0.15,
      price: 115474,
      value: 17321.10,
      percentage: 67.8,
      change24h: -0.36,
      category: 'crypto',
      riskLevel: 'medium',
      liquidity: 'highest'
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: 1.8,
      price: 4525.35,
      value: 8145.63,
      percentage: 31.9,
      change24h: -2.04,
      category: 'layer1',
      riskLevel: 'medium',
      liquidity: 'highest'
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      balance: 1250.00,
      price: 0.999705,
      value: 1249.63,
      percentage: 4.9,
      change24h: -0.01,
      category: 'stablecoin',
      riskLevel: 'low',
      liquidity: 'highest'
    }
  ]
};

export const Dashboard: React.FC = () => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '24h' | '7d'>('24h');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [lastQuery, setLastQuery] = useState<string>('');

  useEffect(() => {
    // Simulate API call
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        // In production, this would be: const portfolioData = await livePortfolioData.getPortfolio();
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        setPortfolio(mockPortfolio);
        
        // Show onboarding for first-time users
        const hasSeenOnboarding = localStorage.getItem('actifi-onboarding-seen');
        if (!hasSeenOnboarding) {
          setShowOnboarding(true);
        }
      } catch (error) {
        console.error('Failed to fetch portfolio:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('actifi-onboarding-seen', 'true');
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    localStorage.setItem('actifi-onboarding-seen', 'true');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLastQuery(suggestion);
    // In a real app, this would trigger the chat interface
    console.log('Suggestion clicked:', suggestion);
  };

  if (loading || !portfolio) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Guided Onboarding Modal */}
      {showOnboarding && (
        <GuidedOnboarding
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}

      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-gray-800 shadow-sm p-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          ActiFi Portfolio
        </h1>
      </div>

      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          
          {/* Portfolio Overview - Full width on mobile, 2/3 on desktop */}
          <div className="lg:col-span-8">
            <PortfolioChart portfolio={portfolio} height={320} />
          </div>
          
          {/* Stats Widget - Stacked on mobile, sidebar on desktop */}
          <div className="lg:col-span-4">
            <div className="space-y-4">
              <PortfolioWidget portfolio={portfolio} />
              <QuickActions onShowTour={() => setShowOnboarding(true)} />
            </div>
          </div>
          
          {/* Price Charts - Stacked on mobile, side-by-side on tablet+ */}
          <div className="lg:col-span-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Price Trends
                </h3>
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  {(['1h', '24h', '7d'] as const).map((timeframe) => (
                    <button
                      key={timeframe}
                      onClick={() => setSelectedTimeframe(timeframe)}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                        selectedTimeframe === timeframe
                          ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      {timeframe}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {portfolio.assets.slice(0, 4).map((asset) => (
                  <PriceChart
                    key={asset.symbol}
                    symbol={asset.symbol}
                    timeframe={selectedTimeframe}
                    height={180}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Performance Chart */}
          <div className="lg:col-span-6">
            <PerformanceChart assets={portfolio.assets} height={300} />
          </div>
          
          {/* Contextual Suggestions */}
          <div className="lg:col-span-12">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Smart Suggestions
              </h3>
              <ContextualSuggestions
                portfolio={portfolio}
                lastQuery={lastQuery}
                onSuggestionClick={handleSuggestionClick}
              />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

// Portfolio Widget Component
const PortfolioWidget: React.FC<{ portfolio: Portfolio }> = ({ portfolio }) => {
  const totalChange24h = portfolio.assets.reduce((sum, asset) => 
    sum + (asset.value * (asset.change24h / 100)), 0
  );
  const totalChangePercentage = (totalChange24h / portfolio.totalValue) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Portfolio Summary
      </h3>
      
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            ${portfolio.totalValue.toLocaleString()}
          </div>
          <div className={`text-sm ${totalChangePercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalChangePercentage >= 0 ? '+' : ''}{totalChangePercentage.toFixed(2)}% (24h)
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <div className="font-medium text-gray-900 dark:text-white">
              {portfolio.assets.length}
            </div>
            <div className="text-gray-500 dark:text-gray-400">Assets</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-900 dark:text-white">
              {Math.max(...portfolio.assets.map(a => a.percentage)).toFixed(1)}%
            </div>
            <div className="text-gray-500 dark:text-gray-400">Top Position</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Quick Actions Component
const QuickActions: React.FC<{ onShowTour: () => void }> = ({ onShowTour }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Quick Actions
      </h3>
      
      <div className="space-y-3">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
          View Full Analysis
        </button>
        <button className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-2 px-4 rounded-md transition-colors">
          Export Portfolio
        </button>
        <button className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-2 px-4 rounded-md transition-colors">
          Get Recommendations
        </button>
        <button 
          onClick={() => {
            localStorage.removeItem('actifi-onboarding-seen');
            onShowTour();
          }}
          className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
        >
          Show Tour Again
        </button>
      </div>
    </div>
  );
};

// Loading Skeleton Component
const DashboardSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div className="max-w-7xl mx-auto p-4 lg:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
