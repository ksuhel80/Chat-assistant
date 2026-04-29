"use client";

import { useState, useEffect } from "react";
import { Conversation, Persona } from "@/types";
import { Menu, Download, MoreVertical, Edit2 } from "lucide-react";

interface ConversationHeaderProps {
  conversation: Conversation | null;
  persona: Persona | null;
  onOpenPersona: () => void;
  onExport: () => void;
  onToggleSidebar: () => void;
  onUpdateTitle: (title: string) => void;
}

export default function ConversationHeader({
  conversation,
  persona,
  onOpenPersona,
  onExport,
  onToggleSidebar,
  onUpdateTitle,
}: ConversationHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(conversation?.title || "New Chat");

  useEffect(() => {
    if (conversation) {
      setTitle(conversation.title);
    }
  }, [conversation]);

  const handleSubmit = () => {
    if (title.trim() && title !== conversation?.title) {
      onUpdateTitle(title.trim());
    }
    setIsEditing(false);
  };

  return (
    <div
      style={{
        height: "60px",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        backgroundColor: "white",
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
        <button
          onClick={onToggleSidebar}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            padding: "8px",
            color: "#6b7280",
          }}
        >
          <Menu size={20} />
        </button>

        {isEditing ? (
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            style={{
              fontSize: "16px",
              fontWeight: 600,
              padding: "4px 8px",
              border: "1px solid #3b82f6",
              borderRadius: "4px",
              outline: "none",
              width: "200px",
            }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: "4px",
            }}
            onClick={() => setIsEditing(true)}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <span style={{ fontWeight: 600, fontSize: "16px", color: "#111827" }}>
              {title}
            </span>
            <Edit2 size={14} color="#9ca3af" />
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {persona && (
          <button
            onClick={onOpenPersona}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "20px",
              border: "1px solid #e5e7eb",
              backgroundColor: "white",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            <span>{persona.avatar_emoji}</span>
            <span>{persona.name}</span>
          </button>
        )}

        <button
          onClick={onExport}
          title="Export Conversation"
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            padding: "8px",
            color: "#6b7280",
          }}
        >
          <Download size={20} />
        </button>

        <button
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            padding: "8px",
            color: "#6b7280",
          }}
        >
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  );
}
