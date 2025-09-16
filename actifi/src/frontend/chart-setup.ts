// Chart.js setup and registration for ActiFi Phase 3

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
  TimeSeriesScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';

// Register all Chart.js components we'll use
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
  TimeSeriesScale
);

// Export configured Chart.js instance
export { ChartJS };

// Default chart options for consistent styling
export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        usePointStyle: true,
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
      displayColors: true
    }
  },
  animation: {
    duration: 750,
    easing: 'easeOutQuart' as const
  }
};

// Color palette for charts
export const chartColors = {
  primary: '#F7931A', // Bitcoin orange
  secondary: '#627EEA', // Ethereum blue
  tertiary: '#2775CA', // USDC blue
  quaternary: '#9945FF', // Solana purple
  success: '#10B981', // Green
  danger: '#EF4444', // Red
  warning: '#F59E0B', // Yellow
  info: '#3B82F6', // Blue
  gray: '#6B7280',
  palette: [
    '#F7931A', // Bitcoin orange
    '#627EEA', // Ethereum blue
    '#2775CA', // USDC blue
    '#9945FF', // Solana purple
    '#FF6B35', // Generic crypto 1
    '#4ECDC4', // Generic crypto 2
    '#45B7D1', // Generic crypto 3
    '#96CEB4', // Generic crypto 4
    '#F4A261', // Generic crypto 5
    '#E76F51'  // Generic crypto 6
  ]
};
