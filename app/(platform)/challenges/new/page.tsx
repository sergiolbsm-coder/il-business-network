import { requireRole } from "@/lib/auth/session";
import { createChallengeAction } from "@/domains/challenges/actions";
import Link from "next/link";

export default async function NewChallengePage() {
  await requireRole(["instituto"]);

  return (
    <div className="page-container" style={{ maxWidth: "640px" }}>
      <div style={{ marginBottom: "24px" }}>
        <Link href="/challenges" style={{ fontSize: "13px", color: "var(--idl-text-muted)", textDecoration: "none" }}>
          ← Desafios
        </Link>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginTop: "8px" }}>Novo desafio</h1>
      </div>

      <form action={createChallengeAction} className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Título *</label>
          <input name="title" required placeholder="Ex: Desafio de Liderança em RH" style={{ width: "100%", border: "1px solid var(--idl-border)", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", background: "var(--idl-background-soft)", color: "var(--idl-text)", boxSizing: "border-box" }} />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Descrição *</label>
          <textarea name="description" required rows={4} placeholder="Descreva o desafio e o que se espera dos participantes..." style={{ width: "100%", border: "1px solid var(--idl-border)", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", background: "var(--idl-background-soft)", color: "var(--idl-text)", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Categoria</label>
            <select name="category" style={{ width: "100%", border: "1px solid var(--idl-border)", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", background: "var(--idl-background-soft)", color: "var(--idl-text)", boxSizing: "border-box" }}>
              <option value="geral">Geral</option>
              <option value="lideranca">Liderança</option>
              <option value="gestao">Gestão</option>
              <option value="inovacao">Inovação</option>
              <option value="cultura">Cultura</option>
              <option value="rh">RH & Pessoas</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Pontos</label>
            <input name="points" type="number" min="0" defaultValue="0" style={{ width: "100%", border: "1px solid var(--idl-border)", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", background: "var(--idl-background-soft)", color: "var(--idl-text)", boxSizing: "border-box" }} />
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Prazo</label>
          <input name="deadline" type="date" style={{ width: "100%", border: "1px solid var(--idl-border)", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", background: "var(--idl-background-soft)", color: "var(--idl-text)", boxSizing: "border-box" }} />
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", paddingTop: "8px" }}>
          <Link href="/challenges" className="btn-outline">Cancelar</Link>
          <button type="submit" className="btn-primary">Criar desafio</button>
        </div>
      </form>
    </div>
  );
}
