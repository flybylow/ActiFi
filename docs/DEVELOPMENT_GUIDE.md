# ActiFi Development Guide - ElizaOS Implementation

**Project:** AI Portfolio Advisor Agent  
**Framework:** ElizaOS v2 with CLI  
**Duration:** Week 1 Foundation  
**Goal:** Working AI agent with portfolio intent recognition

---

## Prerequisites & Setup

### System Requirements
- **Node.js 22+** (verified - ElizaOS requires 22+, not 18)
- **Bun** package manager
- **Git** configured
- **OpenAI API Key**

### Recommended Setup (macOS/zsh)
```bash
# 1) Node + Bun with version management
brew install volta && volta install node@22
curl -fsSL https://bun.sh/install | bash
exec $SHELL -l
node -v && bun -v

# 2) ElizaOS CLI
bun install -g @elizaos/cli
elizaos --version

# 3) Create project (in root folder for simple structure)
cd /Users/warddem/dev/ActiFi_01
elizaos create .

# 4) Environment setup
elizaos env edit-local
# Add: OPENAI_API_KEY=your_openai_key_here

# 5) Git initialization
git init -b main
echo -e ".env*\nnode_modules\n.pglite*\n" >> .gitignore
git add . && git commit -m "chore: scaffold"

# 6) First run test
elizaos start
# Visit http://localhost:5173
```

---

## Project Creation (Day 1)

### Create ActiFi Project
```bash
# Create new project with interactive setup in root folder
elizaos create .

# During prompts, select:
# - Database: pglite (no setup required)
# - Model Provider: openai 
# - Project Type: project

# Project files will be created directly in /Users/warddem/dev/ActiFi_01
```

### Environment Configuration
```bash
# Open environment file
elizaos env edit-local

# Add your API keys:
OPENAI_API_KEY=your_openai_key_here
```

### First Run Test
```bash
# Start the agent
elizaos start

# Should see:
# - Agent running at http://localhost:5173
# - React UI with chat interface
# - Basic agent responding to messages
```

---

## Project Structure Overview

After CLI generation, you'll have:

```
actifi/
├── src/
│   ├── index.ts              # Main entry point
│   ├── character.ts          # 🎯 Main file to customize
│   └── plugins/              # Custom functionality
├── public/                   # Static assets  
├── .env.local               # Environment variables
├── package.json             # Dependencies
└── elizaos.config.ts        # Framework config
```

**Key Files to Modify:**
- `src/character.ts` - Agent personality, knowledge, intents
- `src/plugins/` - Portfolio analysis logic
- `.env.local` - API keys and configuration

---

## Enhanced Development Setup

### TypeScript Configuration
Create/update `tsconfig.json` for better type safety:
```json
{
  "compilerOptions": {
    "strict": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "target": "ES2022",
    "verbatimModuleSyntax": true,
    "types": ["bun-types"]
  }
}
```

### Package Scripts
Add to `package.json`:
```json
{
  "scripts": {
    "dev": "elizaos dev",
    "start": "elizaos start",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "test": "bun test"
  }
}
```

---

## Character Configuration (Days 1-2)

### Replace Default Character
Edit `src/character.ts`:

```typescript
import { Character } from '@elizaos/core';

const character: Character = {
  name: "ActiFi",
  bio: "AI Portfolio Advisor that understands natural language financial intents and provides actionable DeFi portfolio management advice.",
  
  lore: [
    "Expert in crypto portfolio analysis and risk assessment",
    "Specializes in intent-based financial decision making", 
    "Bridges traditional UX with Web3 complexity",
    "Provides clear, actionable recommendations for portfolio management"
  ],

  knowledge: [
    "Portfolio theory and risk management principles",
    "Cryptocurrency market analysis and trends",
    "DeFi protocols: Uniswap, Aave, Compound, Lido",
    "Tax implications of crypto trading",
    "Liquidity analysis and transaction cost optimization",
    "Intent recognition for financial requests"
  ],

  messageExamples: [
    [
      {
        user: "{{user1}}",
        content: {
          text: "I want to buy a $200 concert ticket, what should I sell?"
        }
      },
      {
        user: "ActiFi", 
        content: {
          text: "I understand you need $200 for a concert ticket. Let me analyze your portfolio to recommend the best assets to sell with minimal impact. Based on liquidity and your current holdings, I'd suggest selling USDC first as it's the most liquid with no price volatility risk."
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "What's my portfolio worth right now?"
        }
      },
      {
        user: "ActiFi",
        content: {
          text: "Your current portfolio value is $12,500. Here's the breakdown: 54% BTC ($6,750), 36% ETH ($4,500), 10% USDC ($1,250). Your portfolio is up 2.1% in the last 24 hours, primarily driven by Bitcoin gains."
        }
      }
    ]
  ],

  postExamples: [
    "Understanding your financial intent is the first step to smart portfolio management.",
    "Every transaction should align with your goals and risk tolerance.",
    "DeFi doesn't have to be complex - let me simplify it for you."
  ],

  style: {
    all: [
      "Be helpful and trustworthy in financial advice",
      "Use clear, jargon-free explanations",
      "Always explain the reasoning behind recommendations",
      "Focus on actionable next steps",
      "Acknowledge risks and limitations",
      "Include disclaimer: 'Not financial advice; educational only'"
    ],
    chat: [
      "Professional but approachable tone",
      "Ask clarifying questions when intent is unclear",
      "Provide specific dollar amounts and percentages",
      "Suggest multiple options when appropriate",
      "Use Markdown formatting for clarity"
    ],
    post: [
      "Educational and insightful",
      "Share portfolio management tips",
      "Explain DeFi concepts simply"
    ]
  },

  topics: [
    "portfolio analysis",
    "crypto trading",
    "DeFi protocols", 
    "risk management",
    "liquidity analysis",
    "tax optimization",
    "market trends",
    "financial planning"
  ],

  adjectives: [
    "analytical",
    "trustworthy", 
    "clear",
    "helpful",
    "knowledgeable",
    "practical",
    "risk-aware",
    "strategic"
  ]
};

export default character;
```

