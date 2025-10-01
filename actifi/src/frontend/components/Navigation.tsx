import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@inkonchain/ink-kit';

interface NavigationProps {
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
  const location = useLocation();

  const navItems = [
    {
      path: '/',
      label: '💬 Chat',
      description: 'AI Portfolio Advisor'
    },
    {
      path: '/portfolio',
      label: '📊 Portfolio',
      description: 'Portfolio Dashboard'
    },
    {
      path: '/analytics',
      label: '📈 Analytics',
      description: 'Advanced Analytics'
    },
    {
      path: '/settings',
      label: '⚙️ Settings',
      description: 'Portfolio Settings'
    }
  ];

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '70px'
        }}>
          {/* Logo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              <span style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: '18px'
              }}>A</span>
            </div>
            <div>
              <h1 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'white',
                margin: 0,
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
              }}>
                ActiFi AI
              </h1>
              <p style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0,
                fontWeight: '500'
              }}>
                Portfolio Advisor
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  padding: '12px 20px',
                  borderRadius: '25px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  background: location.pathname === item.path 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'transparent',
                  border: location.pathname === item.path 
                    ? '1px solid rgba(255, 255, 255, 0.3)' 
                    : '1px solid transparent',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '120px'
                }}
                onMouseOver={(e) => {
                  if (location.pathname !== item.path) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (location.pathname !== item.path) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.border = '1px solid transparent';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                <span style={{
                  fontSize: '20px',
                  color: 'white',
                  marginBottom: '2px'
                }}>{item.label}</span>
                <span style={{
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: '500',
                  textAlign: 'center'
                }}>{item.description}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
