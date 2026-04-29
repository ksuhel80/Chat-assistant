"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";

interface ChatInputProps {
  onSend: (msg: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export default function ChatInput({
  onSend,
  isLoading,
  placeholder = "Type a message...",
}: ChatInputProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "48px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(Math.max(scrollHeight, 48), 200) + "px";
    }
  }, [text]);

  const handleSend = () => {
    if (text.trim() && !isLoading) {
      onSend(text.trim());
      setText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        padding: "16px",
        backgroundColor: "white",
        borderTop: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-end", gap: "12px" }}>
        <div
          style={{
            flex: 1,
            backgroundColor: "#f9fafb",
            borderRadius: "24px",
            padding: "8px 16px",
            border: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "none",
              resize: "none",
              padding: "8px 0",
              fontSize: "15px",
              lineHeight: "20px",
              color: "#374151",
              maxHeight: "200px",
              minHeight: "32px",
            }}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!text.trim() || isLoading}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: text.trim() && !isLoading ? "black" : "#e5e7eb",
            color: "white",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: text.trim() && !isLoading ? "pointer" : "default",
            transition: "background-color 0.2s",
          }}
        >
          <ArrowUp size={20} />
        </button>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 12px",
        }}
      >
        <span style={{ fontSize: "12px", color: "#9ca3af" }}>
          Press Enter to send
        </span>
        {text.length > 300 && (
          <span
            style={{
              fontSize: "12px",
              color: text.length > 1000 ? "#ef4444" : "#9ca3af",
            }}
          >
            {text.length} characters
          </span>
        )}
      </div>
    </div>
  );
}
