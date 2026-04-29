export default function TypingIndicator() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        padding: "12px 16px",
        backgroundColor: "#f3f4f6",
        borderRadius: "18px 18px 18px 4px",
        width: "fit-content",
        marginBottom: "16px",
      }}
    >
      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
          }
        `}
      </style>
      {[0, 0.15, 0.3].map((delay, i) => (
        <div
          key={i}
          style={{
            width: "6px",
            height: "6px",
            backgroundColor: "#9ca3af",
            borderRadius: "50%",
            animation: `bounce 1s infinite ease-in-out`,
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </div>
  );
}
