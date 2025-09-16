import React, { useMemo, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { chartColors } from '../../chart-setup';

interface PriceChartProps {
  symbol: string;
  timeframe: '1h' | '24h' | '7d';
  height?: number;
  showVolume?: boolean;
}

export const PriceChart: React.FC<PriceChartProps> = ({
  symbol,
  timeframe = '24h',
  height = 200,
  showVolume = false
}) => {
  const [priceData, setPriceData] = useState<any[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        setLoading(true);
        
        // For now, we'll simulate price data
        // In production, this would fetch from the priceCache API
        const basePrice = getMockPrice(symbol);
        
        // Generate mock historical data
        const dataPoints = timeframe === '1h' ? 12 : timeframe === '24h' ? 24 : 168;
        const mockData = Array.from({ length: dataPoints }, (_, i) => {
          const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
          const price = basePrice * (1 + variation);
          const timestamp = new Date();
          timestamp.setHours(timestamp.getHours() - (dataPoints - i));
          
          return {
            x: timestamp,
            y: price
          };
        });
        
        setPriceData(mockData);
        setCurrentPrice(basePrice);
      } catch (error) {
        console.error('Failed to fetch price data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceHistory();
    
    // Update every 30 seconds for real-time feel
    const interval = setInterval(fetchPriceHistory, 30000);
    return () => clearInterval(interval);
  }, [symbol, timeframe]);

  // Mock price function - replace with real API call
  const getMockPrice = (symbol: string): number => {
    const prices: Record<string, number> = {
      'BTC': 115474,
      'ETH': 4525.35,
      'USDC': 0.999705,
      'USDT': 0.9998,
      'SOL': 145.23,
      'ADA': 0.45,
      'DOT': 6.78,
      'MATIC': 0.89
    };
    return prices[symbol] || 100;
  };

  const chartData = useMemo(() => {
    if (!priceData.length) return { labels: [], datasets: [] };

    const isPositive = priceData[priceData.length - 1]?.y >= priceData[0]?.y;
    
    return {
      datasets: [{
        label: `${symbol} Price`,
        data: priceData,
        borderColor: isPositive ? chartColors.success : chartColors.danger,
        backgroundColor: isPositive 
          ? 'rgba(16, 185, 129, 0.1)' 
          : 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 6,
        borderWidth: 2
      }]
    };
  }, [priceData, symbol]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          title: (context: any) => {
            const date = new Date(context[0].parsed.x);
            return date.toLocaleString();
          },
          label: (context: any) => {
            return `${symbol}: $${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: timeframe === '1h' ? 'minute' : timeframe === '24h' ? 'hour' : 'day'
        },
        grid: {
          display: false
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11
          }
        }
      },
      y: {
        position: 'right' as const,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)'
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11
          },
          callback: (value: any) => `$${value.toLocaleString()}`
        }
      }
    },
    animation: {
      duration: 750,
      easing: 'easeOutQuart' as const
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900 dark:text-white">{symbol}</h4>
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-16 rounded"></div>
        </div>
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-32 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-900 dark:text-white">{symbol}</h4>
        <div className="text-right">
          <div className="font-semibold text-gray-900 dark:text-white">
            ${currentPrice.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {timeframe}
          </div>
        </div>
      </div>
      
      <div style={{ height: `${height}px` }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};
