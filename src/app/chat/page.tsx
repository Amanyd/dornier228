"use client";

import React, { useState } from "react";

export default function ChatTestPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: messages,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || `Error ${res.status}: Failed to get response`);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `API Error: ${data.error || res.statusText}` },
        ]);
      } else if (data.error) {
        setError(data.error);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${data.error}` },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.response },
        ]);
      }
    } catch (err: any) {
      setError(err.message || "Network error");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Network Error: ${err.message}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "monospace", maxWidth: "800px", margin: "0 auto", backgroundColor: "#fff", color: "#000", minHeight: "100vh" }}>
      <h2>Gemini Chat Tester (/api/chat)</h2>
      
      {error && (
        <div style={{ backgroundColor: "#ffdddd", border: "1px solid red", padding: "10px", marginBottom: "15px", color: "red" }}>
          <strong>Error Detected:</strong> {error}
        </div>
      )}

      <div style={{ border: "1px solid #ccc", height: "400px", overflowY: "auto", padding: "10px", marginBottom: "10px", backgroundColor: "#f9f9f9" }}>
        {messages.length === 0 && <p style={{ color: "#888" }}>No messages yet. Send a message to start.</p>}
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: "15px", textAlign: msg.role === "user" ? "right" : "left" }}>
            <div style={{ 
              display: "inline-block", 
              padding: "8px 12px", 
              borderRadius: "4px",
              backgroundColor: msg.role === "user" ? "#d0e8ff" : "#e8e8e8",
              border: `1px solid ${msg.role === "user" ? "#b0d0ff" : "#ccc"}`,
              maxWidth: "80%"
            }}>
              <strong style={{ display: "block", marginBottom: "4px", fontSize: "0.8em", color: "#555" }}>
                {msg.role.toUpperCase()}
              </strong>
              <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{msg.content}</div>
            </div>
          </div>
        ))}
        {isLoading && <div style={{ color: "#888", fontStyle: "italic" }}>Assistant is typing...</div>}
      </div>

      <form onSubmit={sendMessage} style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
          disabled={isLoading}
          style={{ flex: 1, padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        <button 
          type="submit" 
          disabled={isLoading || !input.trim()}
          style={{ padding: "10px 20px", backgroundColor: "#0066cc", color: "white", border: "none", borderRadius: "4px", cursor: isLoading ? "not-allowed" : "pointer" }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
