import React, { useState, useEffect } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { Card } from '@inkonchain/ink-kit';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface PortfolioData {
  totalValue: number;
  assets: Array<{
    symbol: string;
    name: string;
    value: number;
    percentage: number;
    change24h: number;
    amount: number;
    price: number;
  }>;
  riskLevel: string;
  lastUpdated: string;
  historicalData: Array<{
    date: string;
    value: number;
  }>;
}

const mockPortfolioData: PortfolioData = {
  totalValue: 26626.57,
  assets: [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      value: 17257.20,
      percentage: 64.8,
      change24h: -0.03,
      amount: 0.15,
      price: 115048.00
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      value: 8119.62,
      percentage: 30.5,
      change24h: -1.97,
      amount: 1.8,
      price: 4510.90
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      value: 1249.75,
      percentage: 4.7,
      change24h: 0.00,
      amount: 1250,
      price: 1.00
    }
  ],
  riskLevel: 'Well Diversified',
  lastUpdated: new Date().toLocaleTimeString(),
  historicalData: [
    { date: '2024-01-01', value: 25000 },
    { date: '2024-02-01', value: 25500 },
    { date: '2024-03-01', value: 26000 },
    { date: '2024-04-01', value: 25800 },
    { date: '2024-05-01', value: 26200 },
    { date: '2024-06-01', value: 26400 },
    { date: '2024-07-01', value: 26600 },
    { date: '2024-08-01', value: 26500 },
    { date: '2024-09-01', value: 26626.57 }
  ]
};

const DynamicPortfolioDashboard: React.FC = () => {
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
          price: asset.price * (1 + (Math.random() - 0.5) * 0.001),
          value: asset.price * asset.amount
        })),
        totalValue: prev.assets.reduce((sum, asset) => sum + (asset.price * asset.amount), 0)
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

  // Chart data for portfolio allocation
  const allocationData = {
    labels: portfolio.assets.map(asset => asset.name),
    datasets: [{
      data: portfolio.assets.map(asset => asset.percentage),
      backgroundColor: [
        'rgba(249, 115, 22, 0.8)', // Orange for BTC
        'rgba(99, 102, 241, 0.8)', // Blue for ETH
        'rgba(59, 130, 246, 0.8)'  // Blue for USDC
      ],
      borderColor: [
        'rgba(249, 115, 22, 1)',
        'rgba(99, 102, 241, 1)',
        'rgba(59, 130, 246, 1)'
      ],
      borderWidth: 2,
    }]
  };

  // Chart data for performance
  const performanceData = {
    labels: portfolio.assets.map(asset => asset.symbol),
    datasets: [{
      label: '24h Change %',
      data: portfolio.assets.map(asset => asset.change24h),
      backgroundColor: portfolio.assets.map(asset => 
        asset.change24h >= 0 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)'
      ),
      borderColor: portfolio.assets.map(asset => 
        asset.change24h >= 0 ? 'rgba(34, 197, 94, 1)' : 'rgba(239, 68, 68, 1)'
      ),
      borderWidth: 1,
      borderRadius: 4
    }]
  };

  // Chart data for historical performance
  const historicalData = {
    labels: portfolio.historicalData.map(item => item.date),
    datasets: [{
      label: 'Portfolio Value',
      data: portfolio.historicalData.map(item => item.value),
      borderColor: 'rgba(59, 130, 246, 1)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart' as const
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  📊 Dynamic Portfolio Dashboard
                </h1>
                <p className="text-muted-foreground mt-2">
                  Real-time portfolio analysis and insights
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  Last updated: {portfolio.lastUpdated}
                </div>
                <div className="text-sm text-muted-foreground">
                  Risk Level: {portfolio.riskLevel}
                </div>
              </div>
            </div>
          </Card>

        {/* Portfolio Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Portfolio Overview
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(portfolio.totalValue)}
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
                {portfolio.riskLevel}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Risk Level</div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Portfolio Allocation Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Portfolio Allocation
            </h3>
            <div style={{ height: '300px' }}>
              <Doughnut data={allocationData} options={chartOptions} />
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              24h Performance
            </h3>
            <div style={{ height: '300px' }}>
              <Bar data={performanceData} options={{
                ...chartOptions,
                indexAxis: 'y' as const,
                plugins: {
                  ...chartOptions.plugins,
                  legend: { display: false }
                }
              }} />
            </div>
          </div>
        </div>

        {/* Historical Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Historical Performance
          </h3>
          <div style={{ height: '300px' }}>
            <Line data={historicalData} options={chartOptions} />
          </div>
        </div>

        {/* Asset Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Asset Breakdown
          </h2>
          
          <div className="space-y-4">
            {portfolio.assets.map((asset) => (
              <div key={asset.symbol} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                    asset.symbol === 'BTC' ? 'bg-orange-500' :
                    asset.symbol === 'ETH' ? 'bg-blue-500' :
                    'bg-blue-600'
                  }`}>
                    {asset.symbol.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {asset.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {asset.amount} {asset.symbol} • {formatCurrency(asset.price)}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(asset.value)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {asset.percentage}%
                  </div>
                  <div className={`text-sm flex items-center justify-end ${
                    asset.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {asset.change24h >= 0 ? '📈' : '📉'} {formatPercentage(asset.change24h)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicPortfolioDashboard;
