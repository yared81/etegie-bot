import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef, useCallback } from "react";
import { format } from "date-fns";
import { Send, Minimize2, Maximize2, X, Bot, User, MessageCircle, } from "lucide-react";
import { LocalBot } from "../utils/localBot";
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
export function Chatbot({ apiUrl, botName = "Etegie Assistant", welcomeMessage = "Hello! I'm here to help you. How can I assist you today?", companyId, showAvatars = true, showTimestamps = true, theme = "light", primaryColor = "#3b82f6", maxMessages = 100, className = "", style = {}, }) {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const scrollToBottom = useCallback(function () {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, []);
    useEffect(function () {
        scrollToBottom();
    }, [messages, scrollToBottom]);
    useEffect(function () {
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
    }, [welcomeMessage, messages.length]);
    useEffect(function () {
        const root = document.documentElement;
        if (theme === "dark" ||
            (theme === "auto" &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)) {
            root.classList.add("dark");
        }
        else {
            root.classList.remove("dark");
        }
    }, [theme]);
    function sendMessage(content) {
        if (!content.trim() || isLoading)
            return;
        const userMessage = {
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
        if (!apiUrl) {
            LocalBot.processMessage(content.trim())
                .then(function (data) {
                const botMessage = {
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
                sessionId: typeof window !== "undefined"
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
            const botMessage = {
                id: (Date.now() + 1).toString(),
                content: data.response || "Sorry, I don't have info on that.",
                sender: "bot",
                timestamp: new Date(),
            };
            setMessages(function (prev) {
                return [...prev, botMessage];
            });
            if (data.sessionId && typeof window !== "undefined") {
                sessionStorage.setItem("etegie-session-id", data.sessionId);
            }
        })
            .catch(function (error) {
            console.warn("API connection failed, falling back to local logic");
            LocalBot.processMessage(content.trim()).then(function (data) {
                const botMessage = {
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
    function handleSubmit(e) {
        e.preventDefault();
        sendMessage(inputValue);
    }
    function handleKeyPress(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage(inputValue);
        }
    }
    function toggleChat() {
        if (isMinimized) {
            setIsMinimized(false);
            setIsOpen(true);
        }
        else if (isOpen) {
            setIsOpen(false);
        }
        else {
            setIsOpen(true);
        }
    }
    const limitedMessages = messages.slice(-maxMessages);
    return (_jsxs(_Fragment, { children: [_jsx("style", { dangerouslySetInnerHTML: { __html: customStyles } }), _jsxs("div", { className: `etegie-chat-container font-sans ${className}`, style: {
                    "--tw-primary-color": primaryColor,
                    ...style,
                }, children: [isOpen && (_jsxs("div", { className: `w-[400px] h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 mb-4 ${isMinimized ? "h-20" : ""}`, style: { animation: "etegie-slide-up 0.3s ease-out" }, children: [_jsxs("div", { className: "bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [showAvatars && (_jsx("div", { className: "w-10 h-10 bg-white/20 rounded-full flex items-center justify-center", children: _jsx(Bot, { size: 20 }) })), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold leading-tight", children: botName }), _jsxs("span", { className: "text-sm opacity-90 flex items-center gap-2", children: [_jsx("span", { className: "w-2 h-2 bg-green-400 rounded-full animate-pulse" }), "Online"] })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { className: "w-8 h-8 bg-white/10 hover:bg-white/20 border-none rounded-lg text-white cursor-pointer flex items-center justify-center transition-all duration-200 hover:scale-105", onClick: function () {
                                                    setIsMinimized(!isMinimized);
                                                }, "aria-label": isMinimized ? "Maximize" : "Minimize", children: isMinimized ? (_jsx(Maximize2, { size: 16 })) : (_jsx(Minimize2, { size: 16 })) }), _jsx("button", { className: "w-8 h-8 bg-white/10 hover:bg-white/20 border-none rounded-lg text-white cursor-pointer flex items-center justify-center transition-all duration-200 hover:scale-105", onClick: function () {
                                                    setIsOpen(false);
                                                }, "aria-label": "Close chat", children: _jsx(X, { size: 16 }) })] })] }), !isMinimized && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 etegie-messages", children: [limitedMessages.map(function (message) {
                                                const isUser = message.sender === "user";
                                                return (_jsxs("div", { className: `etegie-message ${isUser ? "user" : "bot"}`, children: [showAvatars && (_jsx("div", { className: `etegie-avatar ${isUser ? "user" : "bot"}`, children: isUser ? _jsx(User, { size: 16 }) : _jsx(Bot, { size: 16 }) })), _jsxs("div", { className: "etegie-bubble-container", children: [_jsx("div", { className: `etegie-bubble ${isUser ? "user" : "bot"}`, children: message.content }), showTimestamps && (_jsx("div", { className: `etegie-timestamp ${isUser ? "user" : "bot"}`, children: format(message.timestamp, "HH:mm") }))] })] }, message.id));
                                            }), isLoading && (_jsxs("div", { className: "etegie-typing", children: [showAvatars && (_jsx("div", { className: "etegie-avatar bot", children: _jsx(Bot, { size: 16 }) })), _jsx("div", { className: "etegie-bubble bot", children: _jsxs("div", { className: "etegie-typing-dots", children: [_jsx("span", { className: "etegie-typing-dot" }), _jsx("span", { className: "etegie-typing-dot" }), _jsx("span", { className: "etegie-typing-dot" })] }) })] })), _jsx("div", { ref: messagesEndRef })] }), _jsxs("form", { className: "p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex gap-3 items-center", onSubmit: handleSubmit, children: [_jsx("input", { ref: inputRef, type: "text", value: inputValue, onChange: function (e) {
                                                    setInputValue(e.target.value);
                                                }, onKeyPress: handleKeyPress, placeholder: "Type your message...", className: "flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed placeholder-gray-500 dark:placeholder-gray-400", disabled: isLoading }), _jsx("button", { type: "submit", className: "w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-none rounded-xl cursor-pointer flex items-center justify-center transition-all duration-200 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100 shadow-lg", disabled: !inputValue.trim() || isLoading, "aria-label": "Send message", children: _jsx(Send, { size: 18 }) })] })] }))] })), !isOpen && (_jsx("button", { className: "w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-none cursor-pointer flex items-center justify-center shadow-2xl transition-all duration-200 hover:scale-110 hover:shadow-3xl", style: { animation: "etegie-bounce 2s infinite" }, onClick: toggleChat, "aria-label": "Open chat", children: _jsx(MessageCircle, { size: 28 }) }))] })] }));
}
//# sourceMappingURL=Chatbot.js.map