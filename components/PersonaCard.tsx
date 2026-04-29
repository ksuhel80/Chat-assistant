import { Persona } from "@/types";

interface PersonaCardProps {
  persona: Persona;
  isActive: boolean;
  onClick: () => void;
}

export default function PersonaCard({
  persona,
  isActive,
  onClick,
}: PersonaCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "16px",
        borderRadius: "12px",
        backgroundColor: "white",
        border: isActive ? "2px solid #000" : "1px solid #e5e7eb",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        transition: "all 0.2s ease",
        boxShadow: isActive ? "0 4px 6px -1px rgb(0 0 0 / 0.1)" : "none",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.boxShadow = "0 4px 6px -1px rgb(0 0 0 / 0.1)";
          e.currentTarget.style.borderColor = "#9ca3af";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.borderColor = "#e5e7eb";
        }
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          backgroundColor: persona.color || "#f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
        }}
      >
        {persona.avatar_emoji}
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: "16px", color: "#111827" }}>
          {persona.name}
        </div>
        <div
          style={{
            fontSize: "13px",
            color: "#6b7280",
            marginTop: "4px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {persona.description || "No description provided."}
        </div>
      </div>
    </div>
  );
}
