'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { format } from 'date-fns';
import { Send, Bot, User, MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';

// Custom styles for animations and scrollbar
const customStyles = `
  @keyframes etegie-bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
  }
  @keyframes etegie-slide-up {
    from { opacity: 0; transform: translateY(20px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes etegie-typing {
    0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
    40% { transform: scale(1); opacity: 1; }
  }
  .etegie-typing-indicator span {
    animation: etegie-typing 1.4s infinite ease-in-out;
  }
  .etegie-typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
  .etegie-typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
  .etegie-typing-indicator span:nth-child(3) { animation-delay: 0s; }
  .etegie-messages::-webkit-scrollbar { width: 6px; }
  .etegie-messages::-webkit-scrollbar-track { background: transparent; }
  .etegie-messages::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
  .etegie-messages::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
  .dark .etegie-messages::-webkit-scrollbar-thumb { background: #4b5563; }
  .dark .etegie-messages::-webkit-scrollbar-thumb:hover { background: #6b7280; }
`;

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotProps {
  apiUrl: string;
  botName?: string;
  welcomeMessage?: string;
  companyId?: string;
  showAvatars?: boolean;
  showTimestamps?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  primaryColor?: string;
  maxMessages?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function Chatbot({
  apiUrl,
  botName = 'Etegie Assistant',
  welcomeMessage = 'Hello! I\'m here to help you. How can I assist you today?',
  companyId,
  showAvatars = true,
  showTimestamps = true,
  theme = 'light',
  primaryColor = '#3b82f6',
  maxMessages = 100,
  className = '',
  style = {}
}: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(function() {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(function() {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Add welcome message on first load
  useEffect(function() {
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        content: welcomeMessage,
        sender: 'bot',
        timestamp: new Date()
      }]);
    }
  }, [welcomeMessage, messages.length]);

  // Handle theme
  useEffect(function() {
    const root = document.documentElement;
    if (theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  function sendMessage(content: string) {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(function(prev) {
      return [...prev, userMessage];
    });
    setInputValue('');
    setIsLoading(true);

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: content.trim(),
        companyId,
        sessionId: sessionStorage.getItem('etegie-session-id') || undefined
      }),
    })
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      return response.json();
    })
    .then(function(data) {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || 'Sorry, I don\'t have info on that.',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(function(prev) {
        return [...prev, botMessage];
      });

      // Store session ID if provided
      if (data.sessionId) {
        sessionStorage.setItem('etegie-session-id', data.sessionId);
      }
    })
    .catch(function(error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I\'m having trouble connecting right now. Please try again later.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(function(prev) {
        return [...prev, errorMessage];
      });
    })
    .finally(function() {
      setIsLoading(false);
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(inputValue);
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  }

  function toggleChat() {
    if (isMinimized) {
      setIsMinimized(false);
      setIsOpen(true);
    } else if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }

  // Limit messages to prevent memory issues
  const limitedMessages = messages.slice(-maxMessages);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <div
        className={`fixed bottom-5 right-5 z-50 font-sans ${className}`}
        style={{
          '--tw-primary-color': primaryColor,
          ...style
        } as React.CSSProperties}
      >
        {/* Floating Button */}
        {!isOpen && (
          <button
            className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white border-none cursor-pointer flex items-center justify-center shadow-2xl transition-all duration-200 hover:scale-105 hover:shadow-3xl"
            style={{ animation: 'etegie-bounce 2s infinite' }}
            onClick={toggleChat}
            aria-label="Open chat"
          >
            <MessageCircle size={24} />
          </button>
        )}

        {/* Chat Window */}
        {isOpen && (
          <div 
            className={`w-96 h-[500px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 ${isMinimized ? 'h-16' : ''}`}
            style={{ animation: 'etegie-slide-up 0.3s ease-out' }}
          >
            {/* Header */}
            <div className="bg-blue-500 text-white px-5 py-4 flex items-center justify-between min-h-16">
              <div className="flex items-center gap-3 flex-1">
                {showAvatars && (
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot size={20} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold leading-tight whitespace-nowrap overflow-hidden text-ellipsis m-0">
                    {botName}
                  </h3>
                  <span className="text-xs opacity-90 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block"></span>
                    Online
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="w-7 h-7 bg-white/10 hover:bg-white/20 border-none rounded-md text-white cursor-pointer flex items-center justify-center transition-all duration-200 hover:scale-105"
                  onClick={function() { setIsMinimized(!isMinimized); }}
                  aria-label={isMinimized ? 'Maximize' : 'Minimize'}
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button
                  className="w-7 h-7 bg-white/10 hover:bg-white/20 border-none rounded-md text-white cursor-pointer flex items-center justify-center transition-all duration-200 hover:scale-105"
                  onClick={function() { setIsOpen(false); }}
                  aria-label="Close chat"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <>
                <div 
                  className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 bg-white dark:bg-gray-800 etegie-messages"
                >
                  {limitedMessages.map(function(message) {
                    return (
                      <div
                        key={message.id}
                        className={`flex gap-3 max-w-full ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        {showAvatars && (
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                            message.sender === 'user' 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                          }`}>
                            {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className={`px-4 py-3 rounded-lg text-sm leading-relaxed break-words max-w-full ${
                            message.sender === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                          }`}>
                            {message.content}
                          </div>
                          {showTimestamps && (
                            <div className={`text-xs text-gray-500 mt-1 ${
                              message.sender === 'user' ? 'text-left' : 'text-right'
                            }`}>
                              {format(message.timestamp, 'HH:mm')}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {isLoading && (
                    <div className="flex gap-3 max-w-full flex-row">
                      {showAvatars && (
                        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300">
                          <Bot size={16} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex gap-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg w-fit etegie-typing-indicator">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex gap-3 items-center" onSubmit={handleSubmit}>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={function(e) { setInputValue(e.target.value); }}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed placeholder-gray-500 dark:placeholder-gray-400"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white border-none rounded-lg cursor-pointer flex items-center justify-center transition-all duration-200 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100"
                    disabled={!inputValue.trim() || isLoading}
                    aria-label="Send message"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
