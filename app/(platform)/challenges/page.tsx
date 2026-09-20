import { requireSession } from "@/lib/auth/session";
import { Trophy } from "lucide-react";

export default async function ChallengesPage() {
  await requireSession();
  return (
    <div className="page-container">
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>Desafios</h1>
        <p style={{ fontSize: "14px", color: "var(--idl-text-muted)" }}>Desafios de desenvolvimento e inovação da rede</p>
      </div>
      <div className="card" style={{ textAlign: "center", padding: "80px 24px" }}>
        <Trophy size={48} style={{ margin: "0 auto 20px", color: "var(--idl-magenta)", opacity: 0.6 }} />
        <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>Em breve</h2>
        <p style={{ fontSize: "14px", color: "var(--idl-text-muted)", maxWidth: "420px", margin: "0 auto" }}>
          Os desafios de inovação e desenvolvimento organizacional estarão disponíveis em breve. Fique atento aos eventos da rede.
        </p>
      </div>
    </div>
  );
}
