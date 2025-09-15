// src/plugins/portfolio/api/coinGecko.ts

interface CoinGeckoPrice {
  usd: number;
  usd_market_cap: number;
  usd_24h_vol: number;
  usd_24h_change: number;
}

interface CoinGeckoResponse {
  [key: string]: CoinGeckoPrice;
}

interface PriceData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap: number;
  lastUpdated: Date;
}

class CoinGeckoAPI {
  private baseURL = 'https://api.coingecko.com/api/v3';
  private rateLimitDelay = 5000; // 5 seconds between requests (12 requests/minute)
  private lastRequestTime = 0;

  /**
   * Get current prices for multiple cryptocurrencies
   */
  async getPrices(symbols: string[]): Promise<PriceData[]> {
    await this.enforceRateLimit();
    
    try {
      const ids = this.mapSymbolsToIds(symbols);
      const url = `${this.baseURL}/simple/price?ids=${ids.join(',')}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
      }
      
      const data: CoinGeckoResponse = await response.json();
      
      return this.transformResponse(data, symbols);
      
    } catch (error) {
      console.error('CoinGecko API error:', error);
      throw new Error(`Failed to fetch prices: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get price for a single cryptocurrency
   */
  async getPrice(symbol: string): Promise<PriceData | null> {
    const prices = await this.getPrices([symbol]);
    return prices[0] || null;
  }

  /**
   * Health check for CoinGecko API
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/ping`);
      return response.ok;
    } catch (error) {
      console.error('CoinGecko health check failed:', error);
      return false;
    }
  }

  /**
   * Map cryptocurrency symbols to CoinGecko IDs
   */
  private mapSymbolsToIds(symbols: string[]): string[] {
    const symbolToIdMap: { [key: string]: string } = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'USDC': 'usd-coin',
      'USDT': 'tether',
      'BNB': 'binancecoin',
      'ADA': 'cardano',
      'SOL': 'solana',
      'DOT': 'polkadot',
      'MATIC': 'matic-network',
      'AVAX': 'avalanche-2',
      'LINK': 'chainlink',
      'UNI': 'uniswap',
      'LTC': 'litecoin',
      'ATOM': 'cosmos',
      'XRP': 'ripple',
      'DOGE': 'dogecoin',
      'SHIB': 'shiba-inu',
      'TRX': 'tron',
      'BCH': 'bitcoin-cash',
      'XLM': 'stellar'
    };

    return symbols.map(symbol => symbolToIdMap[symbol.toUpperCase()]).filter(Boolean);
  }

  /**
   * Transform CoinGecko response to our PriceData format
   */
  private transformResponse(data: CoinGeckoResponse, symbols: string[]): PriceData[] {
    const symbolToIdMap: { [key: string]: string } = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'USDC': 'usd-coin',
      'USDT': 'tether',
      'BNB': 'binancecoin',
      'ADA': 'cardano',
      'SOL': 'solana',
      'DOT': 'polkadot',
      'MATIC': 'matic-network',
      'AVAX': 'avalanche-2',
      'LINK': 'chainlink',
      'UNI': 'uniswap',
      'LTC': 'litecoin',
      'ATOM': 'cosmos',
      'XRP': 'ripple',
      'DOGE': 'dogecoin',
      'SHIB': 'shiba-inu',
      'TRX': 'tron',
      'BCH': 'bitcoin-cash',
      'XLM': 'stellar'
    };

    return symbols.map(symbol => {
      const id = symbolToIdMap[symbol.toUpperCase()];
      const coinData = data[id];
      
      if (!coinData) {
        console.warn(`No data found for ${symbol} (${id})`);
        return null;
      }

      return {
        symbol: symbol.toUpperCase(),
        name: this.getAssetName(symbol),
        price: coinData.usd,
        change24h: coinData.usd_24h_change || 0,
        volume: coinData.usd_24h_vol || 0,
        marketCap: coinData.usd_market_cap || 0,
        lastUpdated: new Date()
      };
    }).filter(Boolean) as PriceData[];
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
   * Enforce rate limiting (30 requests per minute)
   */
  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.rateLimitDelay) {
      const waitTime = this.rateLimitDelay - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }
}

// Export singleton instance
export const coinGeckoAPI = new CoinGeckoAPI();
export type { PriceData, CoinGeckoPrice };