---

## Enhanced Portfolio Plugin (Day 2)

### Organized Plugin Structure
Create `src/plugins/portfolio/index.ts`:

```typescript
import { Plugin } from '@elizaos/core';
import { mockPortfolio } from './data.js';
import { intentPatterns, analyzeForSale } from './intents.js';
import { PortfolioResponse } from './types.js';

export const portfolioPlugin: Plugin = {
  name: "portfolio",
  description: "Portfolio analysis and intent recognition",
  
  actions: [
    {
      name: "ANALYZE_PORTFOLIO_INTENT",
      description: "Analyze user intent for portfolio actions",
      
      handler: async (runtime, message) => {
        const text = message.content.text.toLowerCase();
        
        // Enhanced money need intent with better parsing
        for (const pattern of intentPatterns.needMoney) {
          const match = text.match(pattern);
          if (match) {
            const amount = parseFloat(match[1].replace(/,/g, ''));
            
            // Handle shorthand (2k = 2000)
            const finalAmount = match[1].includes('k') ? amount * 1000 : amount;
            
            const analysis = analyzeForSale(finalAmount);
            
            let response = `You need $${finalAmount.toLocaleString()}. Here's my recommendation:\n\n`;
            
            analysis.recommendations.forEach((rec, index) => {
              response += `${index + 1}. **Sell ${rec.amount.toFixed(4)} ${rec.asset}** ($${rec.value.toFixed(2)})\n`;
              response += `   *Reason: ${rec.reason}*\n\n`;
            });
            
            if (analysis.needsMore) {
              response += `⚠️ **Insufficient funds**: You'll still need $${(finalAmount - analysis.totalCovered).toFixed(2)} more. Consider selling some BTC if necessary.\n\n`;
            }
            
            response += `*Not financial advice; educational only.*`;
            
            return { text: response };
          }
        }
        
        // Portfolio query with enhanced formatting
        for (const pattern of intentPatterns.portfolioQuery) {
          if (pattern.test(text)) {
            let response = `## Your Portfolio: $${mockPortfolio.totalValue.toLocaleString()}\n\n`;
            
            mockPortfolio.assets.forEach(asset => {
              const changeEmoji = asset.change24h > 0 ? '📈' : asset.change24h < 0 ? '📉' : '➡️';
              response += `**${asset.symbol}**: ${asset.balance} tokens = $${asset.value.toLocaleString()} (${asset.percentage}%) ${changeEmoji}\n`;
            });
            
            response += `\n*Last updated: ${new Date().toLocaleString()}*\n`;
            response += `*Not financial advice; educational only.*`;
            
            return { text: response };
          }
        }
        
        // Sell advice
        for (const pattern of intentPatterns.sellAdvice) {
          if (pattern.test(text)) {
            return { 
              text: "I'd be happy to help with selling advice! **How much money do you need**, or what's your goal for selling?\n\n*Not financial advice; educational only.*"
            };
          }
        }
        
        return null; // No portfolio intent detected
      }
    }
  ]
};
```

### Create Supporting Files

`src/plugins/portfolio/types.ts`:
```typescript
export interface Asset {
  symbol: string;
  name: string;
  balance: number;
  price: number;
  value: number;
  percentage: number;
  change24h: number;
  liquidity: 'highest' | 'high' | 'medium' | 'low';
}

