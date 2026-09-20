import { requireRole } from "@/lib/auth/session";
import { createRewardAction } from "@/domains/rewards/actions";
import Link from "next/link";

export default async function NewRewardPage() {
  await requireRole(["instituto"]);

  return (
    <div className="page-container" style={{ maxWidth: "640px" }}>
      <div style={{ marginBottom: "24px" }}>
        <Link href="/rewards" style={{ fontSize: "13px", color: "var(--idl-text-muted)", textDecoration: "none" }}>
          ← Recompensas
        </Link>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginTop: "8px" }}>Nova recompensa</h1>
      </div>

      <form action={createRewardAction} className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Título *</label>
          <input name="title" required placeholder="Ex: Certificado de Excelência em Liderança" style={{ width: "100%", border: "1px solid var(--idl-border)", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", background: "var(--idl-background-soft)", color: "var(--idl-text)", boxSizing: "border-box" }} />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Descrição *</label>
          <textarea name="description" required rows={3} placeholder="Descreva o que o participante ganha com esta recompensa..." style={{ width: "100%", border: "1px solid var(--idl-border)", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", background: "var(--idl-background-soft)", color: "var(--idl-text)", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }} />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Pontos necessários</label>
          <input name="points" type="number" min="0" defaultValue="0" style={{ width: "100%", border: "1px solid var(--idl-border)", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", background: "var(--idl-background-soft)", color: "var(--idl-text)", boxSizing: "border-box" }} />
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", paddingTop: "8px" }}>
          <Link href="/rewards" className="btn-outline">Cancelar</Link>
          <button type="submit" className="btn-primary">Criar recompensa</button>
        </div>
      </form>
    </div>
  );
}
