import type { Plugin, Action, ActionResult, Content, HandlerCallback, IAgentRuntime, Memory, State } from '@elizaos/core';
import { logger } from '@elizaos/core';

const mockPortfolio = {
  totalValue: 12500.00,
  assets: [
    { symbol: "BTC", balance: 0.15, price: 45000.00, value: 6750.00, percentage: 54.0, change24h: 2.5, liquidity: "high" },
    { symbol: "ETH", balance: 1.8, price: 2500.00, value: 4500.00, percentage: 36.0, change24h: -1.2, liquidity: "high" },
    { symbol: "USDC", balance: 1250.00, price: 1.00, value: 1250.00, percentage: 10.0, change24h: 0.0, liquidity: "highest" }
  ]
};

const intentPatterns = {
  needMoney: [/i need \$?([0-9,]+(?:\.[0-9]{1,2})?k?)/i, /i want to buy.*\$?([0-9,]+(?:\.[0-9]{1,2})?k?)/i],
  portfolioQuery: [/portfolio worth/i, /total value/i, /how much.*have/i, /portfolio balance/i],
  sellAdvice: [/what should i sell/i, /should i sell/i, /recommend selling/i]
};

const portfolioIntentAction: Action = {
  name: 'ANALYZE_PORTFOLIO_INTENT',
  similes: ['PORTFOLIO_ANALYSIS', 'FINANCIAL_ADVICE'],
  description: 'Analyze user intent for portfolio actions',

  validate: async (_runtime: IAgentRuntime, message: Memory, _state: State): Promise<boolean> => {
    const text = message.content.text.toLowerCase();
    return intentPatterns.needMoney.some(p => p.test(text)) || 
           intentPatterns.portfolioQuery.some(p => p.test(text)) || 
           intentPatterns.sellAdvice.some(p => p.test(text));
  },

  handler: async (_runtime: IAgentRuntime, message: Memory, _state: State, _options: any, callback: HandlerCallback): Promise<ActionResult> => {
    try {
      const text = message.content.text.toLowerCase();
      let responseText = '';

      for (const pattern of intentPatterns.needMoney) {
        const match = text.match(pattern);
        if (match) {
          const amount = parseFloat(match[1].replace(/,/g, ''));
          const finalAmount = match[1].includes('k') ? amount * 1000 : amount;
          responseText = `You need $${finalAmount.toLocaleString()}. Based on your portfolio, I recommend selling USDC first as it has the highest liquidity.\n\n*Not financial advice; educational only.*`;
          break;
        }
      }

      if (!responseText) {
        for (const pattern of intentPatterns.portfolioQuery) {
          if (pattern.test(text)) {
            responseText = `## Your Portfolio: $${mockPortfolio.totalValue.toLocaleString()}\n\n`;
            mockPortfolio.assets.forEach(asset => {
              const emoji = asset.change24h > 0 ? '📈' : asset.change24h < 0 ? '📉' : '➡️';
              responseText += `**${asset.symbol}**: ${asset.balance} tokens = $${asset.value.toLocaleString()} (${asset.percentage}%) ${emoji}\n`;
            });
            responseText += `\n*Not financial advice; educational only.*`;
            break;
          }
        }
      }

      if (!responseText) {
        for (const pattern of intentPatterns.sellAdvice) {
          if (pattern.test(text)) {
            responseText = "I'd be happy to help! How much money do you need?\n\n*Not financial advice; educational only.*";
            break;
          }
        }
      }

      if (responseText) {
        await callback({ text: responseText, actions: ['ANALYZE_PORTFOLIO_INTENT'], source: message.content.source });
        return { text: 'Portfolio analysis completed', success: true };
      }

      return { text: '', success: false };
    } catch (error) {
      logger.error('Portfolio analysis error:', error);
      return { text: 'Failed to analyze portfolio', success: false };
    }
  },

  examples: [[
    { name: '{{name1}}', content: { text: 'What is my portfolio worth?' } },
    { name: 'ActiFi', content: { text: '## Your Portfolio: $12,500\n\n**BTC**: 0.15 tokens = $6,750 (54%) 📈' } }
  ]]
};

const plugin: Plugin = {
  name: 'actifi-portfolio',
  description: 'ActiFi Portfolio Advisor',
  actions: [portfolioIntentAction],
};

export default plugin;
