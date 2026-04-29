"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useConversations } from "@/hooks/useConversations";
import { useMessages } from "@/hooks/useMessages";
import { usePersonas } from "@/hooks/usePersonas";
import Sidebar from "@/components/Sidebar";
import ConversationHeader from "@/components/ConversationHeader";
import MessageList from "@/components/MessageList";
import ChatInput from "@/components/ChatInput";
import PersonaModal from "@/components/PersonaModal";
import { Conversation, Persona } from "@/types";

export default function ChatPage() {
  const router = useRouter();
  
  // Hooks
  const { 
    conversations, 
    loading: convsLoading, 
    fetchConversations,
    deleteConversation,
    pinConversation,
    updateConversation
  } = useConversations();
  
  const { 
    messages, 
    loading: msgsLoading, 
    isStreaming, 
    streamingContent, 
    fetchMessages, 
    sendMessage, 
    addReaction,
    setMessages
  } = useMessages();
  
  const { 
    personas, 
    loading: personasLoading,
    createPersona
  } = usePersonas();

  // State
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showPersonaModal, setShowPersonaModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Auth check
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setUserEmail(user.email || "");
      }
    };
    checkUser();
  }, [router, supabase]);

  // Responsive check
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Derived state
  const activeConversation = useMemo(() => 
    conversations.find(c => c.id === activeConversationId) || null
  , [conversations, activeConversationId]);

  const activePersona = useMemo(() => {
    if (activeConversation?.persona_id) {
      return personas.find(p => p.id === activeConversation.persona_id) || null;
    }
    // Fallback to default persona if no conversation active but one is selected
    return null; 
  }, [activeConversation, personas]);

  // Handle active conversation change
  useEffect(() => {
    if (activeConversationId) {
      fetchMessages(activeConversationId);
      if (isMobile) setSidebarOpen(false);
    } else {
      setMessages([]);
    }
  }, [activeConversationId, fetchMessages, setMessages, isMobile]);

  const handleSend = async (content: string) => {
    try {
      const convId = await sendMessage(
        content,
        activeConversationId || undefined,
        activeConversation?.system_prompt || activePersona?.system_prompt,
        activeConversation?.persona_id || activePersona?.id
      );

      if (convId && convId !== activeConversationId) {
        setActiveConversationId(convId);
        fetchConversations();
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleNewChat = (personaId?: string) => {
    setActiveConversationId(null);
    setMessages([]);
    if (isMobile) setSidebarOpen(false);
    if (personaId) {
      // Find persona to set as "pending" active persona for the new chat
      const p = personas.find(pers => pers.id === personaId);
      if (p) {
        // We don't have a conversation yet, so we just wait for the first message
      }
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleExport = async () => {
    if (!activeConversationId) return;
    try {
      const res = await fetch(`/api/export/${activeConversationId}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${activeConversation?.title || "chat"}.md`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", overflow: "hidden", backgroundColor: "white" }}>
      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 40,
          }}
        />
      )}

      {/* Sidebar */}
      <div style={{ 
        position: isMobile ? "fixed" : "relative",
        zIndex: 50,
        height: "100%",
        transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s ease",
        width: sidebarOpen ? "280px" : "0",
        flexShrink: 0,
        overflow: "hidden"
      }}>
        <Sidebar
          conversations={conversations}
          activeId={activeConversationId}
          personas={personas}
          loading={convsLoading}
          onSelect={setActiveConversationId}
          onNew={handleNewChat}
          onDelete={deleteConversation}
          onPin={pinConversation}
          onUpdateTitle={(id, title) => updateConversation(id, { title })}
          userEmail={userEmail}
          onSignOut={handleSignOut}
        />
      </div>

      {/* Main Content */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, position: "relative" }}>
        <ConversationHeader
          conversation={activeConversation}
          persona={activePersona}
          onOpenPersona={() => setShowPersonaModal(true)}
          onExport={handleExport}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onUpdateTitle={(title) => activeConversationId && updateConversation(activeConversationId, { title })}
        />

        <MessageList
          messages={messages}
          isStreaming={isStreaming}
          streamingContent={streamingContent}
          onReaction={addReaction}
        />

        <ChatInput
          onSend={handleSend}
          isLoading={isStreaming}
          placeholder={activePersona ? `Chat with ${activePersona.name}...` : "Type a message..."}
        />
      </main>

      <PersonaModal
        isOpen={showPersonaModal}
        personas={personas}
        activePersonaId={activeConversation?.persona_id || null}
        onSelect={(p) => handleNewChat(p.id)}
        onCreate={createPersona}
        onClose={() => setShowPersonaModal(false)}
      />
    </div>
  );
}
