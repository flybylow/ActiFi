import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Button, Card } from '@inkonchain/ink-kit';
import Navigation from './components/Navigation';
import PortfolioWidget from './components/PortfolioWidget';
import PortfolioPanel from './components/PortfolioPanel';
import PriceTicker from './components/PriceTicker';
import DynamicPortfolioDashboard from './components/DynamicPortfolioDashboard';
import PortfolioPage from './PortfolioPage';
import type { UUID } from '@elizaos/core';

const queryClient = new QueryClient();

// Simple layout wrapper component (fallback for InkPageLayout)
const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
};

// Simple app layout wrapper (fallback for InkLayout)
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
};

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
  const [hoveredBox, setHoveredBox] = React.useState<string | null>(null);
  const [chatInput, setChatInput] = React.useState('');
  const chatInputRef = React.useRef<HTMLInputElement>(null);

  const handleQuestionClick = (question: string) => {
    setChatInput(question);
    // Scroll to chat input
    setTimeout(() => {
      if (chatInputRef.current) {
        chatInputRef.current.focus();
        chatInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const tooltipQuestions = {
    wallet: [
      "How can I increase my total portfolio value?",
      "What's the best way to track my portfolio performance?",
      "Should I rebalance my portfolio?"
    ],
    allocation: [
      "Is my portfolio allocation optimal?",
      "How should I diversify my investments?",
      "What's the ideal asset allocation for my risk tolerance?"
    ],
    increase: [
      "What caused this portfolio increase?",
      "How can I maintain this growth rate?",
      "Is this performance sustainable?"
    ],
    holdings: [
      "Should I buy more Bitcoin?",
      "Is Ethereum a good investment right now?",
      "How much should I keep in stablecoins?"
    ]
  };

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

  // Tooltip Component
  const QuestionTooltip: React.FC<{ questions: string[]; isVisible: boolean }> = ({ questions, isVisible }) => {
    if (!isVisible) return null;

    return (
      <div style={{
        position: 'absolute',
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginTop: '12px',
        background: 'rgba(20, 20, 40, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        padding: '16px',
        minWidth: '320px',
        maxWidth: '400px',
        zIndex: 1000
      }}>
        <div style={{
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.6)',
          marginBottom: '12px',
          textAlign: 'center',
          fontWeight: '500'
        }}>
          💬 Click a question to ask:
        </div>
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => handleQuestionClick(question)}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '10px 12px',
              marginBottom: index < questions.length - 1 ? '8px' : '0',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              lineHeight: '1.4'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.4)';
              e.currentTarget.style.transform = 'translateX(4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            {question}
          </button>
        ))}
      </div>
    );
  };

  const assets = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      amount: 0.15,
      value: 17296.77,
      percentage: 64.8,
      change24h: -0.14
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      amount: 1.8,
      value: 8144.47,
      percentage: 30.5,
      change24h: -2.27
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      amount: 1250,
      value: 1248.08,
      percentage: 4.7,
      change24h: 0.02
    }
  ];

  return (
    <PageLayout>
      {/* Welcome Section */}
      <Card className="p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Welcome to ActiFi. I'm James, your Portfolio Advisor.
          </h2>
        </div>
      </Card>

      {/* Combined Total Wallet and Portfolio Allocation */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        padding: '24px',
        marginBottom: '40px'
      }}>
        <div style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'stretch'
        }}>
          {/* Left: Total Wallet */}
          <div 
            style={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'help',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={() => setHoveredBox('wallet')}
            onMouseLeave={() => setHoveredBox(null)}
          >
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              💰
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'white',
                marginBottom: '12px'
              }}>
                💼 Total Wallet Value
              </h2>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#10b981',
                marginBottom: '8px'
              }}>
                $26,689.32
              </div>
              <div style={{
                fontSize: '1rem',
                color: 'rgba(255, 255, 255, 0.7)',
                fontWeight: '500'
              }}>
                Total Portfolio Value
              </div>
            </div>
            
            <QuestionTooltip 
              questions={tooltipQuestions.wallet} 
              isVisible={hoveredBox === 'wallet'} 
            />
          </div>

          {/* Right: Portfolio Allocation */}
          <div 
            style={{
              flex: 1,
              position: 'relative',
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'help',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={() => setHoveredBox('allocation')}
            onMouseLeave={() => setHoveredBox(null)}
          >
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              📊 Portfolio Allocation
            </h2>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px'
            }}>
              {/* Donut Chart SVG */}
              <div style={{
                width: '120px',
                height: '120px',
                position: 'relative'
              }}>
                <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                  {/* Background circle */}
                  <circle
                    cx="60" cy="60" r="50"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="8"
                  />
                  {/* Bitcoin segment (64.8%) */}
                  <circle
                    cx="60" cy="60" r="50"
                    fill="none"
                    stroke="#f7931a"
                    strokeWidth="8"
                    strokeDasharray={`${64.8 * 3.14159} 314.159`}
                    strokeDashoffset="0"
                    strokeLinecap="round"
                  />
                  {/* Ethereum segment (30.5%) */}
                  <circle
                    cx="60" cy="60" r="50"
                    fill="none"
                    stroke="#627eea"
                    strokeWidth="8"
                    strokeDasharray={`${30.5 * 3.14159} 314.159`}
                    strokeDashoffset={`-${64.8 * 3.14159}`}
                    strokeLinecap="round"
                  />
                  {/* USDC segment (4.7%) */}
                  <circle
                    cx="60" cy="60" r="50"
                    fill="none"
                    stroke="#2775ca"
                    strokeWidth="8"
                    strokeDasharray={`${4.7 * 3.14159} 314.159`}
                    strokeDashoffset={`-${(64.8 + 30.5) * 3.14159}`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              
              {/* Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: '#f7931a'
                  }}></div>
                  <span style={{ color: 'white', fontSize: '14px' }}>Bitcoin 64.8%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: '#627eea'
                  }}></div>
                  <span style={{ color: 'white', fontSize: '14px' }}>Ethereum 30.5%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: '#2775ca'
                  }}></div>
                  <span style={{ color: 'white', fontSize: '14px' }}>USD Coin 4.7%</span>
                </div>
              </div>
            </div>
            
            <QuestionTooltip 
              questions={tooltipQuestions.allocation} 
              isVisible={hoveredBox === 'allocation'} 
            />
          </div>
        </div>
      </div>

      {/* Combined Portfolio Increase and Current Holdings */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        padding: '24px',
        marginBottom: '40px'
      }}>
        <div style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'stretch'
        }}>
          {/* Left: Portfolio Increase */}
          <div 
            style={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'help',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={() => setHoveredBox('increase')}
            onMouseLeave={() => setHoveredBox(null)}
          >
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              📈
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#10b981',
                marginBottom: '8px'
              }}>
                $3,212
              </div>
              <div style={{
                fontSize: '1rem',
                color: 'rgba(255, 255, 255, 0.7)',
                fontWeight: '500'
              }}>
                increase since our last chat
              </div>
            </div>
            
            <QuestionTooltip 
              questions={tooltipQuestions.increase} 
              isVisible={hoveredBox === 'increase'} 
            />
          </div>

          {/* Right: Current Holdings */}
          <div 
            style={{
              flex: 2,
              position: 'relative',
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'help',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={() => setHoveredBox('holdings')}
            onMouseLeave={() => setHoveredBox(null)}
          >
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              📊 Current Holdings
            </h2>
            
            <div style={{
              display: 'flex',
              gap: '16px',
              overflowX: 'auto',
              paddingBottom: '8px'
            }}>
              {assets.map((asset) => (
                <div key={asset.symbol} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  minWidth: '300px',
                  flexShrink: 0
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    background: asset.symbol === 'BTC' ? 'linear-gradient(135deg, #f7931a, #ff6b35)' :
                               asset.symbol === 'ETH' ? 'linear-gradient(135deg, #627eea, #4f46e5)' :
                               'linear-gradient(135deg, #2775ca, #1e40af)'
                  }}>
                    {asset.symbol.charAt(0)}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: '2px'
                    }}>
                      {asset.name}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      marginBottom: '4px'
                    }}>
                      {asset.amount} {asset.symbol}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginBottom: '2px'
                    }}>
                      {asset.percentage}% of portfolio
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: 'rgba(255, 255, 255, 0.6)'
                    }}>
                      ${(asset.value / asset.amount).toFixed(2)} per {asset.symbol}
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: 'white',
                      marginBottom: '4px'
                    }}>
                      {formatCurrency(asset.value)}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: asset.change24h >= 0 ? '#10b981' : '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '4px'
                    }}>
                      <span>{asset.change24h >= 0 ? '📈' : '📉'}</span>
                      <span>{formatPercentage(asset.change24h)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <QuestionTooltip 
              questions={tooltipQuestions.holdings} 
              isVisible={hoveredBox === 'holdings'} 
            />
          </div>
        </div>
      </div>

      {/* Risk Level Widget */}
      <Card className="p-6 mb-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full">
            <span className="text-sm font-medium">Risk Level</span>
            <span className="font-bold">Well Diversified</span>
          </div>
        </div>
      </Card>

      {/* Current Prices Row */}
      <PriceTicker />

      {/* Chat Input */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        padding: '24px',
        marginBottom: '40px'
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: 'white',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          💬 Chat with ActiFi AI
        </h2>
        
        <p style={{
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.7)',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          Ask questions about your portfolio, get investment advice, or request portfolio analysis
        </p>
        
        {/* Text Input */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            ref={chatInputRef}
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask me anything about your portfolio..."
            style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '16px',
              color: 'white',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(102, 126, 234, 0.5)';
              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.boxShadow = 'none';
            }}
          />
          <button
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '16px 24px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
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
            Send
          </button>
        </div>
      </div>
    </PageLayout>
  );
};


