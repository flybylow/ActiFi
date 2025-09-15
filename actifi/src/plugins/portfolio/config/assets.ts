// src/plugins/portfolio/config/assets.ts

export interface AssetConfig {
  symbol: string;
  name: string;
  coinGeckoId: string;
  category: 'crypto' | 'stablecoin' | 'defi' | 'meme' | 'layer1' | 'layer2';
  riskLevel: 'low' | 'medium' | 'high' | 'very-high';
  liquidity: 'highest' | 'high' | 'medium' | 'low';
  marketCapRank?: number;
  description: string;
  tags: string[];
}

export interface PortfolioAsset {
  symbol: string;
  balance: number;
  price: number;
  value: number;
  percentage: number;
  change24h: number;
  liquidity: string;
  riskLevel: string;
  category: string;
}

// Supported cryptocurrency assets
export const SUPPORTED_ASSETS: AssetConfig[] = [
  // Major Cryptocurrencies
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    coinGeckoId: 'bitcoin',
    category: 'crypto',
    riskLevel: 'medium',
    liquidity: 'highest',
    marketCapRank: 1,
    description: 'The first and largest cryptocurrency by market cap',
    tags: ['store-of-value', 'digital-gold', 'proof-of-work']
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    coinGeckoId: 'ethereum',
    category: 'layer1',
    riskLevel: 'medium',
    liquidity: 'highest',
    marketCapRank: 2,
    description: 'Smart contract platform and DeFi ecosystem',
    tags: ['smart-contracts', 'defi', 'proof-of-stake', 'layer1']
  },

  // Stablecoins
  {
    symbol: 'USDC',
    name: 'USD Coin',
    coinGeckoId: 'usd-coin',
    category: 'stablecoin',
    riskLevel: 'low',
    liquidity: 'highest',
    marketCapRank: 3,
    description: 'USD-pegged stablecoin by Circle',
    tags: ['stablecoin', 'usd-pegged', 'low-volatility']
  },
  {
    symbol: 'USDT',
    name: 'Tether',
    coinGeckoId: 'tether',
    category: 'stablecoin',
    riskLevel: 'low',
    liquidity: 'highest',
    marketCapRank: 4,
    description: 'USD-pegged stablecoin by Tether',
    tags: ['stablecoin', 'usd-pegged', 'trading-pairs']
  },

  // DeFi Tokens
  {
    symbol: 'UNI',
    name: 'Uniswap',
    coinGeckoId: 'uniswap',
    category: 'defi',
    riskLevel: 'high',
    liquidity: 'high',
    marketCapRank: 20,
    description: 'Decentralized exchange protocol governance token',
    tags: ['defi', 'dex', 'governance', 'amm']
  },
  {
    symbol: 'LINK',
    name: 'Chainlink',
    coinGeckoId: 'chainlink',
    category: 'defi',
    riskLevel: 'high',
    liquidity: 'high',
    marketCapRank: 15,
    description: 'Decentralized oracle network',
    tags: ['defi', 'oracles', 'data-feeds', 'infrastructure']
  },

  // Layer 1 Alternatives
  {
    symbol: 'SOL',
    name: 'Solana',
    coinGeckoId: 'solana',
    category: 'layer1',
    riskLevel: 'high',
    liquidity: 'high',
    marketCapRank: 5,
    description: 'High-performance blockchain platform',
    tags: ['layer1', 'high-throughput', 'proof-of-history']
  },
  {
    symbol: 'ADA',
    name: 'Cardano',
    coinGeckoId: 'cardano',
    category: 'layer1',
    riskLevel: 'high',
    liquidity: 'high',
    marketCapRank: 8,
    description: 'Research-driven blockchain platform',
    tags: ['layer1', 'proof-of-stake', 'research-driven']
  },

  // Layer 2 Solutions
  {
    symbol: 'MATIC',
    name: 'Polygon',
    coinGeckoId: 'matic-network',
    category: 'layer2',
    riskLevel: 'high',
    liquidity: 'high',
    marketCapRank: 12,
    description: 'Ethereum scaling solution',
    tags: ['layer2', 'ethereum-scaling', 'sidechain']
  },

  // Meme Coins
  {
    symbol: 'DOGE',
    name: 'Dogecoin',
    coinGeckoId: 'dogecoin',
    category: 'meme',
    riskLevel: 'very-high',
    liquidity: 'high',
    marketCapRank: 10,
    description: 'Community-driven meme cryptocurrency',
    tags: ['meme', 'community-driven', 'proof-of-work']
  },

  // Additional Major Assets
  {
    symbol: 'BNB',
    name: 'Binance Coin',
    coinGeckoId: 'binancecoin',
    category: 'crypto',
    riskLevel: 'medium',
    liquidity: 'high',
    marketCapRank: 6,
    description: 'Binance exchange utility token',
    tags: ['exchange-token', 'utility', 'binance-ecosystem']
  },
  {
    symbol: 'XRP',
    name: 'Ripple',
    coinGeckoId: 'ripple',
    category: 'crypto',
    riskLevel: 'high',
    liquidity: 'high',
    marketCapRank: 7,
    description: 'Digital payment protocol',
    tags: ['payments', 'banking', 'xrp-ledger']
  },
  {
    symbol: 'DOT',
    name: 'Polkadot',
    coinGeckoId: 'polkadot',
    category: 'layer1',
    riskLevel: 'high',
    liquidity: 'high',
    marketCapRank: 9,
    description: 'Multi-chain blockchain platform',
    tags: ['layer1', 'multi-chain', 'parachains', 'governance']
  },
  {
    symbol: 'AVAX',
    name: 'Avalanche',
    coinGeckoId: 'avalanche-2',
    category: 'layer1',
    riskLevel: 'high',
    liquidity: 'high',
    marketCapRank: 11,
    description: 'High-performance blockchain platform',
    tags: ['layer1', 'high-throughput', 'subnets']
  },
  {
    symbol: 'LTC',
    name: 'Litecoin',
    coinGeckoId: 'litecoin',
    category: 'crypto',
    riskLevel: 'medium',
    liquidity: 'high',
    marketCapRank: 13,
    description: 'Digital silver to Bitcoin\'s gold',
    tags: ['digital-silver', 'proof-of-work', 'fast-transactions']
  },
  {
    symbol: 'ATOM',
    name: 'Cosmos',
    coinGeckoId: 'cosmos',
    category: 'layer1',
    riskLevel: 'high',
    liquidity: 'medium',
    marketCapRank: 25,
    description: 'Internet of blockchains',
    tags: ['layer1', 'interoperability', 'cosmos-sdk']
  }
];

