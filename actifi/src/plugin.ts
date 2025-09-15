import type { Plugin, Action, ActionResult, Content, HandlerCallback, IAgentRuntime, Memory, State } from '@elizaos/core';
import { logger } from '@elizaos/core';
import { priceCache } from './plugins/portfolio/api/priceCache.js';
import { assetConfigManager } from './plugins/portfolio/config/assets.js';

// Mock portfolio data (in production, this would come from wallet connection)
const mockPortfolio = {
  totalValue: 0, // Will be calculated dynamically
  assets: [
    { symbol: "BTC", balance: 0.15 },
    { symbol: "ETH", balance: 1.8 },
    { symbol: "USDC", balance: 1250.00 }
  ]
};

const portfolioAction: Action = {
  name: 'PORTFOLIO_QUERY',
  similes: ['PORTFOLIO_ANALYSIS'],
  description: 'Handle portfolio queries with real-time data',
  
  validate: async (runtime: IAgentRuntime, message: Memory, state: State): Promise<boolean> => {
    const text = message.content.text.toLowerCase();
    return text.includes('portfolio') || text.includes('worth') || text.includes('balance') || 
           text.includes('how much') || text.includes('value');
  },
  
  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State,
    options: any,
    callback: HandlerCallback
  ): Promise<ActionResult> => {
    try {
      logger.info('Fetching real-time portfolio data...');
      
      // Get real-time prices
      const symbols = mockPortfolio.assets.map(asset => asset.symbol);
      const prices = await priceCache.getPrices(symbols);
      
      // Calculate portfolio values
      let totalValue = 0;
      const portfolioData = mockPortfolio.assets.map(asset => {
        const priceData = prices.find(p => p.symbol === asset.symbol);
        if (!priceData) {
          logger.warn(`No price data found for ${asset.symbol}`);
          return null;
        }
        
        const value = asset.balance * priceData.price;
        totalValue += value;
        
        const config = assetConfigManager.getAsset(asset.symbol);
        
        return {
          symbol: asset.symbol,
          name: priceData.name,
          balance: asset.balance,
          price: priceData.price,
          value: value,
          percentage: 0, // Will calculate after we have totalValue
          change24h: priceData.change24h,
          category: config?.category || 'unknown',
          riskLevel: config?.riskLevel || 'unknown',
          liquidity: config?.liquidity || 'unknown'
        };
      }).filter(Boolean);
      
      // Calculate percentages
      portfolioData.forEach(asset => {
        asset.percentage = totalValue > 0 ? (asset.value / totalValue) * 100 : 0;
      });
      
      // Sort by value (highest first)
      portfolioData.sort((a, b) => b.value - a.value);
      
      // Generate response
      let responseText = `## Your Portfolio: $${totalValue.toLocaleString()}\n\n`;
      
      portfolioData.forEach(asset => {
        const changeEmoji = asset.change24h > 0 ? '📈' : asset.change24h < 0 ? '📉' : '➡️';
        const changeText = asset.change24h > 0 ? `+${asset.change24h.toFixed(2)}%` : 
                          asset.change24h < 0 ? `${asset.change24h.toFixed(2)}%` : '0.00%';
        
        responseText += `**${asset.symbol}**: ${asset.balance} tokens = $${asset.value.toLocaleString()} (${asset.percentage.toFixed(1)}%) ${changeEmoji}\n`;
        responseText += `   *${asset.name} - ${asset.category} (${asset.riskLevel} risk)*\n`;
        responseText += `   *24h Change: ${changeText}*\n\n`;
      });
      
      // Add portfolio analysis
      const riskBreakdown = portfolioData.reduce((acc, asset) => {
        acc[asset.riskLevel] = (acc[asset.riskLevel] || 0) + asset.value;
        return acc;
      }, {} as Record<string, number>);
      
      responseText += `### 📊 Portfolio Analysis\n`;
      responseText += `**Risk Distribution:**\n`;
      Object.entries(riskBreakdown).forEach(([risk, value]) => {
        const percentage = (value / totalValue * 100).toFixed(1);
        responseText += `- ${risk}: $${value.toLocaleString()} (${percentage}%)\n`;
      });
      
      responseText += `\n**Total Assets:** ${portfolioData.length}\n`;
      responseText += `**Diversification:** ${portfolioData.length >= 3 ? 'Well Diversified' : 'Needs More Assets'}\n`;
      
      // Add disclaimer
      responseText += `\n*Not financial advice; educational only. Data from CoinGecko API.*`;
      
      const response: Content = {
        text: responseText,
        source: message.content.source,
      };
      
      await callback(response);
      logger.info(`Portfolio analysis complete: $${totalValue.toLocaleString()}`);
      return { text: 'Portfolio analysis complete', success: true };
      
    } catch (error) {
      logger.error('Portfolio analysis error:', error);
      
      // Fallback response
      const fallbackResponse: Content = {
        text: "I'm having trouble accessing real-time portfolio data right now. Please try again in a moment.\n\n*Not financial advice; educational only.*",
        source: message.content.source,
      };
      
      await callback(fallbackResponse);
      return { text: 'Portfolio error - fallback used', success: false };
    }
  },
  
  examples: [
    [
      {
        name: '{{name1}}',
        content: {
          text: 'What\'s my portfolio worth?',
        },
      },
      {
        name: 'ActiFi',
        content: {
          text: 'Let me analyze your portfolio with real-time data...',
        },
      },
    ],
    [
      {
        name: '{{name1}}',
        content: {
          text: 'Show me my portfolio balance',
        },
      },
      {
        name: 'ActiFi',
        content: {
          text: 'I\'ll fetch your current portfolio valuation...',
        },
      },
    ],
  ]
};

