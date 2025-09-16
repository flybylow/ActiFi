import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Portfolio, Asset } from '../../types/portfolio';
import { chartColors } from '../../chart-setup';

interface PortfolioChartProps {
  portfolio: Portfolio;
  height?: number;
  responsive?: boolean;
}

export const PortfolioChart: React.FC<PortfolioChartProps> = ({
  portfolio,
  height = 300,
  responsive = true
}) => {
  const chartData = useMemo(() => {
    const assets = portfolio.assets.filter(asset => asset.value > 0);
    
    return {
      labels: assets.map(asset => asset.name),
      datasets: [{
        data: assets.map(asset => asset.percentage),
        backgroundColor: chartColors.palette.slice(0, assets.length),
        borderWidth: 2,
        borderColor: '#1F2937',
        cutout: '60%',
        spacing: 2
      }]
    };
  }, [portfolio.assets]);

  const options = {
    responsive,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          },
          color: '#6B7280'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context: any) => {
            const asset = portfolio.assets[context.dataIndex];
            return [
              `${asset.name}: ${context.parsed}%`,
              `Value: $${asset.value.toLocaleString()}`,
              `Balance: ${asset.balance.toFixed(4)} ${asset.symbol}`
            ];
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'nearest' as const
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1000,
      easing: 'easeOutQuart' as const
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Portfolio Allocation
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Total: ${portfolio.totalValue.toLocaleString()}
        </div>
      </div>
      
      <div style={{ height: `${height}px` }}>
        <Doughnut data={chartData} options={options} />
      </div>
      
      {/* Quick Stats */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
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
          <div className="text-gray-500 dark:text-gray-400">Largest Position</div>
        </div>
      </div>
    </div>
  );
};
