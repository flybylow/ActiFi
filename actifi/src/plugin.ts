import type { Plugin, Action, ActionResult, Content, HandlerCallback, IAgentRuntime, Memory, State } from '@elizaos/core';
import { logger } from '@elizaos/core';

const portfolioAction: Action = {
  name: 'PORTFOLIO_QUERY',
  similes: ['PORTFOLIO_ANALYSIS'],
  description: 'Handle portfolio queries',
  
  validate: async (runtime: IAgentRuntime, message: Memory, state: State): Promise<boolean> => {
    const text = message.content.text.toLowerCase();
    return text.includes('portfolio') || text.includes('worth') || text.includes('balance');
  },
  
  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State,
    options: any,
    callback: HandlerCallback
  ): Promise<ActionResult> => {
    try {
      const response: Content = {
        text: "## Your Portfolio: $12,500\n\n**BTC**: 0.15 tokens = $6,750 (54%) 📈\n**ETH**: 1.8 tokens = $4,500 (36%) 📉\n**USDC**: 1250 tokens = $1,250 (10%) ➡️\n\n*Not financial advice; educational only.*",
        source: message.content.source,
      };
      
      await callback(response);
      return { text: 'Portfolio shown', success: true };
    } catch (error) {
      logger.error('Portfolio error:', error);
      return { text: 'Portfolio error', success: false };
    }
  },
  
  examples: []
};

const plugin: Plugin = {
  name: 'actifi-portfolio',
  description: 'ActiFi Portfolio Plugin',
  actions: [portfolioAction],
};

export default plugin;
