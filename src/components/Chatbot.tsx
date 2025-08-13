import React, { useState, useEffect, useRef, useCallback } from 'react';
import { format } from 'date-fns';
import { Send, Minimize2, Maximize2, X, Bot, User, MessageCircle } from 'lucide-react';
import type { Message, ChatbotConfig } from '../types';

// Custom styles for animations and scrollbar
const customStyles = `
  @keyframes etegie-slide-up {
    from { opacity: 0; transform: translateY(20px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes etegie-bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
  }
  .etegie-messages::-webkit-scrollbar { width: 6px; }
  .etegie-messages::-webkit-scrollbar-track { background: transparent; }
  .etegie-messages::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
  .etegie-messages::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
  .dark .etegie-messages::-webkit-scrollbar-thumb { background: #4b5563; }
  .dark .etegie-messages::-webkit-scrollbar-thumb:hover { background: #6b7280; }
`;

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
}: ChatbotConfig) {
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
        className={`fixed bottom-6 right-6 z-50 font-sans ${className}`}
        style={{
          '--tw-primary-color': primaryColor,
          ...style
        } as React.CSSProperties}
      >
        {/* Floating Button */}
        {!isOpen && (
          <button
            className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-none cursor-pointer flex items-center justify-center shadow-2xl transition-all duration-200 hover:scale-110 hover:shadow-3xl"
            style={{ animation: 'etegie-bounce 2s infinite' }}
            onClick={toggleChat}
            aria-label="Open chat"
          >
            <MessageCircle size={28} />
          </button>
        )}

        {/* Chat Window - Modern Vertical Conversation UI */}
        {isOpen && (
          <div 
            className={`w-[380px] h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 ${isMinimized ? 'h-20' : ''}`}
            style={{ animation: 'etegie-slide-up 0.3s ease-out' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {showAvatars && (
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot size={20} />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold leading-tight">{botName}</h3>
                  <span className="text-sm opacity-90 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Online
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 border-none rounded-lg text-white cursor-pointer flex items-center justify-center transition-all duration-200 hover:scale-105"
                  onClick={function() { setIsMinimized(!isMinimized); }}
                  aria-label={isMinimized ? 'Maximize' : 'Minimize'}
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 border-none rounded-lg text-white cursor-pointer flex items-center justify-center transition-all duration-200 hover:scale-105"
                  onClick={function() { setIsOpen(false); }}
                  aria-label="Close chat"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages - Vertical Conversation Layout */}
            {!isMinimized && (
              <>
                <div 
                  className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-gray-50 dark:bg-gray-900 etegie-messages"
                >
                  {limitedMessages.map(function(message) {
                    const isUser = message.sender === 'user';
                    return (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        {/* Bot Avatar (left side) */}
                        {!isUser && showAvatars && (
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <Bot size={16} className="text-white" />
                          </div>
                        )}
                        
                        {/* Message Bubble */}
                        <div className={`max-w-[280px] ${isUser ? 'order-2' : 'order-1'}`}>
                          <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed break-words ${
                            isUser
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md'
                              : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-bl-md shadow-sm'
                          }`}>
                            {message.content}
                          </div>
                          {showTimestamps && (
                            <div className={`text-xs text-gray-500 mt-2 font-medium ${
                              isUser ? 'text-right' : 'text-left'
                            }`}>
                              {format(message.timestamp, 'HH:mm')}
                            </div>
                          )}
                        </div>

                        {/* User Avatar (right side) */}
                        {isUser && showAvatars && (
                          <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <User size={16} className="text-white" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {/* Typing Indicator */}
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      {showAvatars && (
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <Bot size={16} className="text-white" />
                        </div>
                      )}
                      <div className="px-4 py-3 bg-white dark:bg-gray-800 rounded-2xl rounded-bl-md border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input - Sticky Bottom */}
                <form className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex gap-3 items-center" onSubmit={handleSubmit}>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={function(e) { setInputValue(e.target.value); }}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed placeholder-gray-500 dark:placeholder-gray-400"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-none rounded-xl cursor-pointer flex items-center justify-center transition-all duration-200 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100 shadow-lg"
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
