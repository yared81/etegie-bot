import React, { useState, useEffect, useRef, useCallback } from "react";
import { format } from "date-fns";
import {
  Send,
  Minimize2,
  Maximize2,
  X,
  Bot,
  User,
  MessageCircle,
} from "lucide-react";
import type { Message, ChatbotConfig } from "../types";
import { LocalBot } from "../utils/localBot";

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
  
  /* Scrollbar styling */
  .etegie-messages::-webkit-scrollbar { width: 6px; }
  .etegie-messages::-webkit-scrollbar-track { background: transparent; }
  .etegie-messages::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
  .etegie-messages::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
  .dark .etegie-messages::-webkit-scrollbar-thumb { background: #4b5563; }
  .dark .etegie-messages::-webkit-scrollbar-thumb:hover { background: #6b7280; }
  
  /* Standard chatbot message layout */
  .etegie-messages {
    display: flex !important;
    flex-direction: column !important;
    gap: 16px !important;
    padding: 16px !important;
    height: 100% !important;
  }
  
  /* Individual message container */
  .etegie-message {
    display: flex !important;
    flex-direction: row !important;
    align-items: flex-start !important;
    gap: 12px !important;
    width: 100% !important;
  }
  
  /* User message - right aligned */
  .etegie-message.user {
    flex-direction: row-reverse !important;
    justify-content: flex-end !important;
  }
  
  /* Bot message - left aligned */
  .etegie-message.bot {
    justify-content: flex-start !important;
  }
  
  /* Message bubble */
  .etegie-bubble {
    max-width: 320px !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
  }
  
  /* User bubble styling */
  .etegie-bubble.user {
    background: linear-gradient(135deg, #3b82f6, #8b5cf6) !important;
    color: white !important;
    border-radius: 18px 18px 4px 18px !important;
    padding: 12px 16px !important;
    font-size: 14px !important;
    line-height: 1.5 !important;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3) !important;
  }
  
  /* Bot bubble styling */
  .etegie-bubble.bot {
    background: white !important;
    color: #1f2937 !important;
    border: 1px solid #e5e7eb !important;
    border-radius: 18px 18px 18px 4px !important;
    padding: 12px 16px !important;
    font-size: 14px !important;
    line-height: 1.5 !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
  }
  
  /* Dark mode bot bubble */
  .dark .etegie-bubble.bot {
    background: #374151 !important;
    color: #f9fafb !important;
    border-color: #4b5563 !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
  }
  
  /* Avatar styling */
  .etegie-avatar {
    width: 32px !important;
    height: 32px !important;
    border-radius: 50% !important;
    flex-shrink: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  
  .etegie-avatar.bot {
    background: linear-gradient(135deg, #3b82f6, #8b5cf6) !important;
  }
  
  .etegie-avatar.user {
    background: linear-gradient(135deg, #6b7280, #9ca3af) !important;
  }
  
  /* Timestamp styling */
  .etegie-timestamp {
    font-size: 11px !important;
    color: #9ca3af !important;
    margin-top: 4px !important;
    font-weight: 500 !important;
  }
  
  .etegie-timestamp.user {
    text-align: right !important;
  }
  
  .etegie-timestamp.bot {
    text-align: left !important;
  }
  
  /* Typing indicator */
  .etegie-typing {
    display: flex !important;
    align-items: center !important;
    gap: 12px !important;
    padding: 12px 16px !important;
  }
  
  .etegie-typing-dots {
    display: flex !important;
    gap: 4px !important;
  }
  
  .etegie-typing-dot {
    width: 8px !important;
    height: 8px !important;
    border-radius: 50% !important;
    background: #9ca3af !important;
    animation: etegie-bounce 1.4s infinite ease-in-out !important;
  }
  
  .etegie-typing-dot:nth-child(1) { animation-delay: -0.32s !important; }
  .etegie-typing-dot:nth-child(2) { animation-delay: -0.16s !important; }
  
  /* Ensure proper positioning */
  .etegie-chat-container {
    position: fixed !important;
    bottom: 24px !important;
    right: 24px !important;
    z-index: 50 !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-end !important;
  }
  
  /* Mobile responsive adjustments */
  @media (max-width: 768px) {
    .etegie-chat-container {
      bottom: 16px !important;
      right: 16px !important;
    }
    
    .etegie-chat-container .w-[400px] {
      width: calc(100vw - 32px) !important;
      max-width: 400px !important;
    }
    
    .etegie-chat-container .h-[600px] {
      height: calc(100vh - 120px) !important;
      max-height: 600px !important;
    }
  }
  
  /* Ensure chat window appears above button */
  .etegie-chat-container > div:first-child {
    order: 1 !important;
  }
  
  .etegie-chat-container > button:last-child {
    order: 2 !important;
  }
`;

export function Chatbot({
  apiUrl,
  botName = "Etegie Assistant",
  welcomeMessage = "Hello! I'm here to help you. How can I assist you today?",
  companyId,
  showAvatars = true,
  showTimestamps = true,
  theme = "light",
  primaryColor = "#3b82f6",
  maxMessages = 100,
  className = "",
  style = {},
}: ChatbotConfig) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(function () {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(
    function () {
      scrollToBottom();
    },
    [messages, scrollToBottom],
  );

  // Add welcome message on first load
  useEffect(
    function () {
      if (messages.length === 0) {
        setMessages([
          {
            id: "welcome",
            content: welcomeMessage,
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
      }
    },
    [welcomeMessage, messages.length],
  );

  // Handle theme
  useEffect(
    function () {
      const root = document.documentElement;
      if (
        theme === "dark" ||
        (theme === "auto" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    },
    [theme],
  );

  function sendMessage(content: string) {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(function (prev) {
      return [...prev, userMessage];
    });
    setInputValue("");
    setIsLoading(true);

    // Use local logic if no API URL is provided
    if (!apiUrl) {
      LocalBot.processMessage(content.trim())
        .then(function (data) {
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: data.response,
            sender: "bot",
            timestamp: new Date(),
          };

          setMessages(function (prev) {
            return [...prev, botMessage];
          });
        })
        .catch(function (error) {
          console.error("Local bot error:", error);
        })
        .finally(function () {
          setIsLoading(false);
        });
      return;
    }

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: content.trim(),
        companyId,
        sessionId:
          typeof window !== "undefined"
            ? sessionStorage.getItem("etegie-session-id") || undefined
            : undefined,
      }),
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to send message");
        }
        return response.json();
      })
      .then(function (data) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response || "Sorry, I don't have info on that.",
          sender: "bot",
          timestamp: new Date(),
        };

        setMessages(function (prev) {
          return [...prev, botMessage];
        });

        // Store session ID if provided
        if (data.sessionId && typeof window !== "undefined") {
          sessionStorage.setItem("etegie-session-id", data.sessionId);
        }
      })
      .catch(function (error) {
        // Robust Fallback: Try local logic if API fails
        console.warn("API connection failed, falling back to local logic");
        LocalBot.processMessage(content.trim()).then(function (data) {
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: data.response,
            sender: "bot",
            timestamp: new Date(),
          };
          setMessages(function (prev) {
            return [...prev, botMessage];
          });
        });
      })
      .finally(function () {
        setIsLoading(false);
      });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(inputValue);
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
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
        className={`etegie-chat-container font-sans ${className}`}
        style={
          {
            "--tw-primary-color": primaryColor,
            ...style,
          } as React.CSSProperties
        }
      >
        {/* Chat Window - Standard Website Chatbot Design */}
        {isOpen && (
          <div
            className={`w-[400px] h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 mb-4 ${isMinimized ? "h-20" : ""}`}
            style={{ animation: "etegie-slide-up 0.3s ease-out" }}
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
                  <h3 className="text-lg font-semibold leading-tight">
                    {botName}
                  </h3>
                  <span className="text-sm opacity-90 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Online
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 border-none rounded-lg text-white cursor-pointer flex items-center justify-center transition-all duration-200 hover:scale-105"
                  onClick={function () {
                    setIsMinimized(!isMinimized);
                  }}
                  aria-label={isMinimized ? "Maximize" : "Minimize"}
                >
                  {isMinimized ? (
                    <Maximize2 size={16} />
                  ) : (
                    <Minimize2 size={16} />
                  )}
                </button>
                <button
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 border-none rounded-lg text-white cursor-pointer flex items-center justify-center transition-all duration-200 hover:scale-105"
                  onClick={function () {
                    setIsOpen(false);
                  }}
                  aria-label="Close chat"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages - Standard Chatbot Layout */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 etegie-messages">
                  {limitedMessages.map(function (message) {
                    const isUser = message.sender === "user";
                    return (
                      <div
                        key={message.id}
                        className={`etegie-message ${isUser ? "user" : "bot"}`}
                      >
                        {/* Avatar */}
                        {showAvatars && (
                          <div
                            className={`etegie-avatar ${isUser ? "user" : "bot"}`}
                          >
                            {isUser ? <User size={16} /> : <Bot size={16} />}
                          </div>
                        )}

                        {/* Message Content */}
                        <div className="etegie-bubble-container">
                          <div
                            className={`etegie-bubble ${isUser ? "user" : "bot"}`}
                          >
                            {message.content}
                          </div>
                          {showTimestamps && (
                            <div
                              className={`etegie-timestamp ${isUser ? "user" : "bot"}`}
                            >
                              {format(message.timestamp, "HH:mm")}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing Indicator */}
                  {isLoading && (
                    <div className="etegie-typing">
                      {showAvatars && (
                        <div className="etegie-avatar bot">
                          <Bot size={16} />
                        </div>
                      )}
                      <div className="etegie-bubble bot">
                        <div className="etegie-typing-dots">
                          <span className="etegie-typing-dot"></span>
                          <span className="etegie-typing-dot"></span>
                          <span className="etegie-typing-dot"></span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input - Sticky Bottom */}
                <form
                  className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex gap-3 items-center"
                  onSubmit={handleSubmit}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={function (e) {
                      setInputValue(e.target.value);
                    }}
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

        {/* Floating Button */}
        {!isOpen && (
          <button
            className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-none cursor-pointer flex items-center justify-center shadow-2xl transition-all duration-200 hover:scale-110 hover:shadow-3xl"
            style={{ animation: "etegie-bounce 2s infinite" }}
            onClick={toggleChat}
            aria-label="Open chat"
          >
            <MessageCircle size={28} />
          </button>
        )}
      </div>
    </>
  );
}
