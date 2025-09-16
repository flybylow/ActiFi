import React, { useState, useEffect } from 'react';

interface PriceData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: number;
}

const mockPriceData: PriceData[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: 115105.00, change24h: 0.02, volume: 28473920123 },
  { symbol: 'ETH', name: 'Ethereum', price: 4514.56, change24h: -2.10, volume: 15234567890 },
  { symbol: 'USDC', name: 'USD Coin', price: 1.00, change24h: 0.00, volume: 8765432109 }
];

interface PriceTickerProps {
  compact?: boolean;
}

const PriceTicker: React.FC<PriceTickerProps> = ({ compact = false }) => {
  const [prices, setPrices] = useState<PriceData[]>(mockPriceData);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => prev.map(price => ({
        ...price,
        price: price.price * (1 + (Math.random() - 0.5) * 0.001),
        change24h: price.change24h + (Math.random() - 0.5) * 0.1
      })));
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(price);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  if (compact) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          💰 Live Prices
        </h3>
        <div className="space-y-2">
          {prices.map((price) => (
            <div key={price.symbol} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-gray-900 dark:text-white">
                  {price.symbol}
                </span>
              </div>
              <div className="text-right">
                <div className="text-xs font-medium text-gray-900 dark:text-white">
                  {formatPrice(price.price)}
                </div>
                <div className={`text-xs ${
                  price.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatPercentage(price.change24h)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          💰 Live Price Ticker
        </h2>
        
        <div className="space-y-4">
          {prices.map((price) => (
            <div key={price.symbol} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  price.symbol === 'BTC' ? 'bg-orange-500' :
                  price.symbol === 'ETH' ? 'bg-blue-500' :
                  'bg-blue-600'
                }`}>
                  {price.symbol.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {price.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {price.symbol}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatPrice(price.price)}
                </div>
                <div className={`text-sm flex items-center justify-end ${
                  price.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {price.change24h >= 0 ? '📈' : '📉'} {formatPercentage(price.change24h)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Vol: ${(price.volume / 1000000000).toFixed(1)}B
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PriceTicker;