// Asset lookup utilities
export class AssetConfigManager {
  private assetMap = new Map<string, AssetConfig>();

  constructor() {
    SUPPORTED_ASSETS.forEach(asset => {
      this.assetMap.set(asset.symbol.toUpperCase(), asset);
    });
  }

  /**
   * Get asset configuration by symbol
   */
  getAsset(symbol: string): AssetConfig | undefined {
    return this.assetMap.get(symbol.toUpperCase());
  }

  /**
   * Get all supported symbols
   */
  getSupportedSymbols(): string[] {
    return SUPPORTED_ASSETS.map(asset => asset.symbol);
  }

  /**
   * Get assets by category
   */
  getAssetsByCategory(category: AssetConfig['category']): AssetConfig[] {
    return SUPPORTED_ASSETS.filter(asset => asset.category === category);
  }

  /**
   * Get assets by risk level
   */
  getAssetsByRiskLevel(riskLevel: AssetConfig['riskLevel']): AssetConfig[] {
    return SUPPORTED_ASSETS.filter(asset => asset.riskLevel === riskLevel);
  }

  /**
   * Get assets by liquidity level
   */
  getAssetsByLiquidity(liquidity: AssetConfig['liquidity']): AssetConfig[] {
    return SUPPORTED_ASSETS.filter(asset => asset.liquidity === liquidity);
  }

  /**
   * Check if symbol is supported
   */
  isSupported(symbol: string): boolean {
    return this.assetMap.has(symbol.toUpperCase());
  }

  /**
   * Get CoinGecko IDs for multiple symbols
   */
  getCoinGeckoIds(symbols: string[]): string[] {
    return symbols
      .map(symbol => this.getAsset(symbol)?.coinGeckoId)
      .filter(Boolean) as string[];
  }

  /**
   * Get recommended assets for different risk profiles
   */
  getRecommendedAssets(riskProfile: 'conservative' | 'moderate' | 'aggressive'): AssetConfig[] {
    switch (riskProfile) {
      case 'conservative':
        return this.getAssetsByRiskLevel('low').concat(
          this.getAssetsByRiskLevel('medium').slice(0, 3)
        );
      case 'moderate':
        return this.getAssetsByRiskLevel('medium').concat(
          this.getAssetsByRiskLevel('high').slice(0, 5)
        );
      case 'aggressive':
        return SUPPORTED_ASSETS.filter(asset => 
          asset.riskLevel === 'high' || asset.riskLevel === 'very-high'
        );
      default:
        return SUPPORTED_ASSETS;
    }
  }
}

// Export singleton instance
export const assetConfigManager = new AssetConfigManager();
