import React, { useState, useEffect } from 'react';

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
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          backgroundColor: '#1f2937', 
          padding: '30px', 
          borderRadius: '12px', 
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 10px 0', fontWeight: 'bold' }}>
            📊 Portfolio Dashboard
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#9ca3af', margin: '0' }}>
            Real-time portfolio analysis • Last updated: {lastUpdated}
          </p>
        </div>

        {/* Portfolio Overview */}
        <div style={{ 
          backgroundColor: '#1f2937', 
          padding: '30px', 
          borderRadius: '12px', 
          marginBottom: '30px'
        }}>
          <h2 style={{ fontSize: '1.8rem', margin: '0 0 20px 0' }}>Portfolio Overview</h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>
                {formatCurrency(portfolio.totalValue)}
              </div>
              <div style={{ color: '#9ca3af' }}>Total Value</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                {portfolio.totalAssets}
              </div>
              <div style={{ color: '#9ca3af' }}>Assets</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
                {portfolio.diversification}
              </div>
              <div style={{ color: '#9ca3af' }}>Diversification</div>
            </div>
          </div>

          {/* Risk Distribution */}
          <div>
            <h3 style={{ fontSize: '1.3rem', margin: '0 0 15px 0' }}>Risk Distribution</h3>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {portfolio.riskDistribution.map((risk, index) => (
                <div key={index} style={{ 
                  backgroundColor: '#374151', 
                  padding: '15px', 
                  borderRadius: '8px',
                  flex: '1',
                  minWidth: '200px'
                }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', textTransform: 'capitalize' }}>
                    {risk.level} Risk
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
                    {formatCurrency(risk.value)}
                  </div>
                  <div style={{ color: '#9ca3af' }}>
                    {risk.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Asset Breakdown */}
        <div style={{ 
          backgroundColor: '#1f2937', 
          padding: '30px', 
          borderRadius: '12px'
        }}>
          <h2 style={{ fontSize: '1.8rem', margin: '0 0 20px 0' }}>Asset Breakdown</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {portfolio.assets.map((asset) => (
              <div key={asset.symbol} style={{ 
                backgroundColor: '#374151', 
                padding: '20px', 
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    borderRadius: '50%', 
                    backgroundColor: asset.symbol === 'BTC' ? '#f59e0b' : 
                                    asset.symbol === 'ETH' ? '#3b82f6' : '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 'bold'
                  }}>
                    {asset.symbol.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                      {asset.name} ({asset.symbol})
                    </div>
                    <div style={{ color: '#9ca3af' }}>
                      {asset.amount} {asset.symbol} • {formatCurrency(asset.value / asset.amount)}
                    </div>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
                    {formatCurrency(asset.value)}
                  </div>
                  <div style={{ color: '#9ca3af' }}>
                    {asset.percentage}%
                  </div>
                  <div style={{ 
                    fontSize: '1rem',
                    color: asset.change24h >= 0 ? '#10b981' : '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '5px'
                  }}>
                    {asset.change24h >= 0 ? '📈' : '📉'} {formatPercentage(asset.change24h)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div style={{ 
          marginTop: '30px', 
          textAlign: 'center',
          padding: '20px'
        }}>
          <a 
            href="/" 
            style={{ 
              color: '#60a5fa', 
              textDecoration: 'underline',
              fontSize: '1.1rem'
            }}
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
