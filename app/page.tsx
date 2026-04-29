import Link from "next/link";
import { MessageSquare, Zap, Shield, Sparkles, Code, Globe, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "white", fontFamily: "Inter, sans-serif" }}>
      {/* Navbar */}
      <nav style={{ 
        height: "72px", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between", 
        padding: "0 24px", 
        borderBottom: "1px solid #f3f4f6",
        maxWidth: "1200px",
        margin: "0 auto",
        width: "100%"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "36px", height: "36px", backgroundColor: "#10b981", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
            <MessageSquare size={20} style={{ margin: "0 auto" }} />
          </div>
          <span style={{ fontSize: "20px", fontWeight: 700, color: "#111827" }}>ChatAI</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link href="/login" style={{ fontSize: "14px", fontWeight: 500, color: "#374151", textDecoration: "none" }}>
            Login
          </Link>
          <Link href="/signup" style={{ 
            fontSize: "14px", 
            fontWeight: 600, 
            backgroundColor: "black", 
            color: "white", 
            padding: "10px 20px", 
            borderRadius: "8px", 
            textDecoration: "none" 
          }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: "80px 24px", textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "56px", fontWeight: 800, color: "#111827", lineHeight: "1.1", marginBottom: "24px", letterSpacing: "-0.02em" }}>
          Supercharge your workflow with <span style={{ color: "#10b981" }}>Intelligent Chat</span>
        </h1>
        <p style={{ fontSize: "20px", color: "#4b5563", lineHeight: "1.6", marginBottom: "40px" }}>
          Experience the next generation of AI assistance. Chat, code, and create with specialized personas tailored to your needs.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
          <Link href="/signup" style={{ 
            fontSize: "18px", 
            fontWeight: 600, 
            backgroundColor: "black", 
            color: "white", 
            padding: "16px 32px", 
            borderRadius: "12px", 
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            Start Chatting Free <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: "80px 24px", backgroundColor: "#f9fafb" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "32px", fontWeight: 700, textAlign: "center", marginBottom: "48px" }}>Everything you need in an AI Assistant</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px" }}>
            {[
              { icon: <Zap color="#f59e0b" />, title: "Lightning Fast", desc: "Real-time streaming responses powered by Google's latest Gemini models." },
              { icon: <Shield color="#10b981" />, title: "Secure & Private", desc: "Your data is protected with industry-standard encryption and secure auth." },
              { icon: <Sparkles color="#8b5cf6" />, title: "Custom Personas", desc: "Create and customize AI personalities for specific tasks and roles." },
              { icon: <Code color="#3b82f6" />, title: "Code Specialist", desc: "Expert assistance with programming, debugging, and architectural design." },
              { icon: <Globe color="#ef4444" />, title: "Multilingual", desc: "Communicate fluently in over 100 languages with native-level proficiency." },
              { icon: <MessageSquare color="#06b6d4" />, title: "Smart History", desc: "Context-aware conversations that remember your previous interactions." },
            ].map((feature, i) => (
              <div key={i} style={{ backgroundColor: "white", padding: "32px", borderRadius: "16px", border: "1px solid #e5e7eb" }}>
                <div style={{ marginBottom: "16px" }}>{feature.icon}</div>
                <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "8px" }}>{feature.title}</h3>
                <p style={{ color: "#6b7280", lineHeight: "1.5" }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Persona Showcase */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 style={{ fontSize: "32px", fontWeight: 700, marginBottom: "16px" }}>Specialized AI Personas</h2>
            <p style={{ color: "#6b7280" }}>Choose the right expert for your specific task</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
            {[
              { emoji: "🤖", name: "General Assistant", color: "#10b981", desc: "Your versatile daily companion for any task." },
              { emoji: "💻", name: "Code Pro", color: "#3b82f6", desc: "Expert in 20+ programming languages and frameworks." },
              { emoji: "✍️", name: "Content Writer", color: "#f59e0b", desc: "Creative partner for blogs, emails, and social media." },
              { emoji: "🔍", name: "Research Expert", color: "#8b5cf6", desc: "Deep dives into complex topics and data analysis." },
            ].map((p, i) => (
              <div key={i} style={{ textAlign: "center", padding: "24px", borderRadius: "16px", border: "1px solid #f3f4f6" }}>
                <div style={{ 
                  width: "64px", 
                  height: "64px", 
                  backgroundColor: `${p.color}15`, 
                  borderRadius: "50%", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  fontSize: "32px", 
                  margin: "0 auto 16px auto" 
                }}>
                  {p.emoji}
                </div>
                <h4 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>{p.name}</h4>
                <p style={{ fontSize: "14px", color: "#6b7280" }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: "80px 24px", backgroundColor: "#111827", color: "white", textAlign: "center" }}>
        <h2 style={{ fontSize: "36px", fontWeight: 700, marginBottom: "24px" }}>Ready to transform your productivity?</h2>
        <p style={{ fontSize: "18px", color: "#9ca3af", marginBottom: "40px", maxWidth: "600px", margin: "0 auto 40px auto" }}>
          Join thousands of users who are already using ChatAI to work smarter and faster.
        </p>
        <Link href="/signup" style={{ 
          fontSize: "18px", 
          fontWeight: 600, 
          backgroundColor: "#10b981", 
          color: "white", 
          padding: "16px 40px", 
          borderRadius: "12px", 
          textDecoration: "none",
          display: "inline-block"
        }}>
          Get Started Now — It's Free
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ padding: "40px 24px", borderTop: "1px solid #f3f4f6", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "24px", height: "24px", backgroundColor: "#10b981", borderRadius: "6px", display: "flex", alignItems: "center", justifyCenter: "center", color: "white" }}>
              <MessageSquare size={14} style={{ margin: "0 auto" }} />
            </div>
            <span style={{ fontSize: "16px", fontWeight: 700 }}>ChatAI</span>
          </div>
          <div style={{ display: "flex", gap: "24px", fontSize: "14px", color: "#6b7280" }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Contact</span>
          </div>
          <p style={{ fontSize: "14px", color: "#9ca3af" }}>© 2026 ChatAI Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
