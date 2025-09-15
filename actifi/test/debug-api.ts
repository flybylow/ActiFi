// test/debug-api.ts - Debug API response

import { coinGeckoAPI } from '../src/plugins/portfolio/api/coinGecko.js';

async function debugAPI() {
  console.log('🔍 Debugging CoinGecko API response...\n');

  try {
    // Test with a single symbol first
    console.log('Testing single symbol (BTC)...');
    const btcPrice = await coinGeckoAPI.getPrice('BTC');
    console.log('BTC Price Response:', JSON.stringify(btcPrice, null, 2));
    console.log('');

    // Test with multiple symbols
    console.log('Testing multiple symbols...');
    const prices = await coinGeckoAPI.getPrices(['BTC', 'ETH', 'USDC']);
    console.log('Prices Response:', JSON.stringify(prices, null, 2));
    console.log('');

    // Check if prices array has the expected structure
    if (prices && prices.length > 0) {
      console.log('First price object keys:', Object.keys(prices[0]));
      console.log('First price object:', prices[0]);
    } else {
      console.log('No prices returned or empty array');
    }

  } catch (error) {
    console.error('Debug failed:', error);
  }
}

debugAPI().catch(console.error);
