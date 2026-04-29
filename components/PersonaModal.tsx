"use client";

import { useState } from "react";
import { Persona } from "@/types";
import { X, Plus } from "lucide-react";
import PersonaCard from "./PersonaCard";

interface PersonaModalProps {
  isOpen: boolean;
  personas: Persona[];
  activePersonaId: string | null;
  onSelect: (p: Persona) => void;
  onCreate: (data: Partial<Persona>) => void;
  onClose: () => void;
}

const COLORS = ["#ef4444", "#f97316", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"];

export default function PersonaModal({
  isOpen,
  personas,
  activePersonaId,
  onSelect,
  onCreate,
  onClose,
}: PersonaModalProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    avatar_emoji: "🤖",
    color: COLORS[0],
    system_prompt: "",
    description: "",
  });

  if (!isOpen) return null;

  const handleCreate = () => {
    onCreate(formData);
    setShowCreate(false);
    setFormData({
      name: "",
      avatar_emoji: "🤖",
      color: COLORS[0],
      system_prompt: "",
      description: "",
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "560px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
        }}
      >
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: 600, margin: 0 }}>
            Choose AI Persona
          </h2>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              padding: "4px",
              color: "#6b7280",
            }}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: "20px", overflowY: "auto", flex: 1 }}>
          {!showCreate ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              {personas.map((p) => (
                <PersonaCard
                  key={p.id}
                  persona={p}
                  isActive={activePersonaId === p.id}
                  onClick={() => {
                    onSelect(p);
                    onClose();
                  }}
                />
              ))}
              <div
                onClick={() => setShowCreate(true)}
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  border: "2px dashed #e5e7eb",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  cursor: "pointer",
                  minHeight: "120px",
                  color: "#6b7280",
                }}
              >
                <Plus size={24} />
                <span style={{ fontWeight: 500 }}>Create New</span>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "4px" }}>
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #e5e7eb" }}
                />
              </div>
              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "4px" }}>
                    Emoji
                  </label>
                  <input
                    type="text"
                    value={formData.avatar_emoji}
                    onChange={(e) => setFormData({ ...formData, avatar_emoji: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #e5e7eb" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "4px" }}>
                    Color
                  </label>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {COLORS.map((c) => (
                      <div
                        key={c}
                        onClick={() => setFormData({ ...formData, color: c })}
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "4px",
                          backgroundColor: c,
                          cursor: "pointer",
                          border: formData.color === c ? "2px solid #000" : "none",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "4px" }}>
                  System Prompt
                </label>
                <textarea
                  value={formData.system_prompt}
                  onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })}
                  rows={4}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #e5e7eb", resize: "none" }}
                />
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button
                  onClick={() => setShowCreate(false)}
                  style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "white", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!formData.name || !formData.system_prompt}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "8px",
                    border: "none",
                    background: "black",
                    color: "white",
                    cursor: formData.name && formData.system_prompt ? "pointer" : "not-allowed",
                    opacity: formData.name && formData.system_prompt ? 1 : 0.5,
                  }}
                >
                  Save Persona
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
