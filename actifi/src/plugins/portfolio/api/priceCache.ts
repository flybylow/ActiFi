// src/plugins/portfolio/api/priceCache.ts

import { coinGeckoAPI, PriceData } from './coinGecko.js';

interface CachedPrice {
  price: number;
  change24h: number;
  volume: number;
  marketCap: number;
  timestamp: number;
  source: 'coingecko' | 'fallback' | 'cache';
}

interface CacheStats {
  hits: number;
  misses: number;
  apiCalls: number;
  fallbackCalls: number;
  lastReset: Date;
}

class PriceCache {
  private cache = new Map<string, CachedPrice>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    apiCalls: 0,
    fallbackCalls: 0,
    lastReset: new Date()
  };

  // Fallback prices (updated with current real prices)
  private fallbackPrices: { [key: string]: CachedPrice } = {
    'BTC': {
      price: 115474,
      change24h: -0.36,
      volume: 47923971537,
      marketCap: 2300384878298,
      timestamp: Date.now(),
      source: 'fallback'
    },
    'ETH': {
      price: 4525.35,
      change24h: -2.04,
      volume: 34616161331,
      marketCap: 545974249863,
      timestamp: Date.now(),
      source: 'fallback'
    },
    'USDC': {
      price: 0.999705,
      change24h: -0.01,
      volume: 10553784922,
      marketCap: 73145463597,
      timestamp: Date.now(),
      source: 'fallback'
    }
  };

  /**
   * Get prices for multiple symbols with intelligent caching
   */
  async getPrices(symbols: string[]): Promise<PriceData[]> {
    const results: PriceData[] = [];
    const symbolsToFetch: string[] = [];

    // Check cache first
    for (const symbol of symbols) {
      const cached = this.getCachedPrice(symbol);
      if (cached) {
        results.push(this.transformCachedToPriceData(symbol, cached));
        this.stats.hits++;
      } else {
        symbolsToFetch.push(symbol);
        this.stats.misses++;
      }
    }

    // Fetch missing prices from API
    if (symbolsToFetch.length > 0) {
      try {
        const apiPrices = await coinGeckoAPI.getPrices(symbolsToFetch);
        this.stats.apiCalls++;
        
        // Cache the new prices
        for (const priceData of apiPrices) {
          this.cachePrice(priceData.symbol, {
            price: priceData.price,
            change24h: priceData.change24h,
            volume: priceData.volume,
            marketCap: priceData.marketCap,
            timestamp: Date.now(),
            source: 'coingecko'
          });
        }
        
        results.push(...apiPrices);
        
      } catch (error) {
        console.warn('API fetch failed, using fallback prices:', error);
        
        // Use fallback prices for failed symbols
        for (const symbol of symbolsToFetch) {
          const fallback = this.fallbackPrices[symbol.toUpperCase()];
          if (fallback) {
            this.stats.fallbackCalls++;
            results.push(this.transformCachedToPriceData(symbol, fallback));
          }
        }
      }
    }

    return results;
  }

  /**
   * Get price for a single symbol
   */
  async getPrice(symbol: string): Promise<PriceData | null> {
    const prices = await this.getPrices([symbol]);
    return prices[0] || null;
  }

  /**
   * Get cached price if valid
   */
  private getCachedPrice(symbol: string): CachedPrice | null {
    const cached = this.cache.get(symbol.toUpperCase());
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.cacheTimeout;
    if (isExpired) {
      this.cache.delete(symbol.toUpperCase());
      return null;
    }

    return cached;
  }

  /**
   * Cache a price
   */
  private cachePrice(symbol: string, price: CachedPrice): void {
    this.cache.set(symbol.toUpperCase(), price);
  }

  /**
   * Transform cached price to PriceData format
   */
  private transformCachedToPriceData(symbol: string, cached: CachedPrice): PriceData {
    return {
      symbol: symbol.toUpperCase(),
      name: this.getAssetName(symbol),
      price: cached.price,
      change24h: cached.change24h,
      volume: cached.volume,
      marketCap: cached.marketCap,
      lastUpdated: new Date(cached.timestamp)
    };
  }

  /**
   * Get asset name from symbol
   */
  private getAssetName(symbol: string): string {
    const nameMap: { [key: string]: string } = {
      'BTC': 'Bitcoin',
      'ETH': 'Ethereum',
      'USDC': 'USD Coin',
      'USDT': 'Tether',
      'BNB': 'Binance Coin',
      'ADA': 'Cardano',
      'SOL': 'Solana',
      'DOT': 'Polkadot',
      'MATIC': 'Polygon',
      'AVAX': 'Avalanche',
      'LINK': 'Chainlink',
      'UNI': 'Uniswap',
      'LTC': 'Litecoin',
      'ATOM': 'Cosmos',
      'XRP': 'Ripple',
      'DOGE': 'Dogecoin',
      'SHIB': 'Shiba Inu',
      'TRX': 'TRON',
      'BCH': 'Bitcoin Cash',
      'XLM': 'Stellar'
    };
    
    return nameMap[symbol.toUpperCase()] || symbol.toUpperCase();
  }

  /**
   * Clear expired cache entries
   */
  clearExpired(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];
    
    this.cache.forEach((cached, symbol) => {
      if (now - cached.timestamp > this.cacheTimeout) {
        expiredKeys.push(symbol);
      }
    });
    
    expiredKeys.forEach(symbol => this.cache.delete(symbol));
  }

  /**
   * Clear all cache
   */
  clearAll(): void {
    this.cache.clear();
    this.stats = {
      hits: 0,
      misses: 0,
      apiCalls: 0,
      fallbackCalls: 0,
      lastReset: new Date()
    };
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats & { hitRate: number; cacheSize: number } {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
    
    return {
      ...this.stats,
      hitRate: Math.round(hitRate * 100) / 100,
      cacheSize: this.cache.size
    };
  }

  /**
   * Update fallback prices (for manual updates)
   */
  updateFallbackPrice(symbol: string, price: Partial<CachedPrice>): void {
    const existing = this.fallbackPrices[symbol.toUpperCase()];
    if (existing) {
      this.fallbackPrices[symbol.toUpperCase()] = {
        ...existing,
        ...price,
        timestamp: Date.now(),
        source: 'fallback'
      };
    }
  }
}

// Export singleton instance
export const priceCache = new PriceCache();
export type { CachedPrice, CacheStats };
