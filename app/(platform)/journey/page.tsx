import { requireRole } from "@/lib/auth/session";
import { TrendingUp } from "lucide-react";

export default async function JourneyPage() {
  await requireRole(["profissional"]);
  return (
    <div className="page-container">
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>Minha jornada</h1>
        <p style={{ fontSize: "14px", color: "var(--idl-text-muted)" }}>Acompanhe seu desenvolvimento na rede</p>
      </div>
      <div className="card" style={{ textAlign: "center", padding: "80px 24px" }}>
        <TrendingUp size={48} style={{ margin: "0 auto 20px", color: "var(--idl-magenta)", opacity: 0.6 }} />
        <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>Em breve</h2>
        <p style={{ fontSize: "14px", color: "var(--idl-text-muted)", maxWidth: "420px", margin: "0 auto" }}>
          O painel de jornada de desenvolvimento de lideranças será ativado em breve.
        </p>
      </div>
    </div>
  );
}
