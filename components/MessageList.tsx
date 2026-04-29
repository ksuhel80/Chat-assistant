"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/types";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import { MessageCircle } from "lucide-react";
import { format, isSameDay } from "date-fns";

interface MessageListProps {
  messages: Message[];
  isStreaming: boolean;
  streamingContent: string;
  onReaction: (id: string, reaction: string) => void;
}

export default function MessageList({
  messages,
  isStreaming,
  streamingContent,
  onReaction,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  if (messages.length === 0 && !isStreaming) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#9ca3af",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            backgroundColor: "#f3f4f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MessageCircle size={32} />
        </div>
        <p style={{ fontSize: "16px", fontWeight: 500 }}>Start a conversation</p>
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {messages.map((message, index) => {
        const showDateSeparator =
          index === 0 ||
          !isSameDay(
            new Date(message.created_at),
            new Date(messages[index - 1].created_at)
          );

        return (
          <div key={message.id}>
            {showDateSeparator && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "24px 0",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#9ca3af",
                    backgroundColor: "#f9fafb",
                    padding: "4px 12px",
                    borderRadius: "12px",
                  }}
                >
                  {format(new Date(message.created_at), "MMMM d, yyyy")}
                </span>
              </div>
            )}
            <MessageBubble message={message} onReaction={onReaction} />
          </div>
        );
      })}

      {isStreaming && (
        <>
          {streamingContent ? (
            <MessageBubble
              message={{
                id: "streaming",
                role: "assistant",
                content: streamingContent,
                created_at: new Date().toISOString(),
                conversation_id: "",
                tokens: 0,
                reaction: null,
                is_edited: false,
              }}
              isStreaming={true}
            />
          ) : (
            <TypingIndicator />
          )}
        </>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
