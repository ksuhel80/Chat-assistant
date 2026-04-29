"use client";

import { useState } from "react";
import { Message } from "@/types";
import { Copy, Check, ThumbsUp, ThumbsDown, Heart } from "lucide-react";
import { format } from "date-fns";

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
  onReaction?: (id: string, reaction: string) => void;
}

export default function MessageBubble({
  message,
  isStreaming,
  onReaction,
}: MessageBubbleProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatContent = (content: string) => {
    // Basic bold and code formatting
    const parts = content.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={index}
            style={{
              backgroundColor: isUser ? "rgba(255,255,255,0.1)" : "#f3f4f6",
              padding: "2px 4px",
              borderRadius: "4px",
              fontFamily: "monospace",
            }}
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isUser ? "flex-end" : "flex-start",
        marginBottom: "16px",
        position: "relative",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          maxWidth: "75%",
          padding: "12px 16px",
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          backgroundColor: isUser ? "#1f2937" : "white",
          color: isUser ? "white" : "#374151",
          border: isUser ? "none" : "1px solid #e5e7eb",
          position: "relative",
          boxShadow: isHovered ? "0 4px 6px -1px rgb(0 0 0 / 0.1)" : "none",
          transition: "box-shadow 0.2s",
        }}
      >
        <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {formatContent(message.content)}
          {isStreaming && (
            <span
              style={{
                display: "inline-block",
                width: "8px",
                height: "15px",
                backgroundColor: "currentColor",
                marginLeft: "4px",
                verticalAlign: "middle",
                animation: "blink 1s step-end infinite",
              }}
            >
              <style>
                {`
                  @keyframes blink {
                    from, to { opacity: 1; }
                    50% { opacity: 0; }
                  }
                `}
              </style>
            </span>
          )}
        </div>

        {isHovered && !isStreaming && (
          <div
            style={{
              position: "absolute",
              top: "-32px",
              [isUser ? "right" : "left"]: 0,
              display: "flex",
              gap: "4px",
              padding: "4px",
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgb(0 0 0 / 0.05)",
              zIndex: 10,
            }}
          >
            <button
              onClick={handleCopy}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                color: "#6b7280",
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
            {!isUser && onReaction && (
              <>
                <div style={{ width: "1px", backgroundColor: "#e5e7eb", margin: "0 2px" }} />
                {(["👍", "👎", "❤️"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => onReaction(message.id, r)}
                    style={{
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      padding: "2px 4px",
                      fontSize: "14px",
                      opacity: message.reaction === r ? 1 : 0.6,
                    }}
                  >
                    {r === "👍" ? <ThumbsUp size={14} /> : r === "👎" ? <ThumbsDown size={14} /> : <Heart size={14} />}
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {isHovered && (
        <span
          style={{
            fontSize: "10px",
            color: "#9ca3af",
            marginTop: "4px",
            padding: "0 4px",
          }}
        >
          {format(new Date(message.created_at), "HH:mm")}
        </span>
      )}
    </div>
  );
}
