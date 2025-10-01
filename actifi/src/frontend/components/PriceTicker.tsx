import React, { useState, useEffect } from 'react';

interface PriceData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: number;
  amount: number;
}

const mockPriceData: PriceData[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: 115106, change24h: -0.02, volume: 28473920123, amount: 0.15 },
  { symbol: 'ETH', name: 'Ethereum', price: 4511, change24h: -2.07, volume: 15234567890, amount: 1.8 },
  { symbol: 'USDC', name: 'USD Coin', price: 1.00, change24h: 0.00, volume: 8765432109, amount: 1250 }
];

interface PriceTickerProps {
  compact?: boolean;
}

const PriceTicker: React.FC<PriceTickerProps> = ({ compact = false }) => {
  const [prices, setPrices] = useState<PriceData[]>(mockPriceData);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => prev.map(price => ({
        ...price,
        price: price.price * (1 + (Math.random() - 0.5) * 0.001),
        change24h: price.change24h + (Math.random() - 0.5) * 0.1
      })));
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(price);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  if (compact) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        padding: '16px'
      }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: '600',
          color: 'white',
          marginBottom: '12px'
        }}>
          💰 Live Prices
        </h3>
        <div style={{
          display: 'flex',
          gap: '12px',
          overflowX: 'auto'
        }}>
          {prices.map((price) => (
            <div key={price.symbol} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              minWidth: '120px',
              flexShrink: 0
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
                background: price.symbol === 'BTC' ? 'linear-gradient(135deg, #f7931a, #ff6b35)' :
                           price.symbol === 'ETH' ? 'linear-gradient(135deg, #627eea, #4f46e5)' :
                           'linear-gradient(135deg, #2775ca, #1e40af)'
              }}>
                {price.symbol.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'white'
                }}>
                  {price.symbol}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: price.change24h >= 0 ? '#10b981' : '#ef4444'
                }}>
                  {formatPercentage(price.change24h)}
                </div>
              </div>
              <div style={{
                fontSize: '12px',
                fontWeight: '600',
                color: 'white'
              }}>
                {formatPrice(price.price)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
    }}>
      <div style={{ padding: '24px' }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: 'white',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          💰 Live Price Ticker
        </h2>
        
        <div style={{
          display: 'flex',
          gap: '16px',
          overflowX: 'auto',
          paddingBottom: '8px'
        }}>
          {prices.map((price) => (
            <div key={price.symbol} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              minWidth: '280px',
              flexShrink: 0
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                background: price.symbol === 'BTC' ? 'linear-gradient(135deg, #f7931a, #ff6b35)' :
                           price.symbol === 'ETH' ? 'linear-gradient(135deg, #627eea, #4f46e5)' :
                           'linear-gradient(135deg, #2775ca, #1e40af)'
              }}>
                {price.symbol.charAt(0)}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '2px'
                }}>
                  {price.name}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginBottom: '4px'
                }}>
                  {price.symbol}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.6)'
                }}>
                  Vol: ${(price.volume / 1000000000).toFixed(1)}B
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '4px'
                }}>
                  {formatPrice(price.price)}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: price.change24h >= 0 ? '#10b981' : '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '4px'
                }}>
                  <span>{price.change24h >= 0 ? '📈' : '📉'}</span>
                  <span>{formatPercentage(price.change24h)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PriceTicker;
