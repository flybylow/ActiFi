// Portfolio and chart data types for Phase 3

export interface Asset {
  symbol: string;
  name: string;
  balance: number;
  price: number;
  value: number;
  percentage: number;
  change24h: number;
  category: string;
  riskLevel: string;
  liquidity: string;
}

export interface Portfolio {
  totalValue: number;
  assets: Asset[];
}

export interface PriceData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap: number;
  lastUpdated: Date;
}

export interface ChartTimeframe {
  value: '1h' | '24h' | '7d' | '30d';
  label: string;
}

export interface PortfolioStats {
  totalValue: number;
  totalChange24h: number;
  assetCount: number;
  diversificationScore: number;
  riskDistribution: Record<string, number>;
}

// Chart-specific interfaces
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
  tension?: number;
}

export interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  plugins?: {
    legend?: any;
    tooltip?: any;
  };
  scales?: any;
  interaction?: any;
  animation?: any;
}
