import React, { useState, useEffect, useRef } from "react";
import { Bot, Send, X, MessageSquare, Sparkles } from "lucide-react";
import { marked } from "marked";
import { io } from "socket.io-client";

// Connect to backend websocket
const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000");

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: "bot", text: "Hello! I am your AI assistant. Ask me anything about your job search or resume!" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const togglePopup = () => setIsOpen(!isOpen);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const msg = inputValue.trim();
      setMessages((prev) => [...prev, { type: "user", text: msg }]);
      socket.emit("user_message", msg);
      setInputValue("");
      setIsLoading(true);
    }
  };

  useEffect(() => {
    socket.on("bot reply", (reply) => {
      setMessages((prev) => [...prev, { type: "bot", text: reply }]);
      setIsLoading(false);
    });

    return () => {
      socket.off("bot reply");
    };
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const parseText = (text) => ({ __html: marked(text) });

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Action Button */}
      <button
        onClick={togglePopup}
        className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-violet-600 text-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(99,102,241,0.4)] hover:shadow-[0_6px_24px_rgba(99,102,241,0.6)] hover:scale-105 transition-all duration-300 group"
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform group-hover:rotate-90 duration-200" />
        ) : (
          <MessageSquare className="w-6 h-6 animate-pulse" />
        )}
      </button>

      {/* Chat Dialog */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 sm:w-96 h-[500px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-850 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1">
                  ReadyBoss
                  <Sparkles size={10} className="text-violet-400" />
                </h3>
                <p className="text-[9px] text-slate-500 font-semibold">Online & ready</p>
              </div>
            </div>
            <button
              onClick={togglePopup}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Conversation Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.type === "user" ? "justify-end" : "justify-start"} items-end gap-2`}
              >
                {m.type === "bot" && (
                  <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                    <Bot size={12} className="text-indigo-400" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-3 py-2 text-[11px] leading-relaxed rounded-xl shadow-md border
                    ${m.type === "user"
                      ? "bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white border-indigo-500/30 rounded-br-none"
                      : "bg-slate-900 text-slate-200 border-slate-800 rounded-bl-none"
                    }`}
                >
                  <p
                    className="prose prose-invert max-w-none break-words"
                    dangerouslySetInnerHTML={parseText(m.text)}
                  />
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start items-center gap-2">
                <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                  <Bot size={12} className="text-indigo-400" />
                </div>
                <div className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl rounded-bl-none flex items-center space-x-1 shadow-md">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-slate-800 bg-slate-900">
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask your assistant..."
                className="flex-1 bg-transparent text-slate-200 text-xs focus:outline-none placeholder-slate-650"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="text-indigo-400 hover:text-indigo-300 disabled:text-slate-700 transition-colors"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
