"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function CockpitChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Dornier 228 assistant here! How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const didMountRef = useRef(false);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: messages.filter((m) => m !== messages[0]),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Request failed");
      }

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      // Add empty assistant message placeholder
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "" },
      ]);
      
      setIsLoading(false); // Stop loading animation since streaming begins

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastIndex = newMessages.length - 1;
            newMessages[lastIndex] = {
              ...newMessages[lastIndex],
              content: newMessages[lastIndex].content + chunk,
            };
            return newMessages;
          });
        }
      }
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠ ${error.message || "Connection error. Please try again."}`,
        },
      ]);
      setIsLoading(false);
    } finally {
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full">
      {/* Header */}
      <div className="bg-[#1a2530] border-b-[2px] border-[#111] px-3 py-2 flex items-center gap-2 shrink-0">
        {/* Status LED */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-5 h-5 rounded-full bg-[#22cc33] opacity-30 blur-sm pointer-events-none"></div>
          <div className="w-2 h-2 rounded-full bg-[#22cc33] shadow-[0_0_4px_#22cc33] z-10"></div>
        </div>
        <span className="text-[#8fa8c0] text-xs font-bold tracking-widest uppercase">
          CWS ASSISTANT
        </span>
      </div>

      {/* Messages area with custom scrollbar */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-custom min-h-0">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] px-3 py-2 rounded-lg text-xs md:text-sm leading-relaxed ${msg.role === "user"
                  ? "bg-[#2a4a6a] text-[#d0e0f0] border border-[#3a5a7a] rounded-br-none"
                  : "bg-[#1a2228] text-[#a0b8cc] border border-[#2a3a44] rounded-bl-none"
                }`}
            >
              <ReactMarkdown
                components={{
                  p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                  strong: ({node, ...props}) => <strong className="text-[#e0e8f0] font-semibold" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 last:mb-0 space-y-1" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2 last:mb-0 space-y-1" {...props} />,
                  li: ({node, ...props}) => <li className="" {...props} />,
                  a: ({node, ...props}) => <a className="text-[#3388ff] hover:underline" {...props} />,
                  code: ({node, ...props}) => <code className="bg-[#0a0e18] px-1 py-0.5 rounded text-[#ffaa22]" {...props} />
                }}
              >
                {msg.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#1a2228] text-[#607888] border border-[#2a3a44] px-3 py-2 rounded-lg rounded-bl-none text-xs">
              <span className="inline-flex gap-1">
                <span className="animate-bounce" style={{ animationDelay: "0ms" }}>●</span>
                <span className="animate-bounce" style={{ animationDelay: "150ms" }}>●</span>
                <span className="animate-bounce" style={{ animationDelay: "300ms" }}>●</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 border-t-[2px] border-[#111] bg-[#1a2530] p-2 flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about the Do-228..."
          disabled={isLoading}
          className="flex-1 bg-[#0d1418] border border-[#2a3a44] rounded px-3 py-2 text-xs md:text-sm text-[#c0d0e0] placeholder-[#4a5a6a] focus:outline-none focus:border-[#3a6a9a] transition-colors disabled:opacity-50"
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          className="bg-[#2a4a6a] hover:bg-[#3a5a7a] disabled:bg-[#1a2a3a] disabled:opacity-50 text-[#c0d8f0] px-3 py-2 rounded text-xs font-bold tracking-wider transition-colors border border-[#3a5a7a] disabled:border-[#2a3a44]"
        >
          SEND
        </button>
      </div>
    </div>
  );
}
