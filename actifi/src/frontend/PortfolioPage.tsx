import React, { useState, useEffect } from 'react';
import { GuidedOnboarding } from './components/conversation/GuidedOnboarding';

interface Asset {
  symbol: string;
  name: string;
  amount: number;
  value: number;
  percentage: number;
  change24h: number;
  risk: string;
}

interface PortfolioData {
  totalValue: number;
  assets: Asset[];
  riskDistribution: { level: string; value: number; percentage: number }[];
  totalAssets: number;
  diversification: string;
}

const PortfolioPage: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [portfolio, setPortfolio] = useState<PortfolioData>({
    totalValue: 26673.228,
    assets: [
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        amount: 0.15,
        value: 17281.5,
        percentage: 64.8,
        change24h: 0.15,
        risk: 'medium'
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        amount: 1.8,
        value: 8141.976,
        percentage: 30.5,
        change24h: -1.55,
        risk: 'medium'
      },
      {
        symbol: 'USDC',
        name: 'USD Coin',
        amount: 1250,
        value: 1249.753,
        percentage: 4.7,
        change24h: -0.00,
        risk: 'low'
      }
    ],
    riskDistribution: [
      { level: 'medium', value: 25423.476, percentage: 95.3 },
      { level: 'low', value: 1249.753, percentage: 4.7 }
    ],
    totalAssets: 3,
    diversification: 'Well Diversified'
  });

  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  // Check for first-time user and show onboarding
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('actifi-onboarding-seen');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('actifi-onboarding-seen', 'true');
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    localStorage.setItem('actifi-onboarding-seen', 'true');
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date().toLocaleTimeString());
      // Simulate small price changes
      setPortfolio(prev => ({
        ...prev,
        assets: prev.assets.map(asset => ({
          ...asset,
          change24h: asset.change24h + (Math.random() - 0.5) * 0.1,
          value: asset.value * (1 + (Math.random() - 0.5) * 0.001)
        })),
        totalValue: prev.assets.reduce((sum, asset) => sum + asset.value, 0)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#111827', 
      color: 'white', 
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Guided Onboarding Modal */}
      {showOnboarding && (
        <GuidedOnboarding
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Portfolio Dashboard Message */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          padding: '30px',
          marginBottom: '30px'
        }}>
          <div style={{
            fontSize: '1.2rem',
            fontWeight: '600',
            color: 'white',
            marginBottom: '10px'
          }}>
            📊 Dynamic Portfolio Dashboard
          </div>
          <div style={{
            fontSize: '1rem',
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '8px'
          }}>
            Real-time portfolio analysis and insights
          </div>
          <div style={{
            fontSize: '0.9rem',
            color: 'rgba(255, 255, 255, 0.6)'
          }}>
            Last updated: {lastUpdated} • Risk Level : Well Diversified, your portfolio is well balanced.
          </div>
        </div>

        {/* Portfolio Overview Message */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          padding: '30px',
          marginBottom: '30px'
        }}>
          <div style={{
            fontSize: '1.2rem',
            fontWeight: '600',
            color: 'white',
            marginBottom: '15px'
          }}>
            📊 Portfolio Overview
          </div>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#10b981',
            marginBottom: '8px'
          }}>
            $26,582.48 Total Value
          </div>
          <div style={{
            fontSize: '1.1rem',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '8px'
          }}>
            3 Assets
          </div>
          <div style={{
            fontSize: '1rem',
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '10px'
          }}>
            Well Diversified Risk Level
          </div>
          <div style={{
            fontSize: '0.9rem',
            color: 'rgba(255, 255, 255, 0.6)'
          }}>
            Portfolio Allocation: BTC 64.8% • ETH 30.5% • USDC 4.7%
          </div>
        </div>

        {/* Portfolio Charts Message */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          padding: '30px',
          marginBottom: '30px'
        }}>
          <div style={{
            fontSize: '1.2rem',
            fontWeight: '600',
            color: 'white',
            marginBottom: '15px'
          }}>
            📊 Portfolio Allocation & 24h Performance
          </div>
          <div style={{
            fontSize: '1rem',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '10px'
          }}>
            Your portfolio is allocated 64.8% Bitcoin, 30.5% Ethereum, and 4.7% USD Coin.
          </div>
          <div style={{
            fontSize: '0.9rem',
            color: 'rgba(255, 255, 255, 0.7)'
          }}>
            24h changes: BTC -0.14% • ETH -2.27% • USDC +0.02%
          </div>
        </div>

        {/* Asset Breakdown Messages */}
        {portfolio.assets.map((asset) => (
          <div key={asset.symbol} style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            padding: '30px',
            marginBottom: '30px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '15px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: asset.symbol === 'BTC' ? 'linear-gradient(135deg, #f7931a, #ff6b35)' :
                            asset.symbol === 'ETH' ? 'linear-gradient(135deg, #627eea, #4f46e5)' :
                            'linear-gradient(135deg, #2775ca, #1e40af)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: 'white'
              }}>
                {asset.symbol.charAt(0)}
              </div>
              <div>
                <div style={{
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '5px'
                }}>
                  {asset.name} {asset.amount} {asset.symbol}
                </div>
                <div style={{
                  fontSize: '1.1rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: '5px'
                }}>
                  {formatCurrency(asset.value)} ({asset.percentage}% of portfolio)
                </div>
                <div style={{
                  fontSize: '1rem',
                  color: asset.change24h >= 0 ? '#10b981' : '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <span>{asset.change24h >= 0 ? '📈' : '📉'}</span>
                  <span>{asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}% (24h)</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Show Tour Again Button */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button
            onClick={() => setShowOnboarding(true)}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '25px',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: '500',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
            }}
          >
            🎯 Show Tour Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;