// Enhanced money need action with real data
const moneyNeedAction: Action = {
  name: 'MONEY_NEED_INTENT',
  similes: ['SELL_RECOMMENDATION'],
  description: 'Handle money need requests with real-time analysis',
  
  validate: async (runtime: IAgentRuntime, message: Memory, state: State): Promise<boolean> => {
    const text = message.content.text.toLowerCase();
    return /i need \$?([0-9,]+(?:\.[0-9]{1,2})?k?)/i.test(text) || 
           /i want to buy.*\$?([0-9,]+(?:\.[0-9]{1,2})?k?)/i.test(text);
  },
  
  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State,
    options: any,
    callback: HandlerCallback
  ): Promise<ActionResult> => {
    try {
      const text = message.content.text;
      const amountMatch = text.match(/\$?([0-9,]+(?:\.[0-9]{1,2})?k?)/i);
      
      if (!amountMatch) {
        const response: Content = {
          text: "I understand you need money, but I couldn't determine the amount. Could you specify how much you need? (e.g., 'I need $500')",
          source: message.content.source,
        };
        await callback(response);
        return { text: 'Amount clarification needed', success: true };
      }
      
      let amount = parseFloat(amountMatch[1].replace(',', ''));
      if (amountMatch[1].toLowerCase().includes('k')) {
        amount *= 1000;
      }
      
      logger.info(`Analyzing sell recommendations for $${amount}`);
      
      // Get current prices
      const symbols = mockPortfolio.assets.map(asset => asset.symbol);
      const prices = await priceCache.getPrices(symbols);
      
      // Calculate which assets to sell
      const sellRecommendations = mockPortfolio.assets.map(asset => {
        const priceData = prices.find(p => p.symbol === asset.symbol);
        if (!priceData) return null;
        
        const value = asset.balance * priceData.price;
        const config = assetConfigManager.getAsset(asset.symbol);
        
        return {
          symbol: asset.symbol,
          name: priceData.name,
          balance: asset.balance,
          price: priceData.price,
          value: value,
          change24h: priceData.change24h,
          liquidity: config?.liquidity || 'unknown',
          riskLevel: config?.riskLevel || 'unknown',
          category: config?.category || 'unknown'
        };
      }).filter(Boolean);
      
      // Sort by liquidity and risk (prefer high liquidity, low risk)
      sellRecommendations.sort((a, b) => {
        const liquidityOrder = { 'highest': 4, 'high': 3, 'medium': 2, 'low': 1 };
        const riskOrder = { 'low': 4, 'medium': 3, 'high': 2, 'very-high': 1 };
        
        const aScore = liquidityOrder[a.liquidity] + riskOrder[a.riskLevel];
        const bScore = liquidityOrder[b.liquidity] + riskOrder[b.riskLevel];
        
        return bScore - aScore;
      });
      
      let responseText = `## Sell Recommendations for $${amount.toLocaleString()}\n\n`;
      responseText += `I'll analyze your portfolio to recommend the best assets to sell with minimal impact:\n\n`;
      
      let remainingAmount = amount;
      const recommendations = [];
      
      for (const asset of sellRecommendations) {
        if (remainingAmount <= 0) break;
        
        const sellAmount = Math.min(remainingAmount, asset.value);
        const sellPercentage = (sellAmount / asset.value) * 100;
        const tokensToSell = (sellAmount / asset.price);
        
        if (sellPercentage > 0) {
          recommendations.push({
            asset,
            sellAmount,
            sellPercentage,
            tokensToSell
          });
          remainingAmount -= sellAmount;
        }
      }
      
      recommendations.forEach((rec, index) => {
        const changeEmoji = rec.asset.change24h > 0 ? '📈' : rec.asset.change24h < 0 ? '📉' : '➡️';
        const changeText = rec.asset.change24h > 0 ? `+${rec.asset.change24h.toFixed(2)}%` : 
                          rec.asset.change24h < 0 ? `${rec.asset.change24h.toFixed(2)}%` : '0.00%';
        
        responseText += `**${index + 1}. ${rec.asset.symbol}** - ${rec.asset.name}\n`;
        responseText += `   💰 Sell: $${rec.sellAmount.toLocaleString()} (${rec.sellPercentage.toFixed(1)}% of holding)\n`;
        responseText += `   🪙 Tokens: ${rec.tokensToSell.toFixed(6)} ${rec.asset.symbol}\n`;
        responseText += `   📊 Current: $${rec.asset.price.toLocaleString()} ${changeEmoji} (${changeText})\n`;
        responseText += `   ⚠️  Risk: ${rec.asset.riskLevel} | 💧 Liquidity: ${rec.asset.liquidity}\n\n`;
      });
      
      if (remainingAmount > 0) {
        responseText += `⚠️ **Note**: You need $${remainingAmount.toLocaleString()} more. Consider:\n`;
        responseText += `- Selling additional assets\n`;
        responseText += `- Waiting for price appreciation\n`;
        responseText += `- Adding more funds to your portfolio\n\n`;
      }
      
      responseText += `### 💡 Why These Recommendations?\n`;
      responseText += `- **Liquidity First**: Prioritizing highly liquid assets for easier selling\n`;
      responseText += `- **Risk Management**: Avoiding unnecessary risk exposure\n`;
      responseText += `- **Minimal Impact**: Preserving your core portfolio balance\n\n`;
      
      responseText += `*Not financial advice; educational only. Consider tax implications and market conditions.*`;
      
      const response: Content = {
        text: responseText,
        source: message.content.source,
      };
      
      await callback(response);
      logger.info(`Sell recommendations provided for $${amount}`);
      return { text: 'Sell recommendations provided', success: true };
      
    } catch (error) {
      logger.error('Money need analysis error:', error);
      
      const fallbackResponse: Content = {
        text: "I'm having trouble analyzing your portfolio for sell recommendations right now. Please try again in a moment.\n\n*Not financial advice; educational only.*",
        source: message.content.source,
      };
      
      await callback(fallbackResponse);
      return { text: 'Sell analysis error - fallback used', success: false };
    }
  },
  
  examples: [
    [
      {
        name: '{{name1}}',
        content: {
          text: 'I need $500 for vacation',
        },
      },
      {
        name: 'ActiFi',
        content: {
          text: 'Let me analyze your portfolio to recommend the best assets to sell...',
        },
      },
    ],
  ]
};

