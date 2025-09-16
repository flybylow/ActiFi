import React, { useState, useEffect } from 'react';
import { Portfolio } from '../types/portfolio';

// Mock portfolio data
const mockPortfolio: Portfolio = {
  totalValue: 26698.62,
  assets: [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      balance: 0.15,
      price: 115369,
      value: 17305.35,
      percentage: 64.8,
      change24h: -0.00,
      category: 'crypto',
      riskLevel: 'medium',
      liquidity: 'highest'
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: 1.8,
      price: 4524.18,
      value: 8143.52,
      percentage: 30.5,
      change24h: -1.86,
      category: 'layer1',
      riskLevel: 'medium',
      liquidity: 'highest'
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      balance: 1250,
      price: 0.9998,
      value: 1249.75,
      percentage: 4.7,
      change24h: 0.00,
      category: 'stablecoin',
      riskLevel: 'low',
      liquidity: 'highest'
    }
  ]
};

export const SimpleDashboard: React.FC = () => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPortfolio(mockPortfolio);
      } catch (error) {
        console.error('Failed to fetch portfolio:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Failed to load portfolio data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              ActiFi Portfolio Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Your crypto portfolio analysis and insights
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => window.open('/portfolio-dashboard-ink.html', '_blank')}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span className="mr-2">📊</span>
              Enhanced Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Portfolio Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Portfolio Overview
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                ${portfolio.totalValue.toLocaleString()}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Total Value</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {portfolio.assets.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Assets</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                Well Diversified
              </div>
              <div className="text-gray-600 dark:text-gray-400">Risk Level</div>
            </div>
          </div>
        </div>

        {/* Asset Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Asset Allocation
          </h2>
          
          <div className="space-y-4">
            {portfolio.assets.map((asset, index) => {
              const changeColor = asset.change24h >= 0 ? 'text-green-600' : 'text-red-600';
              const changeIcon = asset.change24h >= 0 ? '📈' : '📉';
              
              return (
                <div key={asset.symbol} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {asset.symbol.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {asset.name} ({asset.symbol})
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {asset.category} • {asset.riskLevel} risk
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      ${asset.value.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {asset.percentage.toFixed(1)}% • {asset.balance.toFixed(4)} {asset.symbol}
                    </div>
                    <div className={`text-sm ${changeColor} flex items-center justify-end`}>
                      {changeIcon} {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}% (24h)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Visual Allocation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Visual Allocation
          </h2>
          
          <div className="space-y-3">
            {portfolio.assets.map((asset, index) => {
              const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-red-500'];
              const color = colors[index % colors.length];
              
              return (
                <div key={asset.symbol} className="flex items-center">
                  <div className="w-20 text-sm font-medium text-gray-900 dark:text-white">
                    {asset.symbol}
                  </div>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 mx-4 relative">
                    <div 
                      className={`h-6 rounded-full ${color} flex items-center justify-end pr-2`}
                      style={{ width: `${asset.percentage}%` }}
                    >
                      <span className="text-xs text-white font-medium">
                        {asset.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="w-24 text-right text-sm font-medium text-gray-900 dark:text-white">
                    ${asset.value.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Performance Summary
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Risk Distribution
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Medium Risk</span>
                  <span className="font-medium text-gray-900 dark:text-white">95.3%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Low Risk</span>
                  <span className="font-medium text-gray-900 dark:text-white">4.7%</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Key Metrics
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Volatility</span>
                  <span className="font-medium text-gray-900 dark:text-white">Medium</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Liquidity</span>
                  <span className="font-medium text-green-600">High</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Diversification</span>
                  <span className="font-medium text-green-600">Good</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
