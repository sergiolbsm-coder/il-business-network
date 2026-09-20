import { requireRole } from "@/lib/auth/session";
import { Gift } from "lucide-react";

export default async function BenefitsPage() {
  await requireRole(["parceiro"]);
  return (
    <div className="page-container">
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>Benefícios</h1>
        <p style={{ fontSize: "14px", color: "var(--idl-text-muted)" }}>Benefícios exclusivos para parceiros da rede</p>
      </div>
      <div className="card" style={{ textAlign: "center", padding: "80px 24px" }}>
        <Gift size={48} style={{ margin: "0 auto 20px", color: "var(--idl-magenta)", opacity: 0.6 }} />
        <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>Em breve</h2>
        <p style={{ fontSize: "14px", color: "var(--idl-text-muted)", maxWidth: "420px", margin: "0 auto" }}>
          Os benefícios exclusivos para parceiros credenciados estarão disponíveis em breve.
        </p>
      </div>
    </div>
  );
}