export interface Portfolio {
  totalValue: number;
  lastUpdated: string;
  assets: Asset[];
}

export interface SellRecommendation {
  asset: string;
  amount: number;
  value: number;
  reason: string;
}

export interface PortfolioResponse {
  recommendations: SellRecommendation[];
  totalCovered: number;
  needsMore: boolean;
}
```

`src/plugins/portfolio/data.ts`:
```typescript
import { Portfolio } from './types.js';

export const mockPortfolio: Portfolio = {
  totalValue: 12500.00,
  lastUpdated: new Date().toISOString(),
  assets: [
    {
      symbol: "BTC",
      name: "Bitcoin", 
      balance: 0.15,
      price: 45000.00,
      value: 6750.00,
      percentage: 54.0,
      change24h: 2.5,
      liquidity: "high"
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      balance: 1.8, 
      price: 2500.00,
      value: 4500.00,
      percentage: 36.0,
      change24h: -1.2,
      liquidity: "high"
    },
    {
      symbol: "USDC", 
      name: "USD Coin",
      balance: 1250.00,
      price: 1.00,
      value: 1250.00,
      percentage: 10.0,
      change24h: 0.0,
      liquidity: "highest"
    }
  ]
};
```

`src/plugins/portfolio/intents.ts`:
```typescript
import { mockPortfolio } from './data.js';
import { PortfolioResponse } from './types.js';

// Enhanced intent recognition patterns
export const intentPatterns = {
  needMoney: [
    /i need \$?([0-9,]+(?:\.[0-9]{1,2})?k?)/i,
    /i want to buy.*\$?([0-9,]+(?:\.[0-9]{1,2})?k?)/i,
    /need ([0-9,]+(?:\.[0-9]{1,2})?k?) dollars?/i,
    /([0-9,]+(?:\.[0-9]{1,2})?k?) bucks/i
  ],
  portfolioQuery: [
    /portfolio worth/i,
    /total value/i,
    /how much.*have/i,
    /portfolio balance/i,
    /current holdings/i
  ],
  sellAdvice: [
    /what should i sell/i,
    /should i sell/i,
    /recommend selling/i,
    /best to sell/i
  ]
};

// Enhanced portfolio analysis with guardrails
export function analyzeForSale(amount: number): PortfolioResponse {
  const recommendations = [];
  let remaining = amount;
  
  // Guardrail: warn if requesting > 80% of total portfolio
  if (amount > mockPortfolio.totalValue * 0.8) {
    return {
      recommendations: [],
      totalCovered: 0,
      needsMore: true
    };
  }

  // Prioritize by liquidity and stability
  const sortedAssets = [...mockPortfolio.assets]
    .filter(asset => asset.symbol !== 'BTC') // Preserve BTC unless necessary
    .sort((a, b) => {
      if (a.liquidity === 'highest') return -1;
      if (b.liquidity === 'highest') return 1;
      return 0;
    });

  for (const asset of sortedAssets) {
    if (remaining <= 0) break;
    
    const maxSellValue = asset.value * 0.8; // Don't sell more than 80% of any position
    const sellValue = Math.min(remaining, maxSellValue);
    const sellAmount = sellValue / asset.price;

    if (sellValue > 10) { // Minimum $10 transaction
      recommendations.push({
        asset: asset.symbol,
        amount: sellAmount,
        value: sellValue,
        reason: `${asset.symbol} has ${asset.liquidity} liquidity and ${asset.change24h > 0 ? 'positive' : 'negative'} 24h performance`
      });
      remaining -= sellValue;
    }
  }

  return {
    recommendations,
    totalCovered: amount - remaining,
    needsMore: remaining > 0
  };
}
```

### Register Plugin
Update `src/index.ts`:

```typescript
import { createAgent } from '@elizaos/core';
import character from './character.js';
import { portfolioPlugin } from './plugins/portfolio/index.js';

const agent = createAgent({
  character,
  plugins: [portfolioPlugin]
});

export default agent;
```

---

## Testing Scenarios (Day 3)

### Enhanced Test Cases

1. **Intent Recognition with Various Formats**
   ```
   User: "I want to buy a $200 concert ticket"
   User: "I need 1,500 dollars"
   User: "Need $2.5k for vacation"
   Expected: Portfolio analysis with sell recommendations
   ```

2. **Portfolio Query Variations**
   ```
   User: "What's my portfolio worth?"
   User: "Show me my current holdings"
   User: "Portfolio balance?"
   Expected: Full portfolio breakdown with values
   ```

3. **Edge Cases with Guardrails**
   ```
   User: "I need $50000"  
   Expected: Insufficient funds warning
   
   User: "I need $5"
   Expected: Minimum transaction warning or USDC recommendation
   ```

### Testing Commands
```bash
# Start development server with auto-reload
elizaos dev

