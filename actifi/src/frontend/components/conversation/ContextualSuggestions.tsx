import React, { useMemo } from 'react';
import { Portfolio } from '../../types/portfolio';

interface ContextualSuggestionsProps {
  portfolio: Portfolio;
  lastQuery?: string;
  onSuggestionClick: (suggestion: string) => void;
}

export const ContextualSuggestions: React.FC<ContextualSuggestionsProps> = ({
  portfolio,
  lastQuery,
  onSuggestionClick
}) => {
  const suggestions = useMemo(() => {
    const suggestions: Array<{
      text: string;
      reason: string;
      icon: string;
    }> = [];

    // Portfolio-based suggestions
    if (portfolio) {
      const highestAsset = portfolio.assets.reduce((prev, current) => 
        prev.percentage > current.percentage ? prev : current
      );
      
      const cryptoPercentage = portfolio.assets
        .filter(asset => asset.symbol !== 'USDC' && asset.symbol !== 'USDT')
        .reduce((sum, asset) => sum + asset.percentage, 0);

      // High crypto exposure
      if (cryptoPercentage > 80) {
        suggestions.push({
          text: "Is my portfolio too risky?",
          reason: `${cryptoPercentage.toFixed(0)}% crypto exposure`,
          icon: "⚠️"
        });
      }

      // Concentrated position
      if (highestAsset.percentage > 60) {
        suggestions.push({
          text: `Should I reduce my ${highestAsset.symbol} position?`,
          reason: `${highestAsset.percentage.toFixed(0)}% in ${highestAsset.symbol}`,
          icon: "🎯"
        });
      }

      // Recent gains
      const gainers = portfolio.assets.filter(asset => 
        (asset.change24h || 0) > 10
      );
      if (gainers.length > 0) {
        suggestions.push({
          text: `Should I take profits on ${gainers[0].symbol}?`,
          reason: `${gainers[0].symbol} up ${gainers[0].change24h?.toFixed(1)}%`,
          icon: "📈"
        });
      }
    }

    // Query-based suggestions
    if (lastQuery) {
      if (lastQuery.includes('price')) {
        suggestions.push({
          text: "How does this affect my portfolio?",
          reason: "Price impact analysis",
          icon: "📊"
        });
      }
      
      if (lastQuery.includes('need') || lastQuery.includes('money')) {
        suggestions.push({
          text: "What are the tax implications?",
          reason: "Tax optimization",
          icon: "📋"
        });
      }
    }

    // Always available
    suggestions.push({
      text: "Show me price trends",
      reason: "Market analysis",
      icon: "📈"
    });

    return suggestions.slice(0, 3); // Show max 3 suggestions
  }, [portfolio, lastQuery]);

  if (suggestions.length === 0) return null;

  return (
    <div className="mt-4 space-y-2">
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
        💡 You might also want to ask:
      </div>
      
      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion.text)}
            className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors border border-gray-200 dark:border-gray-600"
          >
            <div className="flex items-start space-x-3">
              <span className="text-lg">{suggestion.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 dark:text-white text-sm">
                  "{suggestion.text}"
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {suggestion.reason}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
