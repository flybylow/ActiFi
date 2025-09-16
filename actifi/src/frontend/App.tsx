import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navigation from './components/Navigation';
import PortfolioWidget from './components/PortfolioWidget';
import PortfolioPanel from './components/PortfolioPanel';
import PriceTicker from './components/PriceTicker';
import DynamicPortfolioDashboard from './components/DynamicPortfolioDashboard';
import type { UUID } from '@elizaos/core';

const queryClient = new QueryClient();

// Define the interface for the ELIZA_CONFIG
interface ElizaConfig {
  agentId: string;
  apiBase: string;
}

// Declare global window extension for TypeScript
declare global {
  interface Window {
    ELIZA_CONFIG?: ElizaConfig;
  }
}

// Home/Chat Page Component
const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to ActiFi AI Portfolio Advisor
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Your intelligent crypto portfolio management assistant
            </p>
          </div>
        </div>

        {/* Widgets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <PortfolioWidget />
          <PriceTicker />
        </div>

        {/* Chat Interface */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              💬 Chat with ActiFi AI
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ask questions about your portfolio, get investment advice, or request portfolio analysis
            </p>
          </div>
          
          {/* Chat Interface iframe */}
          <div className="relative" style={{ height: '600px' }}>
            <iframe
              src="http://localhost:3001"
              className="w-full h-full border-0 rounded-b-lg"
              title="ActiFi AI Chat Interface"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Portfolio Dashboard Page
const PortfolioPage: React.FC = () => {
  return <DynamicPortfolioDashboard />;
};

// Analytics Page
const AnalyticsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            📈 Advanced Analytics
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Advanced portfolio analytics and insights coming soon...
          </p>
        </div>
      </div>
    </div>
  );
};

// Settings Page
const SettingsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            ⚙️ Portfolio Settings
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Portfolio settings and preferences coming soon...
          </p>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  const config = window.ELIZA_CONFIG;
  const agentId = config?.agentId;

  // Apply dark mode to the root element
  React.useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  if (!agentId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 font-medium">Error: Agent ID not found</div>
          <div className="text-sm text-gray-600 mt-2">
            The server should inject the agent ID configuration.
          </div>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