# Run unit tests
bun test

# Type checking
npm run typecheck
```

### Unit Test Example
Create `src/__tests__/portfolio.test.ts`:
```typescript
import { test, expect } from 'bun:test';
import { analyzeForSale, intentPatterns } from '../plugins/portfolio/intents.js';

test('analyzeForSale handles normal amounts', () => {
  const result = analyzeForSale(200);
  expect(result.recommendations.length).toBeGreaterThan(0);
  expect(result.totalCovered).toBe(200);
  expect(result.needsMore).toBe(false);
});

test('intent patterns match various formats', () => {
  const testCases = [
    "I need $200",
    "I need 1,500 dollars",
    "Need $2.5k for vacation"
  ];
  
  testCases.forEach(text => {
    const matched = intentPatterns.needMoney.some(pattern => pattern.test(text));
    expect(matched).toBe(true);
  });
});
```

---

## Development Workflow

### Daily Development Cycle
```bash
# Start development mode (auto-reload on changes)
elizaos dev

# Test in browser at localhost:5173

# Make changes to:
# - src/character.ts (personality, examples)
# - src/plugins/portfolio/ (logic, data, types)

# Run checks
npm run typecheck
bun test

# Commit changes
git add .
git commit -m "feat: enhance portfolio intent recognition"
```

### Debugging Tips
- Check console logs in both terminal and browser
- Use `console.log()` in plugin handlers for debugging
- Test one intent pattern at a time
- Verify character knowledge is loading correctly
- Use TypeScript for better error catching

---

## Week 1 Milestones

### Day 1-2 Checkpoint ✅
- [ ] ElizaOS CLI installed and working
- [ ] ActiFi project created and running
- [ ] Character configured with portfolio personality
- [ ] Basic intent recognition implemented
- [ ] TypeScript configuration enhanced
- [ ] Git repository initialized

### Day 3-4 Checkpoint ✅  
- [ ] Mock portfolio data integrated with types
- [ ] Enhanced intent patterns (decimals, commas, shorthand)
- [ ] Portfolio query responses with Markdown formatting
- [ ] Sell recommendations with guardrails
- [ ] Unit tests implemented

### Day 5-6 Checkpoint ✅
- [ ] UI testing on mobile/desktop
- [ ] All test scenarios passing
- [ ] Error handling for edge cases
- [ ] Documentation updated
- [ ] Code quality checks (lint, typecheck)

### Day 7 Checkpoint ✅
- [ ] Demo scenarios prepared
- [ ] Code cleaned and commented
- [ ] README.md created
- [ ] Ready for Phase 2 (real API integration)

---

## Pitfalls to Avoid

### Common Issues & Solutions
1. **Node version errors**: Use Node 22+, consider `volta` for version management
2. **Bun not found**: Restart terminal after Bun installation
3. **API key errors**: Check `.env.local` file format, ensure no leading/trailing spaces
4. **Plugin not loading**: Verify export/import syntax, use `.js` extensions in imports
5. **Intent not matching**: Test regex patterns separately, handle edge cases
6. **ESM resolution**: Keep `.js` extensions in TypeScript imports
7. **Port 5173 conflicts**: Free the port or configure different port
8. **pglite persistence**: Add `.pglite*` to `.gitignore`

### Getting Help
- ElizaOS Discord: Real-time community support
- GitHub Issues: Bug reports and feature requests
- Documentation: https://docs.elizaos.ai

---

## Next Steps (Phase 2 Prep)

After Week 1, you'll be ready to:
1. **Add real API integration** (CoinStats, CoinGecko)
2. **Implement blockchain connection** (wallet integration)
3. **Add DeFi position analysis** (Uniswap, Aave positions)
4. **Polish UI and add visualizations** (charts, portfolio breakdown)
5. **Deploy to production** (Phala Network or VPS)

---

## Success Criteria

**By end of Week 1, you should have:**
- ✅ Working AI agent with portfolio personality
- ✅ Enhanced intent recognition for financial requests  
- ✅ Typed mock portfolio data and recommendations
- ✅ Clean chat interface with Markdown formatting
- ✅ Unit tests and type safety
- ✅ Documented codebase ready for Phase 2

**Time Investment:** ~20 hours over 7 days (~3 hours/day)

---

*Ready to build ActiFi! Start with the ElizaOS CLI installation and let's turn financial intents into actions.*
