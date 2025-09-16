import { createRoot } from 'react-dom/client';
import './index.css';
import React, { useState } from 'react';
import ChatInterface from './ChatInterface';

// Simple App Component without Router for testing
const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'portfolio'>('home');

  const HomePage = () => (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#111827', 
      color: 'white', 
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ 
          backgroundColor: '#1f2937', 
          padding: '40px', 
          borderRadius: '12px', 
          marginBottom: '30px'
        }}>
          <h1 style={{ fontSize: '3rem', margin: '0 0 20px 0', fontWeight: 'bold' }}>
            🚀 ActiFi AI Portfolio Advisor
          </h1>
          <p style={{ fontSize: '1.3rem', color: '#9ca3af', margin: '0 0 30px 0' }}>
            Your intelligent crypto portfolio management assistant
          </p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{ 
              backgroundColor: '#374151', 
              padding: '20px', 
              borderRadius: '8px',
              textAlign: 'left'
            }}>
              <h3 style={{ fontSize: '1.3rem', margin: '0 0 10px 0' }}>📊 Portfolio Overview</h3>
              <p style={{ color: '#9ca3af', margin: '0' }}>
                Total Value: $26,673.23<br/>
                Assets: 3<br/>
                Risk: Well Diversified
              </p>
            </div>
            
            <div style={{ 
              backgroundColor: '#374151', 
              padding: '20px', 
              borderRadius: '8px',
              textAlign: 'left'
            }}>
              <h3 style={{ fontSize: '1.3rem', margin: '0 0 10px 0' }}>💰 Top Holdings</h3>
              <p style={{ color: '#9ca3af', margin: '0' }}>
                BTC: 64.8% ($17,281.50)<br/>
                ETH: 30.5% ($8,141.98)<br/>
                USDC: 4.7% ($1,249.75)
              </p>
            </div>
          </div>

          <button 
            onClick={() => setCurrentPage('portfolio')}
            style={{ 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              padding: '15px 30px', 
              borderRadius: '8px',
              border: 'none',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            View Full Portfolio Dashboard →
          </button>
        </div>

        <div style={{ 
          backgroundColor: '#1f2937', 
          padding: '30px', 
          borderRadius: '12px'
        }}>
          <h2 style={{ fontSize: '1.8rem', margin: '0 0 20px 0' }}>💬 Chat with ActiFi AI</h2>
          <p style={{ color: '#9ca3af', margin: '0 0 20px 0' }}>
            Ask questions about your portfolio, get investment advice, or request portfolio analysis
          </p>
          
          <ChatInterface />
        </div>
      </div>
    </div>
  );

  const PortfolioPage = () => (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#111827', 
      color: 'white', 
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
            Real-time portfolio analysis
          </p>
        </div>

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
                $26,673.23
              </div>
              <div style={{ color: '#9ca3af' }}>Total Value</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                3
              </div>
              <div style={{ color: '#9ca3af' }}>Assets</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
                Well Diversified
              </div>
              <div style={{ color: '#9ca3af' }}>Risk Level</div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.3rem', margin: '0 0 15px 0' }}>Asset Breakdown</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ 
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
                    backgroundColor: '#f59e0b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 'bold'
                  }}>
                    B
                  </div>
                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                      Bitcoin (BTC)
                    </div>
                    <div style={{ color: '#9ca3af' }}>
                      0.15 BTC • $115,048.00
                    </div>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
                    $17,281.50
                  </div>
                  <div style={{ color: '#9ca3af' }}>
                    64.8%
                  </div>
                  <div style={{ 
                    fontSize: '1rem',
                    color: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '5px'
                  }}>
                    📈 +0.15%
                  </div>
                </div>
              </div>

              <div style={{ 
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
                    backgroundColor: '#3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 'bold'
                  }}>
                    E
                  </div>
                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                      Ethereum (ETH)
                    </div>
                    <div style={{ color: '#9ca3af' }}>
                      1.8 ETH • $4,510.90
                    </div>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
                    $8,141.98
                  </div>
                  <div style={{ color: '#9ca3af' }}>
                    30.5%
                  </div>
                  <div style={{ 
                    fontSize: '1rem',
                    color: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '5px'
                  }}>
                    📉 -1.55%
                  </div>
                </div>
              </div>

              <div style={{ 
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
                    backgroundColor: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 'bold'
                  }}>
                    U
                  </div>
                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                      USD Coin (USDC)
                    </div>
                    <div style={{ color: '#9ca3af' }}>
                      1250 USDC • $1.00
                    </div>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
                    $1,249.75
                  </div>
                  <div style={{ color: '#9ca3af' }}>
                    4.7%
                  </div>
                  <div style={{ 
                    fontSize: '1rem',
                    color: '#9ca3af',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '5px'
                  }}>
                    ➖ 0.00%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Interface on Portfolio Page */}
        <div style={{ 
          backgroundColor: '#1f2937', 
          padding: '30px', 
          borderRadius: '12px',
          marginBottom: '30px'
        }}>
          <h2 style={{ fontSize: '1.8rem', margin: '0 0 20px 0' }}>💬 Chat with ActiFi AI</h2>
          <p style={{ color: '#9ca3af', margin: '0 0 20px 0' }}>
            Ask questions about your portfolio while viewing your assets
          </p>
          
          <ChatInterface />
        </div>

        <div style={{ 
          marginTop: '30px', 
          textAlign: 'center',
          padding: '20px'
        }}>
          <button 
            onClick={() => setCurrentPage('home')}
            style={{ 
              backgroundColor: '#6b7280', 
              color: 'white', 
              padding: '10px 20px', 
              borderRadius: '8px',
              border: 'none',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );

  return currentPage === 'home' ? <HomePage /> : <PortfolioPage />;
};

// Initialize the application
const rootElement = document.getElementById('root');
if (rootElement) {
  console.log('Root element found, rendering React app...');
  createRoot(rootElement).render(<App />);
  console.log('React app rendered successfully!');
} else {
  console.error('Root element not found!');
}

// Define types for integration with agent UI system
export interface AgentPanel {
  name: string;
  path: string;
  component: React.ComponentType<any>;
  icon?: string;
  public?: boolean;
  shortLabel?: string; // Optional short label for mobile
}

interface PanelProps {
  agentId: string;
}

/**
 * Example panel component for the plugin system
 */
const PanelComponent: React.FC<PanelProps> = ({ agentId }) => {
  return <div>Helllo {agentId}!</div>;
};

// Export the panel configuration for integration with the agent UI
export const panels: AgentPanel[] = [
  {
    name: 'Portfolio Dashboard',
    path: 'portfolio',
    component: PortfolioPanel,
    icon: 'BarChart3',
    public: true,
    shortLabel: 'Portfolio',
  },
  {
    name: 'Example',
    path: 'example',
    component: PanelComponent,
    icon: 'Book',
    public: false,
    shortLabel: 'Example',
  },
];

export * from './utils';