// Price query action for direct cryptocurrency price requests
const priceQueryAction: Action = {
  name: 'PRICE_QUERY',
  similes: ['CRYPTO_PRICE'],
  description: 'Handle direct cryptocurrency price queries with real-time data',
  
  validate: async (runtime: IAgentRuntime, message: Memory, state: State): Promise<boolean> => {
    const text = message.content.text.toLowerCase();
    return text.includes('price') && (
      text.includes('btc') || text.includes('bitcoin') ||
      text.includes('eth') || text.includes('ethereum') ||
      text.includes('usdc') || text.includes('usd coin') ||
      text.includes('crypto') || text.includes('cryptocurrency')
    );
  },
  
  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State,
    options: any,
    callback: HandlerCallback
  ): Promise<ActionResult> => {
    try {
      const text = message.content.text.toLowerCase();
      logger.info('Processing price query with real-time data...');
      
      // Determine which cryptocurrency to query
      let symbols: string[] = [];
      if (text.includes('btc') || text.includes('bitcoin')) {
        symbols = ['BTC'];
      } else if (text.includes('eth') || text.includes('ethereum')) {
        symbols = ['ETH'];
      } else if (text.includes('usdc') || text.includes('usd coin')) {
        symbols = ['USDC'];
      } else {
        // Default to BTC if no specific crypto mentioned
        symbols = ['BTC'];
      }
      
      // Get real-time prices
      const prices = await priceCache.getPrices(symbols);
      
      if (prices.length === 0) {
        const response: Content = {
          text: "I'm having trouble fetching real-time price data right now. Please try again in a moment.\n\n*Not financial advice; educational only.*",
          source: message.content.source,
        };
        await callback(response);
        return { text: 'Price query error - no data', success: false };
      }
      
      // Format response
      let responseText = '';
      prices.forEach(price => {
        const changeEmoji = price.change24h >= 0 ? '📈' : '📉';
        const changeText = price.change24h >= 0 ? '+' : '';
        responseText += `**${price.name} (${price.symbol})**: $${price.price.toLocaleString()} ${changeEmoji} ${changeText}${price.change24h.toFixed(2)}% (24h)\n`;
      });
      
      responseText += `\n*Real-time data from CoinGecko API. Not financial advice; educational only.*`;
      
      const response: Content = {
        text: responseText,
        source: message.content.source,
      };
      
      await callback(response);
      logger.info(`Price query complete for ${symbols.join(', ')}`);
      return { text: 'Price query complete', success: true };
      
    } catch (error) {
      logger.error('Price query error:', error);
      
      const fallbackResponse: Content = {
        text: "I'm having trouble accessing real-time price data right now. Please try again in a moment.\n\n*Not financial advice; educational only.*",
        source: message.content.source,
      };
      
      await callback(fallbackResponse);
      return { text: 'Price query error - fallback used', success: false };
    }
  },
  
  examples: [
    [
      {
        name: '{{name1}}',
        content: {
          text: 'What is the price of Bitcoin?',
        },
      },
      {
        name: 'ActiFi',
        content: {
          text: 'Let me fetch the current Bitcoin price...',
        },
      },
    ],
    [
      {
        name: '{{name1}}',
        content: {
          text: 'price of btc?',
        },
      },
      {
        name: 'ActiFi',
        content: {
          text: '**Bitcoin (BTC)**: $115,474 📈 +2.15% (24h)\n\n*Real-time data from CoinGecko API. Not financial advice; educational only.*',
        },
      },
    ],
  ]
};

const plugin: Plugin = {
  name: 'actifi-portfolio-enhanced',
  description: 'ActiFi Enhanced Portfolio Plugin with Real-Time Data',
  actions: [portfolioAction, moneyNeedAction, priceQueryAction],
};

export default plugin;