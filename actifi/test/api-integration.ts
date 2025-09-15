// test/api-integration.ts - Quick test file

import { coinGeckoAPI } from '../src/plugins/portfolio/api/coinGecko.js';
import { priceCache } from '../src/plugins/portfolio/api/priceCache.js';

async function testAPIIntegration() {
  console.log('🧪 Testing ActiFi API Integration...\n');

  try {
    // Test 1: CoinGecko Health Check
    console.log('1️⃣ Testing CoinGecko API health...');
    const isHealthy = await coinGeckoAPI.healthCheck();
    console.log(`   ✅ CoinGecko API: ${isHealthy ? 'HEALTHY' : 'UNHEALTHY'}\n`);

    if (!isHealthy) {
      console.log('⚠️  CoinGecko API is not responding. Using fallback prices only.\n');
    }

    // Test 2: Direct API Call (if healthy)
    if (isHealthy) {
      console.log('2️⃣ Testing direct API call...');
      const directPrices = await coinGeckoAPI.getPrices(['BTC', 'ETH', 'USDC']);
      console.log('   📊 Direct API Results:');
      directPrices.forEach(price => {
        console.log(`   ${price.symbol}: $${price.price.toFixed(2)} (${price.change24h > 0 ? '+' : ''}${price.change24h.toFixed(2)}%)`);
      });
      console.log('');
    }

    // Test 3: Cache Performance Test
    console.log('3️⃣ Testing cache performance...');
    
    // First call (should hit API)
    console.log('   📡 First call (API hit expected)...');
    const start1 = Date.now();
    const cachedPrices1 = await priceCache.getPrices(['BTC', 'ETH', 'USDC']);
    const time1 = Date.now() - start1;
    
    console.log('   📊 Cached Results (First Call):');
    cachedPrices1.forEach(price => {
      console.log(`   ${price.symbol}: $${price.price.toFixed(2)} (${price.change24h > 0 ? '+' : ''}${price.change24h.toFixed(2)}%)`);
    });
    console.log(`   ⏱️  Time: ${time1}ms\n`);

    // Second call (should hit cache)
    console.log('   🚀 Second call (cache hit expected)...');
    const start2 = Date.now();
    const cachedPrices2 = await priceCache.getPrices(['BTC', 'ETH', 'USDC']);
    const time2 = Date.now() - start2;
    
    console.log('   📊 Cached Results (Second Call):');
    cachedPrices2.forEach(price => {
      console.log(`   ${price.symbol}: $${price.price.toFixed(2)} (${price.change24h > 0 ? '+' : ''}${price.change24h.toFixed(2)}%)`);
    });
    console.log(`   ⏱️  Time: ${time2}ms\n`);

    // Test 4: Cache Statistics
    console.log('4️⃣ Cache Statistics:');
    const stats = priceCache.getStats();
    console.log(`   📈 Hit Rate: ${stats.hitRate}%`);
    console.log(`   🎯 Cache Hits: ${stats.hits}`);
    console.log(`   ❌ Cache Misses: ${stats.misses}`);
    console.log(`   🌐 API Calls: ${stats.apiCalls}`);
    console.log(`   🔄 Fallback Calls: ${stats.fallbackCalls}`);
    console.log(`   💾 Cache Size: ${stats.cacheSize} entries\n`);

    // Test 5: Performance Comparison
    console.log('5️⃣ Performance Analysis:');
    if (time2 < time1) {
      const improvement = ((time1 - time2) / time1 * 100).toFixed(1);
      console.log(`   🚀 Cache is ${improvement}% faster than API call!`);
    } else {
      console.log(`   ⚠️  Cache performance needs optimization`);
    }
    console.log('');

    // Test 6: Price Validation
    console.log('6️⃣ Price Validation:');
    const btcPrice = cachedPrices1.find(p => p.symbol === 'BTC');
    const ethPrice = cachedPrices1.find(p => p.symbol === 'ETH');
    const usdcPrice = cachedPrices1.find(p => p.symbol === 'USDC');

    const validations = [
      { symbol: 'BTC', price: btcPrice?.price, expected: '>$30,000', valid: (btcPrice?.price || 0) > 30000 },
      { symbol: 'ETH', price: ethPrice?.price, expected: '>$1,000', valid: (ethPrice?.price || 0) > 1000 },
      { symbol: 'USDC', price: usdcPrice?.price, expected: '~$1.00', valid: Math.abs((usdcPrice?.price || 0) - 1.00) < 0.1 }
    ];

    validations.forEach(v => {
      const status = v.valid ? '✅' : '❌';
      console.log(`   ${status} ${v.symbol}: $${v.price?.toFixed(2) || 'N/A'} (expected ${v.expected})`);
    });

    console.log('\n🎉 API Integration Test Complete!');
    
    if (isHealthy && stats.hitRate > 0) {
      console.log('✅ All systems operational - ready for production!');
    } else if (stats.fallbackCalls > 0) {
      console.log('⚠️  Using fallback prices - check API connectivity');
    } else {
      console.log('❌ Issues detected - review configuration');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('   • Check internet connection');
    console.log('   • Verify CoinGecko API is accessible');
    console.log('   • Review error messages above');
  }
}

// Run the test
testAPIIntegration().catch(console.error);
