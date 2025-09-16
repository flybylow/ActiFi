import React from 'react';

/**
 * Portfolio Link Component
 * A simple link component that can be used in chat or other interfaces
 */
const PortfolioLink: React.FC = () => {
  const dashboardUrl = `${window.location.origin}/portfolio-dashboard-ink.html`;
  
  return (
    <div className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <div className="text-center">
        <div className="flex items-center justify-center mb-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold mr-3">
            📊
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Portfolio Dashboard
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View your crypto portfolio with interactive charts
            </p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => window.open(dashboardUrl, '_blank')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <span className="mr-2">🚀</span>
            Open Dashboard
          </button>
          
          <button
            onClick={() => window.open(dashboardUrl, '_self')}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            <span className="mr-2">📱</span>
            Full Screen
          </button>
        </div>
        
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Features: Real-time data • Interactive charts • Ink Kit design • Mobile responsive
        </div>
      </div>
    </div>
  );
};

export default PortfolioLink;
