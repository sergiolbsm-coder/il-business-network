import { requireRole } from "@/lib/auth/session";
import { Target } from "lucide-react";

export default async function OpportunitiesPage() {
  await requireRole(["profissional"]);
  return (
    <div className="page-container">
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>Oportunidades</h1>
        <p style={{ fontSize: "14px", color: "var(--idl-text-muted)" }}>Vagas e projetos para lideranças</p>
      </div>
      <div className="card" style={{ textAlign: "center", padding: "80px 24px" }}>
        <Target size={48} style={{ margin: "0 auto 20px", color: "var(--idl-magenta)", opacity: 0.6 }} />
        <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>Em breve</h2>
        <p style={{ fontSize: "14px", color: "var(--idl-text-muted)", maxWidth: "420px", margin: "0 auto" }}>
          As oportunidades de posições de liderança nas empresas da rede estarão disponíveis em breve.
        </p>
      </div>
    </div>
  );
}