// Analytics Page
const AnalyticsPage: React.FC = () => {
  return (
    <PageLayout>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '24px'
      }}>
        {/* Blank State Image */}
        <div style={{
          width: '200px',
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          padding: '24px'
        }}>
          <img 
            src="/2.png" 
            alt="Analytics Coming Soon" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </div>

        {/* Content */}
        <div style={{
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '16px'
          }}>
            📈 Advanced Analytics
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: 'rgba(255, 255, 255, 0.7)',
            lineHeight: '1.6',
            marginBottom: '24px'
          }}>
            Deep portfolio insights, performance metrics, and advanced analytics are coming soon. 
            We're working on powerful tools to help you understand your investments better.
          </p>
          
          {/* Additional Images Row */}
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '32px'
          }}>
            <img src="/1.png" alt="Feature 1" style={{ width: '60px', height: '60px', opacity: 0.7 }} />
            <img src="/3.png" alt="Feature 2" style={{ width: '60px', height: '60px', opacity: 0.7 }} />
            <img src="/4.png" alt="Feature 3" style={{ width: '60px', height: '60px', opacity: 0.7 }} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

// Settings Page
const SettingsPage: React.FC = () => {
  return (
    <PageLayout>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '24px'
      }}>
        {/* Blank State Image */}
        <div style={{
          width: '200px',
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          padding: '24px'
        }}>
          <img 
            src="/5.png" 
            alt="Settings Coming Soon" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </div>

        {/* Content */}
        <div style={{
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '16px'
          }}>
            ⚙️ Portfolio Settings
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: 'rgba(255, 255, 255, 0.7)',
            lineHeight: '1.6',
            marginBottom: '24px'
          }}>
            Customize your portfolio preferences, risk tolerance, and notification settings. 
            Personalize your ActiFi experience to match your investment style.
          </p>
          
          {/* Additional Images Row */}
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '32px'
          }}>
            <img src="/6.png" alt="Feature 1" style={{ width: '60px', height: '60px', opacity: 0.7 }} />
            <img src="/4.png" alt="Feature 2" style={{ width: '60px', height: '60px', opacity: 0.7 }} />
            <img src="/3.png" alt="Feature 3" style={{ width: '60px', height: '60px', opacity: 0.7 }} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

// Main App Component
const App: React.FC = () => {
  const config = window.ELIZA_CONFIG;
  const agentId = config?.agentId;

  // Apply Morpheus theme
  React.useEffect(() => {
    // Use Ink Kit's Morpheus theme with Kraken color accents
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('ink:morpheus-theme');
    // Apply Morpheus theme colors
    document.documentElement.style.setProperty('background-color', 'rgba(15, 13, 35, 1)');
    document.documentElement.style.setProperty('color', 'rgba(255, 255, 255, 1)');
  }, []);

  if (!agentId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <div className="text-destructive font-medium mb-2">Error: Agent ID not found</div>
          <div className="text-sm text-muted-foreground">
            The server should inject the agent ID configuration.
          </div>
        </Card>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppLayout>
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </AppLayout>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
