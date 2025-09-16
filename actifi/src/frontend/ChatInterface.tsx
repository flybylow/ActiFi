import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m ActiFi AI, your portfolio advisor. How can I help you today?',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize Socket.IO connection
  useEffect(() => {
    const newSocket = io('http://localhost:3001', {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Connected to ElizaOS server');
      setIsConnected(true);
      
      // Log all available events for debugging
      console.log('Socket connected, listening for events...');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from ElizaOS server');
      setIsConnected(false);
    });

    // Listen for different possible event names
    newSocket.on('message', (data: any) => {
      console.log('Received message:', data);
      clearTimeout((newSocket as any).currentTimeout);
      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: data.content || data.message || 'I received your message.',
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    });

    newSocket.on('response', (data: any) => {
      console.log('Received response:', data);
      clearTimeout((newSocket as any).currentTimeout);
      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: data.content || data.message || data.response || 'I received your message.',
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    });

    newSocket.on('chat', (data: any) => {
      console.log('Received chat:', data);
      clearTimeout((newSocket as any).currentTimeout);
      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: data.content || data.message || data.response || 'I received your message.',
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    });

    newSocket.on('error', (error: any) => {
      console.error('Socket error:', error);
      setIsLoading(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const sendMessage = () => {
    if (!inputValue.trim() || isLoading || !socket || !isConnected) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
      
      // Provide a mock response based on the user's question
      let response = 'I\'m ActiFi AI, your portfolio advisor. ';
      
      if (inputValue.toLowerCase().includes('balance') || inputValue.toLowerCase().includes('total')) {
        response += 'Your total portfolio balance is $26,673.23. This includes Bitcoin (64.8%), Ethereum (30.5%), and USD Coin (4.7%).';
      } else if (inputValue.toLowerCase().includes('bitcoin') || inputValue.toLowerCase().includes('btc')) {
        response += 'You have 0.15 BTC worth $17,281.50 (64.8% of your portfolio). Bitcoin is currently trading at $115,048.00 with a 24h change of +0.15%.';
      } else if (inputValue.toLowerCase().includes('ethereum') || inputValue.toLowerCase().includes('eth')) {
        response += 'You have 1.8 ETH worth $8,141.98 (30.5% of your portfolio). Ethereum is currently trading at $4,510.90 with a 24h change of -1.55%.';
      } else if (inputValue.toLowerCase().includes('usdc') || inputValue.toLowerCase().includes('stablecoin')) {
        response += 'You have 1,250 USDC worth $1,249.75 (4.7% of your portfolio). USD Coin is a stablecoin pegged to the US dollar.';
      } else if (inputValue.toLowerCase().includes('portfolio') || inputValue.toLowerCase().includes('breakdown')) {
        response += 'Here\'s your portfolio breakdown:\n\n• Bitcoin (BTC): 0.15 tokens = $17,281.50 (64.8%) 📈\n• Ethereum (ETH): 1.8 tokens = $8,141.98 (30.5%) 📉\n• USD Coin (USDC): 1,250 tokens = $1,249.75 (4.7%) ➖\n\nTotal Value: $26,673.23\nRisk Level: Well Diversified';
      } else if (inputValue.toLowerCase().includes('risk')) {
        response += 'Your portfolio has a "Well Diversified" risk level. Risk distribution: Medium risk (95.3%), Low risk (4.7%). This is a balanced approach with both growth and stability.';
      } else {
        response += 'I can help you with portfolio analysis, asset information, risk assessment, and investment advice. Try asking about your balance, specific assets, or portfolio breakdown.';
      }
      
      const timeoutMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, timeoutMessage]);
    }, 3000); // 3 second timeout for mock response

    // Store timeout ID to clear it if we get a response
    (socket as any).currentTimeout = timeoutId;

    // Send message via Socket.IO - try different event names
    console.log('Sending message:', inputValue);
    socket.emit('message', {
      content: inputValue,
      agentId: 'actifi-portfolio-agent',
      userId: 'user-' + Date.now()
    });
    
    // Also try alternative event names
    socket.emit('chat', {
      message: inputValue,
      agentId: 'actifi-portfolio-agent',
      userId: 'user-' + Date.now()
    });
    
    socket.emit('send_message', {
      content: inputValue,
      agentId: 'actifi-portfolio-agent',
      userId: 'user-' + Date.now()
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ 
      height: '500px', 
      backgroundColor: '#374151', 
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Connection Status */}
      <div style={{
        padding: '10px 20px',
        backgroundColor: isConnected ? '#10b981' : '#ef4444',
        color: 'white',
        fontSize: '12px',
        textAlign: 'center',
        fontWeight: 'bold'
      }}>
        {isConnected ? '🟢 Connected to ActiFi AI' : '🔴 Connecting to ActiFi AI...'}
      </div>

      {/* Messages Container */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
              alignItems: 'flex-start',
              gap: '10px'
            }}
          >
            <div
              style={{
                maxWidth: '80%',
                padding: '12px 16px',
                borderRadius: '18px',
                backgroundColor: message.role === 'user' ? '#3b82f6' : '#1f2937',
                color: 'white',
                fontSize: '14px',
                lineHeight: '1.4',
                wordWrap: 'break-word',
                position: 'relative'
              }}
            >
              {message.content}
              <div style={{
                fontSize: '11px',
                opacity: 0.7,
                marginTop: '4px',
                textAlign: message.role === 'user' ? 'right' : 'left'
              }}>
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: '10px'
          }}>
            <div style={{
              padding: '12px 16px',
              borderRadius: '18px',
              backgroundColor: '#1f2937',
              color: 'white',
              fontSize: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  border: '2px solid #9ca3af',
                  borderTop: '2px solid #3b82f6',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                ActiFi AI is thinking...
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Container */}
      <div style={{
        padding: '20px',
        borderTop: '1px solid #4b5563',
        backgroundColor: '#374151'
      }}>
        <div style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-end'
        }}>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your portfolio, get investment advice, or request analysis..."
            disabled={isLoading}
            style={{
              flex: 1,
              minHeight: '40px',
              maxHeight: '120px',
              padding: '10px 12px',
              borderRadius: '20px',
              border: '1px solid #6b7280',
              backgroundColor: '#1f2937',
              color: 'white',
              fontSize: '14px',
              resize: 'none',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading || !isConnected}
            style={{
              padding: '10px 16px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: inputValue.trim() && !isLoading && isConnected ? '#3b82f6' : '#6b7280',
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: inputValue.trim() && !isLoading && isConnected ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.2s'
            }}
          >
            {!isConnected ? 'Connecting...' : 'Send'}
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default ChatInterface;