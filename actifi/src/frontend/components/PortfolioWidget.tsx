import React, { useState, useEffect } from 'react';

interface PortfolioData {
  totalValue: number;
  assets: Array<{
    symbol: string;
    name: string;
    value: number;
    percentage: number;
    change24h: number;
    amount: number;
  }>;
  riskLevel: string;
  lastUpdated: string;
}

const mockPortfolioData: PortfolioData = {
  totalValue: 26641.71,
  assets: [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      value: 17265.75,
      percentage: 64.8,
      change24h: 0.02,
      amount: 0.15
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      value: 8126.21,
      percentage: 30.5,
      change24h: -2.10,
      amount: 1.8
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      value: 1249.75,
      percentage: 4.7,
      change24h: 0.00,
      amount: 1250
    }
  ],
  riskLevel: 'Well Diversified',
  lastUpdated: new Date().toLocaleTimeString()
};

interface PortfolioWidgetProps {
  compact?: boolean;
  showDetails?: boolean;
}

const PortfolioWidget: React.FC<PortfolioWidgetProps> = ({ 
  compact = false, 
  showDetails = true 
}) => {
  const [portfolio, setPortfolio] = useState<PortfolioData>(mockPortfolioData);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPortfolio(prev => ({
        ...prev,
        lastUpdated: new Date().toLocaleTimeString(),
        // Simulate small price changes
        assets: prev.assets.map(asset => ({
          ...asset,
          change24h: asset.change24h + (Math.random() - 0.5) * 0.1,
          value: asset.value * (1 + (Math.random() - 0.5) * 0.001)
        }))
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  if (compact) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            📊 Portfolio
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {portfolio.lastUpdated}
          </span>
        </div>
        
        <div className="text-center">
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(portfolio.totalValue)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {portfolio.assets.length} assets • {portfolio.riskLevel}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            📊 Portfolio Overview
          </h2>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Updated {portfolio.lastUpdated}
          </span>
        </div>

        {/* Total Value */}
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(portfolio.totalValue)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Portfolio Value
          </div>
        </div>

        {/* Assets */}
        {showDetails && (
          <div className="space-y-3">
            {portfolio.assets.map((asset, index) => (
              <div key={asset.symbol} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                    asset.symbol === 'BTC' ? 'bg-orange-500' :
                    asset.symbol === 'ETH' ? 'bg-blue-500' :
                    'bg-blue-600'
                  }`}>
                    {asset.symbol.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {asset.name}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {asset.amount} {asset.symbol}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(asset.value)}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {asset.percentage}%
                  </div>
                  <div className={`text-xs flex items-center justify-end ${
                    asset.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {asset.change24h >= 0 ? '📈' : '📉'} {formatPercentage(asset.change24h)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Risk Level */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Risk Level</span>
            <span className="text-sm font-medium text-green-600">{portfolio.riskLevel}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioWidget;
