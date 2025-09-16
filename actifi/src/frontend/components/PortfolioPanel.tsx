import React from 'react';
import type { UUID } from '@elizaos/core';

interface PanelProps {
  agentId: string;
}

/**
 * Portfolio Dashboard Panel Component
 * Displays the portfolio dashboard in an iframe within the ElizaOS client
 */
const PortfolioPanel: React.FC<PanelProps> = ({ agentId }) => {
  // Get the current origin to construct the dashboard URL
  const dashboardUrl = `${window.location.origin}/portfolio-dashboard-ink.html`;
  
  return (
    <div className="h-full w-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            📊 Portfolio Dashboard
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your crypto portfolio analysis and insights
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => window.open(dashboardUrl, '_blank')}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            🔗 Open Full Screen
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1.5 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>
      
      {/* Dashboard iframe */}
      <div className="flex-1 relative">
        <iframe
          src={dashboardUrl}
          className="w-full h-full border-0"
          title="ActiFi Portfolio Dashboard"
          sandbox="allow-scripts allow-same-origin allow-forms"
          style={{
            minHeight: '600px',
            background: 'transparent'
          }}
        />
        
        {/* Loading overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900" id="loading-overlay">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading Portfolio Dashboard...</p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div>
            Powered by ActiFi AI • Data from CoinGecko API
          </div>
          <div>
            Agent ID: {agentId.slice(0, 8)}...
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPanel;
