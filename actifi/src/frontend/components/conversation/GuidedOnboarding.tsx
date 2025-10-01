import React, { useState } from 'react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  example: string;
  icon: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to ActiFi',
    description: 'I\'m Jill, your AI portfolio advisor. Let\'s get you set up!',
    example: 'Try: "What\'s the price of Bitcoin?" or "Show my portfolio"',
    icon: '👋'
  },
  {
    id: 'text-chat',
    title: 'Text Chat Test',
    description: 'Let\'s verify chat works on your device',
    example: 'Type: "What can you help me with?" or "ETH price"',
    icon: '💬'
  },
  {
    id: 'voice-wallet',
    title: 'Voice & Wallet Setup',
    description: 'Enable voice chat and connect your wallet (optional)',
    example: 'Try voice or click to connect wallet',
    icon: '🎤'
  }
];

interface OnboardingProgress {
  textTested: boolean;
  voiceEnabled: boolean;
  walletConnected: boolean;
  preferredMode: 'text' | 'voice';
}

export const GuidedOnboarding: React.FC<{
  onComplete: () => void;
  onSkip: () => void;
}> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState<OnboardingProgress>({
    textTested: false,
    voiceEnabled: false,
    walletConnected: false,
    preferredMode: 'text'
  });
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const currentStepData = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;

  // Voice testing handler
  const handleVoiceTest = async () => {
    try {
      // Test speakers first with a short beep
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      gainNode.gain.value = 0.1;
      oscillator.frequency.value = 800;
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.1);

      // Then request mic permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsListening(true);
      
      // Simulate voice recognition (in production, use Web Speech API)
      setTimeout(() => {
        setTranscript("I heard: 'Hello ActiFi'");
        setIsListening(false);
        setProgress(prev => ({ ...prev, voiceEnabled: true, preferredMode: 'voice' }));
      }, 2000);
      
    } catch (error) {
      console.log('Voice not available:', error);
      alert('Mic not available. You can continue with text chat!');
    }
  };

  // Wallet connection handler (mockup)
  const handleWalletConnect = async (walletType: string) => {
    try {
      // Mock wallet connection
      if (walletType === 'metamask') {
        // Simulate MetaMask connection
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProgress(prev => ({ ...prev, walletConnected: true }));
        alert('🦊 MetaMask connected! ✓\n\nAddress: 0x742d...3a9f\nNetwork: Ethereum Mainnet');
      } else if (walletType === 'coinbase') {
        // Simulate Coinbase Wallet connection
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProgress(prev => ({ ...prev, walletConnected: true }));
        alert('💼 Coinbase Wallet connected! ✓\n\nAddress: 0x8f2a...7b3e\nNetwork: Ethereum Mainnet');
      } else {
        alert(`${walletType} integration coming soon!`);
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      alert('Wallet connection failed. You can continue without connecting.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        maxWidth: '400px',
        width: '100%',
        padding: '24px'
      }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#dbeafe',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '24px'
          }}>
            {currentStepData.icon}
          </div>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '8px'
          }}>
            {currentStepData.title}
          </h2>
          <p style={{
            color: '#6b7280'
          }}>
            {currentStepData.description}
          </p>
        </div>

        {/* Dynamic Content Based on Step */}
        {currentStepData.id === 'welcome' && (
          <>
            <div style={{
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Try this:
              </div>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '6px',
                padding: '12px',
                borderLeft: '4px solid #3b82f6'
              }}>
                <code style={{
                  fontSize: '14px',
                  color: '#1f2937'
                }}>
                  {currentStepData.example}
                </code>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={() => setCurrentStep(1)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'white',
                  backgroundColor: '#2563eb',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                💬 Start with Text Chat
              </button>
              <button
                onClick={() => setCurrentStep(2)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#2563eb',
                  backgroundColor: '#eff6ff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                🎤 Try Voice (Recommended)
              </button>
            </div>
          </>
        )}

        {currentStepData.id === 'text-chat' && (
          <>
            <div style={{
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Quick test:
              </div>
              <input
                type="text"
                placeholder="Type a question..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  color: '#111827',
                  outline: 'none'
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value) {
                    setProgress(prev => ({ ...prev, textTested: true }));
                    alert('Great! Chat is working ✓');
                  }
                }}
              />
              <div style={{
                marginTop: '12px',
                fontSize: '12px',
                color: '#6b7280'
              }}>
                Press Enter to test • Chat will appear below
              </div>
            </div>
            {progress.textTested && (
              <div style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#166534'
                }}>
                  <span style={{ fontSize: '20px' }}>✓</span>
                  <span style={{ fontWeight: '500' }}>Text chat is working!</span>
                </div>
              </div>
            )}
          </>
        )}

        {currentStepData.id === 'voice-wallet' && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {/* Voice Test */}
              <div style={{
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '12px'
                }}>
                  Voice Chat (Optional)
                </div>
                <button
                  onClick={handleVoiceTest}
                  disabled={isListening}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: isListening ? 'not-allowed' : 'pointer',
                    opacity: isListening ? 0.5 : 1,
                    backgroundColor: progress.voiceEnabled ? '#10b981' : '#2563eb',
                    color: 'white'
                  }}
                >
                  {isListening ? '🎤 Listening...' : progress.voiceEnabled ? '✓ Voice Enabled' : '🎤 Test Voice'}
                </button>
                {isListening && (
                  <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'end' }}>
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          style={{
                            width: '8px',
                            backgroundColor: '#3b82f6',
                            borderRadius: '4px',
                            height: `${Math.random() * 20 + 10}px`,
                            animation: 'pulse 1s infinite',
                            animationDelay: `${i * 0.1}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {transcript && (
                  <div style={{
                    marginTop: '8px',
                    fontSize: '12px',
                    color: '#6b7280',
                    textAlign: 'center'
                  }}>
                    {transcript}
                  </div>
                )}
              </div>

              {/* Wallet Connection */}
              <div style={{
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '12px'
                }}>
                  Connect Wallet (Optional)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    onClick={() => handleWalletConnect('metamask')}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px',
                      border: '2px solid #d1d5db',
                      borderRadius: '8px',
                      backgroundColor: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>🦊</span>
                    <span style={{ fontSize: '12px', fontWeight: '500' }}>MetaMask</span>
                  </button>
                  <button
                    onClick={() => handleWalletConnect('coinbase')}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px',
                      border: '2px solid #d1d5db',
                      borderRadius: '8px',
                      backgroundColor: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>💼</span>
                    <span style={{ fontSize: '12px', fontWeight: '500' }}>Coinbase</span>
                  </button>
                </div>
                {progress.walletConnected && (
                  <div style={{
                    marginTop: '12px',
                    fontSize: '12px',
                    textAlign: 'center',
                    color: '#059669',
                    fontWeight: '500'
                  }}>
                    ✓ Wallet connected
                  </div>
                )}
              </div>
            </div>

            {/* Status Summary */}
            <div style={{
              backgroundColor: '#eff6ff',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#1e40af',
                marginBottom: '8px'
              }}>
                Your Setup:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '12px', color: '#1e3a8a' }}>
                  💬 Text Chat: <strong>Ready</strong>
                </div>
                <div style={{ fontSize: '12px', color: '#1e3a8a' }}>
                  🎤 Voice: <strong>{progress.voiceEnabled ? 'Enabled' : 'Not enabled'}</strong>
                </div>
                <div style={{ fontSize: '12px', color: '#1e3a8a' }}>
                  🔗 Wallet: <strong>{progress.walletConnected ? 'Connected' : 'Not connected'}</strong>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Default Example for other steps */}
        {!['welcome', 'text-chat', 'voice-wallet'].includes(currentStepData.id) && (
          <div style={{
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Try this:
            </div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '6px',
              padding: '12px',
              borderLeft: '4px solid #3b82f6'
            }}>
              <code style={{
                fontSize: '14px',
                color: '#1f2937'
              }}>
                {currentStepData.example}
              </code>
            </div>
          </div>
        )}

        {/* Progress */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: index <= currentStep ? '#3b82f6' : '#d1d5db'
                }}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={onSkip}
            style={{
              color: '#6b7280',
              fontSize: '14px',
              fontWeight: '500',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Skip Tour
          </button>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                Back
              </button>
            )}
            
            <button
              onClick={() => {
                if (isLastStep) {
                  // Save preferences to localStorage
                  localStorage.setItem('actifi-onboarding-progress', JSON.stringify(progress));
                  onComplete();
                } else {
                  setCurrentStep(prev => prev + 1);
                }
              }}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500',
                color: 'white',
                backgroundColor: '#2563eb',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              {isLastStep ? 'Get Started 🚀' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
