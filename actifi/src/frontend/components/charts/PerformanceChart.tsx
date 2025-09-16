import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Asset } from '../../types/portfolio';
import { chartColors } from '../../chart-setup';

interface PerformanceChartProps {
  assets: Asset[];
  height?: number;
  timeframe?: '24h' | '7d' | '30d';
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  assets,
  height = 200,
  timeframe = '24h'
}) => {
  const chartData = useMemo(() => {
    const sortedAssets = [...assets]
      .filter(asset => asset.change24h !== undefined)
      .sort((a, b) => (b.change24h || 0) - (a.change24h || 0));

    return {
      labels: sortedAssets.map(asset => asset.symbol),
      datasets: [{
        label: `${timeframe} Change %`,
        data: sortedAssets.map(asset => asset.change24h || 0),
        backgroundColor: sortedAssets.map(asset => 
          (asset.change24h || 0) >= 0 ? chartColors.success : chartColors.danger
        ),
        borderColor: sortedAssets.map(asset => 
          (asset.change24h || 0) >= 0 ? '#059669' : '#DC2626'
        ),
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false
      }]
    };
  }, [assets, timeframe]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
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
          label: (context: any) => {
            const asset = assets.find(a => a.symbol === context.label);
            return [
              `${context.label}: ${context.parsed.x.toFixed(2)}%`,
              `Value: $${asset?.value.toLocaleString() || '0'}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(107, 114, 128, 0.1)'
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11
          },
          callback: (value: any) => `${value}%`
        }
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11,
            weight: 'bold' as const
          }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart' as const
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-900 dark:text-white">
          Asset Performance
        </h4>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {timeframe}
        </div>
      </div>
      
      <div style={{ height: `${height}px` }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};
