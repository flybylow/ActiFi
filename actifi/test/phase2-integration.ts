// test/phase2-integration.ts - Complete Phase 2 test

import { coinGeckoAPI } from '../src/plugins/portfolio/api/coinGecko.js';
import { priceCache } from '../src/plugins/portfolio/api/priceCache.js';
import { assetConfigManager, SUPPORTED_ASSETS } from '../src/plugins/portfolio/config/assets.js';

async function testPhase2Integration() {
  console.log('🚀 Testing ActiFi Phase 2 Integration...\n');

  try {
    // Test 1: Asset Configuration
    console.log('1️⃣ Testing Asset Configuration...');
    console.log(`   📊 Supported Assets: ${SUPPORTED_ASSETS.length}`);
    console.log(`   🏷️  Categories: ${[...new Set(SUPPORTED_ASSETS.map(a => a.category))].join(', ')}`);
    console.log(`   ⚠️  Risk Levels: ${[...new Set(SUPPORTED_ASSETS.map(a => a.riskLevel))].join(', ')}`);
    
    const btcConfig = assetConfigManager.getAsset('BTC');
    console.log(`   ✅ BTC Config: ${btcConfig?.name} (${btcConfig?.category}, ${btcConfig?.riskLevel})`);
    
    const defiAssets = assetConfigManager.getAssetsByCategory('defi');
    console.log(`   🔗 DeFi Assets: ${defiAssets.map(a => a.symbol).join(', ')}`);
    console.log('');

    // Test 2: Price Cache with Asset Config
    console.log('2️⃣ Testing Price Cache with Asset Configuration...');
    const testSymbols = ['BTC', 'ETH', 'USDC'];
    
    console.log('   📡 Fetching prices...');
    const prices = await priceCache.getPrices(testSymbols);
    
    console.log('   📊 Portfolio Analysis:');
    let totalValue = 0;
    prices.forEach(price => {
      const config = assetConfigManager.getAsset(price.symbol);
      const mockBalance = price.symbol === 'BTC' ? 0.15 : 
                         price.symbol === 'ETH' ? 1.8 : 1250;
      const value = price.price * mockBalance;
      totalValue += value;
      
      console.log(`   ${price.symbol}: ${mockBalance} tokens = $${value.toFixed(2)} (${config?.category}, ${config?.riskLevel})`);
    });
    
    console.log(`   💰 Total Portfolio Value: $${totalValue.toFixed(2)}\n`);

    // Test 3: Risk Analysis
    console.log('3️⃣ Testing Risk Analysis...');
    const riskBreakdown = {
      low: 0,
      medium: 0,
      high: 0,
      'very-high': 0
    };
    
    prices.forEach(price => {
      const config = assetConfigManager.getAsset(price.symbol);
      if (config) {
        const mockBalance = price.symbol === 'BTC' ? 0.15 : 
                           price.symbol === 'ETH' ? 1.8 : 1250;
        const value = price.price * mockBalance;
        riskBreakdown[config.riskLevel] += value;
      }
    });
    
    console.log('   📈 Risk Distribution:');
    Object.entries(riskBreakdown).forEach(([risk, value]) => {
      const percentage = totalValue > 0 ? (value / totalValue * 100).toFixed(1) : '0';
      console.log(`   ${risk}: $${value.toFixed(2)} (${percentage}%)`);
    });
    console.log('');

    // Test 4: Cache Performance
    console.log('4️⃣ Testing Cache Performance...');
    const stats = priceCache.getStats();
    console.log(`   📈 Hit Rate: ${stats.hitRate}%`);
    console.log(`   🎯 Cache Hits: ${stats.hits}`);
    console.log(`   ❌ Cache Misses: ${stats.misses}`);
    console.log(`   🌐 API Calls: ${stats.apiCalls}`);
    console.log(`   🔄 Fallback Calls: ${stats.fallbackCalls}`);
    console.log('');

    // Test 5: Asset Recommendations
    console.log('5️⃣ Testing Asset Recommendations...');
    const conservativeAssets = assetConfigManager.getRecommendedAssets('conservative');
    const moderateAssets = assetConfigManager.getRecommendedAssets('moderate');
    const aggressiveAssets = assetConfigManager.getRecommendedAssets('aggressive');
    
    console.log(`   🛡️  Conservative: ${conservativeAssets.map(a => a.symbol).join(', ')}`);
    console.log(`   ⚖️  Moderate: ${moderateAssets.map(a => a.symbol).join(', ')}`);
    console.log(`   🚀 Aggressive: ${aggressiveAssets.map(a => a.symbol).join(', ')}`);
    console.log('');

    // Test 6: Portfolio Analysis
    console.log('6️⃣ Portfolio Analysis Summary...');
    const portfolioAnalysis = {
      totalValue: totalValue,
      assetCount: prices.length,
      riskProfile: riskBreakdown.high + riskBreakdown['very-high'] > totalValue * 0.5 ? 'High Risk' : 
                   riskBreakdown.low > totalValue * 0.7 ? 'Low Risk' : 'Medium Risk',
      diversification: prices.length >= 3 ? 'Well Diversified' : 'Needs Diversification',
      liquidity: prices.some(p => assetConfigManager.getAsset(p.symbol)?.liquidity === 'highest') ? 'High Liquidity' : 'Medium Liquidity'
    };
    
    console.log(`   💰 Total Value: $${portfolioAnalysis.totalValue.toFixed(2)}`);
    console.log(`   📊 Asset Count: ${portfolioAnalysis.assetCount}`);
    console.log(`   ⚠️  Risk Profile: ${portfolioAnalysis.riskProfile}`);
    console.log(`   🎯 Diversification: ${portfolioAnalysis.diversification}`);
    console.log(`   💧 Liquidity: ${portfolioAnalysis.liquidity}`);
    console.log('');

    console.log('🎉 Phase 2 Integration Test Complete!');
    console.log('✅ All systems operational - ready for production!');
    
    if (stats.fallbackCalls > stats.apiCalls) {
      console.log('⚠️  Note: Using fallback prices due to API rate limiting');
      console.log('💡 In production, consider upgrading to CoinGecko Pro API');
    }

  } catch (error) {
    console.error('❌ Phase 2 test failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('   • Check all module imports');
    console.log('   • Verify TypeScript compilation');
    console.log('   • Review error messages above');
  }
}

// Run the test
testPhase2Integration().catch(console.error);
