import React, { useState, useEffect, useRef, useCallback } from "react";
import { format } from "date-fns";
import {
  Send as SendIcon,
  Minimize2 as Minimize2Icon,
  Maximize2 as Maximize2Icon,
  X as XIcon,
  Bot as BotIcon,
  User as UserIcon,
  MessageCircle as MessageCircleIcon,
} from "lucide-react";

const Send = SendIcon as any;
const Minimize2 = Minimize2Icon as any;
const Maximize2 = Maximize2Icon as any;
const X = XIcon as any;
const Bot = BotIcon as any;
const User = UserIcon as any;
const MessageCircle = MessageCircleIcon as any;

import type { Message, ChatbotConfig } from "../types";
import { LocalBot } from "../utils/localBot";

// All widget styles are self-contained here — no Tailwind dependency required.
const customStyles = `
  /* ── Keyframe Animations ── */
  @keyframes etegie-slide-up {
    from { opacity: 0; transform: translateY(20px) scale(0.95); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }
  @keyframes etegie-bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px);  }
  }
  @keyframes etegie-pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.5; }
  }

  /* ── Root Container ── */
  .etegie-chat-container {
    position: fixed !important;
    bottom: 24px !important;
    right: 24px !important;
    z-index: 9999 !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-end !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif !important;
  }
  @media (max-width: 768px) {
    .etegie-chat-container {
      bottom: 16px !important;
      right: 16px !important;
    }
  }

  /* ── Chat Window ── */
  .etegie-window {
    width: 400px !important;
    height: 600px !important;
    background: #ffffff !important;
    border-radius: 16px !important;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15), 0 10px 20px rgba(0, 0, 0, 0.1) !important;
    display: flex !important;
    flex-direction: column !important;
    overflow: hidden !important;
    border: 1px solid #e5e7eb !important;
    margin-bottom: 16px !important;
    animation: etegie-slide-up 0.3s ease-out !important;
  }
  .etegie-window.minimized {
    height: 72px !important;
  }
  @media (max-width: 768px) {
    .etegie-window {
      width: calc(100vw - 32px) !important;
      max-width: 400px !important;
      height: calc(100vh - 120px) !important;
      max-height: 600px !important;
    }
  }

  /* ── Header ── */
  .etegie-header {
    background: linear-gradient(135deg, #3b82f6, #8b5cf6) !important;
    color: #ffffff !important;
    padding: 16px 20px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    flex-shrink: 0 !important;
  }
  .etegie-header-info {
    display: flex !important;
    align-items: center !important;
    gap: 12px !important;
  }
  .etegie-header-avatar {
    width: 40px !important;
    height: 40px !important;
    background: rgba(255,255,255,0.2) !important;
    border-radius: 50% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex-shrink: 0 !important;
  }
  .etegie-header-title {
    margin: 0 !important;
    font-size: 16px !important;
    font-weight: 600 !important;
    line-height: 1.3 !important;
    color: #ffffff !important;
  }
  .etegie-header-status {
    display: flex !important;
    align-items: center !important;
    gap: 6px !important;
    font-size: 13px !important;
    opacity: 0.9 !important;
    margin-top: 2px !important;
  }
  .etegie-status-dot {
    width: 8px !important;
    height: 8px !important;
    background: #4ade80 !important;
    border-radius: 50% !important;
    animation: etegie-pulse 2s infinite !important;
    flex-shrink: 0 !important;
  }
  .etegie-header-actions {
    display: flex !important;
    gap: 8px !important;
  }
  .etegie-header-btn {
    width: 32px !important;
    height: 32px !important;
    background: rgba(255,255,255,0.15) !important;
    border: none !important;
    border-radius: 8px !important;
    color: #ffffff !important;
    cursor: pointer !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: background 0.2s, transform 0.2s !important;
    padding: 0 !important;
  }
  .etegie-header-btn:hover {
    background: rgba(255,255,255,0.25) !important;
    transform: scale(1.05) !important;
  }

  /* ── Messages Area ── */
  .etegie-messages {
    flex: 1 !important;
    overflow-y: auto !important;
    background: #f9fafb !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 16px !important;
    padding: 16px !important;
  }
  .etegie-messages::-webkit-scrollbar { width: 6px; }
  .etegie-messages::-webkit-scrollbar-track { background: transparent; }
  .etegie-messages::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
  .etegie-messages::-webkit-scrollbar-thumb:hover { background: #9ca3af; }

  /* ── Message Row ── */
  .etegie-message {
    display: flex !important;
    flex-direction: row !important;
    align-items: flex-start !important;
    gap: 10px !important;
    width: 100% !important;
  }
  .etegie-message.user {
    flex-direction: row-reverse !important;
  }

  /* ── Avatars ── */
  .etegie-avatar {
    width: 32px !important;
    height: 32px !important;
    border-radius: 50% !important;
    flex-shrink: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    color: #ffffff !important;
  }
  .etegie-avatar.bot  { background: linear-gradient(135deg, #3b82f6, #8b5cf6) !important; }
  .etegie-avatar.user { background: linear-gradient(135deg, #6b7280, #9ca3af) !important; }

  /* ── Bubble Container ── */
  .etegie-bubble-container {
    display: flex !important;
    flex-direction: column !important;
    max-width: 280px !important;
  }
  .etegie-message.user .etegie-bubble-container {
    align-items: flex-end !important;
  }

  /* ── Bubbles ── */
  .etegie-bubble {
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
    font-size: 14px !important;
    line-height: 1.55 !important;
    padding: 10px 14px !important;
  }
  .etegie-bubble.user {
    background: linear-gradient(135deg, #3b82f6, #8b5cf6) !important;
    color: #ffffff !important;
    border-radius: 18px 18px 4px 18px !important;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3) !important;
  }
  .etegie-bubble.bot {
    background: #ffffff !important;
    color: #1f2937 !important;
    border: 1px solid #e5e7eb !important;
    border-radius: 18px 18px 18px 4px !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
  }

  /* ── Timestamps ── */
  .etegie-timestamp {
    font-size: 11px !important;
    color: #9ca3af !important;
    margin-top: 4px !important;
    font-weight: 500 !important;
  }
  .etegie-timestamp.user { text-align: right  !important; }
  .etegie-timestamp.bot  { text-align: left   !important; }

  /* ── Typing Indicator ── */
  .etegie-typing {
    display: flex !important;
    align-items: center !important;
    gap: 10px !important;
  }
  .etegie-typing-dots {
    display: flex !important;
    gap: 4px !important;
    padding: 10px 14px !important;
    background: #ffffff !important;
    border: 1px solid #e5e7eb !important;
    border-radius: 18px 18px 18px 4px !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
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

  /* ── Input Form ── */
  .etegie-input-form {
    padding: 14px 16px !important;
    background: #ffffff !important;
    border-top: 1px solid #e5e7eb !important;
    display: flex !important;
    gap: 10px !important;
    align-items: center !important;
    flex-shrink: 0 !important;
  }
  .etegie-input {
    flex: 1 !important;
    padding: 10px 16px !important;
    border: 1.5px solid #d1d5db !important;
    border-radius: 12px !important;
    font-size: 14px !important;
    background: #f9fafb !important;
    color: #111827 !important;
    outline: none !important;
    transition: border-color 0.2s, box-shadow 0.2s !important;
    font-family: inherit !important;
    min-width: 0 !important;
  }
  .etegie-input::placeholder { color: #9ca3af !important; }
  .etegie-input:focus {
    border-color: #3b82f6 !important;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15) !important;
    background: #ffffff !important;
  }
  .etegie-input:disabled { opacity: 0.6 !important; cursor: not-allowed !important; }

  .etegie-send-btn {
    width: 40px !important;
    height: 40px !important;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6) !important;
    border: none !important;
    border-radius: 12px !important;
    color: #ffffff !important;
    cursor: pointer !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s !important;
    flex-shrink: 0 !important;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4) !important;
    padding: 0 !important;
  }
  .etegie-send-btn:hover:not(:disabled) {
    transform: scale(1.08) !important;
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.5) !important;
  }
  .etegie-send-btn:disabled {
    opacity: 0.5 !important;
    cursor: not-allowed !important;
  }

  /* ── Floating Action Button ── */
  .etegie-fab {
    width: 60px !important;
    height: 60px !important;
    border-radius: 50% !important;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6) !important;
    border: none !important;
    color: #ffffff !important;
    cursor: pointer !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.45) !important;
    transition: transform 0.2s, box-shadow 0.2s !important;
    animation: etegie-bounce 2.5s infinite !important;
    padding: 0 !important;
  }
  .etegie-fab:hover {
    transform: scale(1.12) !important;
    box-shadow: 0 12px 32px rgba(59, 130, 246, 0.55) !important;
    animation: none !important;
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

  const scrollToBottom = useCallback(function () {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(function () { scrollToBottom(); }, [messages, scrollToBottom]);

  // Add welcome message on first load
  useEffect(function () {
    if (messages.length === 0) {
      setMessages([{
        id: "welcome",
        content: welcomeMessage,
        sender: "bot",
        timestamp: new Date(),
      }]);
    }
  }, [welcomeMessage, messages.length]);

  // Handle theme
  useEffect(function () {
    const root = document.documentElement;
    if (
      theme === "dark" ||
      (theme === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  function sendMessage(content: string) {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(function (prev) { return [...prev, userMessage]; });
    setInputValue("");
    setIsLoading(true);

    if (!apiUrl) {
      LocalBot.processMessage(content.trim())
        .then(function (data) {
          setMessages(function (prev) {
            return [...prev, {
              id: (Date.now() + 1).toString(),
              content: data.response,
              sender: "bot",
              timestamp: new Date(),
            }];
          });
        })
        .catch(function (error) { console.error("Local bot error:", error); })
        .finally(function () { setIsLoading(false); });
      return;
    }

    fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
        if (!response.ok) throw new Error("Failed to send message");
        return response.json();
      })
      .then(function (data) {
        setMessages(function (prev) {
          return [...prev, {
            id: (Date.now() + 1).toString(),
            content: data.response || "Sorry, I don't have info on that.",
            sender: "bot",
            timestamp: new Date(),
          }];
        });
        if (data.sessionId && typeof window !== "undefined") {
          sessionStorage.setItem("etegie-session-id", data.sessionId);
        }
      })
      .catch(function () {
        console.warn("API connection failed, falling back to local logic");
        LocalBot.processMessage(content.trim()).then(function (data) {
          setMessages(function (prev) {
            return [...prev, {
              id: (Date.now() + 1).toString(),
              content: data.response,
              sender: "bot",
              timestamp: new Date(),
            }];
          });
        });
      })
      .finally(function () { setIsLoading(false); });
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

  const limitedMessages = messages.slice(-maxMessages);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <div
        className={`etegie-chat-container ${className}`}
        style={{ "--etegie-primary": primaryColor, ...style } as React.CSSProperties}
      >
        {/* Chat Window */}
        {isOpen && (
          <div className={`etegie-window${isMinimized ? " minimized" : ""}`}>
            {/* Header */}
            <div className="etegie-header">
              <div className="etegie-header-info">
                {showAvatars && (
                  <div className="etegie-header-avatar">
                    <Bot size={20} />
                  </div>
                )}
                <div>
                  <h3 className="etegie-header-title">{botName}</h3>
                  <div className="etegie-header-status">
                    <span className="etegie-status-dot" />
                    Online
                  </div>
                </div>
              </div>
              <div className="etegie-header-actions">
                <button
                  className="etegie-header-btn"
                  onClick={function () { setIsMinimized(!isMinimized); }}
                  aria-label={isMinimized ? "Maximize" : "Minimize"}
                >
                  {isMinimized ? <Maximize2 size={15} /> : <Minimize2 size={15} />}
                </button>
                <button
                  className="etegie-header-btn"
                  onClick={function () { setIsOpen(false); }}
                  aria-label="Close chat"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <>
                <div className="etegie-messages">
                  {limitedMessages.map(function (message) {
                    const isUser = message.sender === "user";
                    return (
                      <div
                        key={message.id}
                        className={`etegie-message ${isUser ? "user" : "bot"}`}
                      >
                        {showAvatars && (
                          <div className={`etegie-avatar ${isUser ? "user" : "bot"}`}>
                            {isUser ? <User size={15} /> : <Bot size={15} />}
                          </div>
                        )}
                        <div className="etegie-bubble-container">
                          <div className={`etegie-bubble ${isUser ? "user" : "bot"}`}>
                            {message.content}
                          </div>
                          {showTimestamps && (
                            <div className={`etegie-timestamp ${isUser ? "user" : "bot"}`}>
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
                          <Bot size={15} />
                        </div>
                      )}
                      <div className="etegie-typing-dots">
                        <span className="etegie-typing-dot" />
                        <span className="etegie-typing-dot" />
                        <span className="etegie-typing-dot" />
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form className="etegie-input-form" onSubmit={handleSubmit}>
                  <input
                    ref={inputRef}
                    type="text"
                    className="etegie-input"
                    value={inputValue}
                    onChange={function (e) { setInputValue(e.target.value); }}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message…"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    className="etegie-send-btn"
                    disabled={!inputValue.trim() || isLoading}
                    aria-label="Send message"
                  >
                    <Send size={17} />
                  </button>
                </form>
              </>
            )}
          </div>
        )}

        {/* Floating Action Button */}
        {!isOpen && (
          <button
            className="etegie-fab"
            onClick={toggleChat}
            aria-label="Open chat"
          >
            <MessageCircle size={26} />
          </button>
        )}
      </div>
    </>
  );
}
