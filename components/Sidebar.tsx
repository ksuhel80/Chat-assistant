"use client";

import { useState } from "react";
import { Conversation, Persona } from "@/types";
import { Plus, Search, Pin, Trash2, LogOut, MessageSquare } from "lucide-react";
import { format, isToday, isYesterday, subDays, isAfter } from "date-fns";

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  personas: Persona[];
  loading: boolean;
  onSelect: (id: string) => void;
  onNew: (personaId?: string) => void;
  onDelete: (id: string) => void;
  onPin: (id: string, val: boolean) => void;
  onUpdateTitle: (id: string, title: string) => void;
  userEmail: string;
  onSignOut: () => void;
}

export default function Sidebar({
  conversations,
  activeId,
  personas,
  loading,
  onSelect,
  onNew,
  onDelete,
  onPin,
  userEmail,
  onSignOut,
}: SidebarProps) {
  const [search, setSearch] = useState("");

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const groupConversations = () => {
    const pinned = filteredConversations.filter((c) => c.is_pinned);
    const unpinned = filteredConversations.filter((c) => !c.is_pinned);

    const today: Conversation[] = [];
    const yesterday: Conversation[] = [];
    const last7Days: Conversation[] = [];
    const older: Conversation[] = [];

    const now = new Date();
    const yesterdayDate = subDays(now, 1);
    const sevenDaysAgo = subDays(now, 7);

    unpinned.forEach((c) => {
      const date = new Date(c.updated_at);
      if (isToday(date)) today.push(c);
      else if (isYesterday(date)) yesterday.push(c);
      else if (isAfter(date, sevenDaysAgo)) last7Days.push(c);
      else older.push(c);
    });

    return { pinned, today, yesterday, last7Days, older };
  };

  const groups = groupConversations();

  const renderGroup = (title: string, items: Conversation[]) => {
    if (items.length === 0) return null;
    return (
      <div style={{ marginBottom: "24px" }}>
        <h3
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            margin: "0 12px 8px",
          }}
        >
          {title}
        </h3>
        {items.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelect(c.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 12px",
              borderRadius: "8px",
              cursor: "pointer",
              backgroundColor: activeId === c.id ? "#1e293b" : "transparent",
              transition: "background-color 0.2s",
              position: "relative",
              group: "item",
            }}
            onMouseEnter={(e) => {
              if (activeId !== c.id) e.currentTarget.style.backgroundColor = "#1e293b";
              const buttons = e.currentTarget.querySelectorAll(".action-btn");
              buttons.forEach((b: any) => (b.style.opacity = "1"));
            }}
            onMouseLeave={(e) => {
              if (activeId !== c.id) e.currentTarget.style.backgroundColor = "transparent";
              const buttons = e.currentTarget.querySelectorAll(".action-btn");
              buttons.forEach((b: any) => (b.style.opacity = "0"));
            }}
          >
            <div style={{ fontSize: "18px" }}>
              {c.persona?.avatar_emoji || "💬"}
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  color: "#f8fafc",
                }}
              >
                {c.title}
              </div>
              <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                {format(new Date(c.updated_at), "HH:mm")}
              </div>
            </div>
            <div
              className="action-btn"
              style={{
                display: "flex",
                gap: "4px",
                opacity: 0,
                transition: "opacity 0.2s",
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPin(c.id, !c.is_pinned);
                }}
                style={{ border: "none", background: "none", cursor: "pointer", color: c.is_pinned ? "#10b981" : "#64748b", padding: "4px" }}
              >
                <Pin size={14} fill={c.is_pinned ? "currentColor" : "none"} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(c.id);
                }}
                style={{ border: "none", background: "none", cursor: "pointer", color: "#64748b", padding: "4px" }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      style={{
        width: "280px",
        height: "100vh",
        backgroundColor: "#0f172a",
        color: "white",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #1e293b",
      }}
    >
      <div style={{ padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              backgroundColor: "#10b981",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MessageSquare size={20} />
          </div>
          <h1 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>ChatAI</h1>
        </div>

        <button
          onClick={() => onNew()}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            cursor: "pointer",
            marginBottom: "20px",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <Plus size={20} /> New Chat
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "#1e293b",
            padding: "8px 12px",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        >
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              backgroundColor: "transparent",
              border: "none",
              outline: "none",
              color: "white",
              fontSize: "14px",
              width: "100%",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            paddingBottom: "8px",
            marginBottom: "10px",
            scrollbarWidth: "none",
          }}
        >
          {personas.map((p) => (
            <button
              key={p.id}
              onClick={() => onNew(p.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                backgroundColor: "#1e293b",
                borderRadius: "20px",
                border: "none",
                color: "white",
                fontSize: "13px",
                whiteSpace: "nowrap",
                cursor: "pointer",
              }}
            >
              <span>{p.avatar_emoji}</span>
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 12px",
          scrollbarWidth: "thin",
          scrollbarColor: "#1e293b transparent",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center", color: "#64748b", padding: "20px" }}>Loading...</div>
        ) : (
          <>
            {renderGroup("Pinned", groups.pinned)}
            {renderGroup("Today", groups.today)}
            {renderGroup("Yesterday", groups.yesterday)}
            {renderGroup("Last 7 Days", groups.last7Days)}
            {renderGroup("Older", groups.older)}
          </>
        )}
      </div>

      <div
        style={{
          padding: "16px",
          borderTop: "1px solid #1e293b",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            backgroundColor: "#3b82f6",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          {userEmail ? userEmail[0].toUpperCase() : "?"}
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <div
            style={{
              fontSize: "14px",
              fontWeight: 500,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {userEmail || "Not signed in"}
          </div>
        </div>
        <button
          onClick={onSignOut}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            color: "#64748b",
            padding: "8px",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
}
