import { requireRole } from "@/lib/auth/session";
import { createRecognitionAction } from "@/domains/recognitions/actions";
import Link from "next/link";

export default async function NewRecognitionPage() {
  await requireRole(["instituto"]);

  return (
    <div className="page-container" style={{ maxWidth: "640px" }}>
      <div style={{ marginBottom: "24px" }}>
        <Link href="/recognitions" style={{ fontSize: "13px", color: "var(--idl-text-muted)", textDecoration: "none" }}>
          ← Reconhecimentos
        </Link>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginTop: "8px" }}>Novo reconhecimento</h1>
      </div>

      <form action={createRecognitionAction} className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Reconhecido *</label>
          <input name="recipientName" required placeholder="Nome da pessoa ou organização" style={{ width: "100%", border: "1px solid var(--idl-border)", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", background: "var(--idl-background-soft)", color: "var(--idl-text)", boxSizing: "border-box" }} />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Título do reconhecimento *</label>
          <input name="title" required placeholder="Ex: Liderança Exemplar 2024" style={{ width: "100%", border: "1px solid var(--idl-border)", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", background: "var(--idl-background-soft)", color: "var(--idl-text)", boxSizing: "border-box" }} />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Motivo *</label>
          <textarea name="reason" required rows={3} placeholder="Descreva o motivo do reconhecimento..." style={{ width: "100%", border: "1px solid var(--idl-border)", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", background: "var(--idl-background-soft)", color: "var(--idl-text)", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }} />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Pontos</label>
          <input name="points" type="number" min="0" defaultValue="0" style={{ width: "100%", border: "1px solid var(--idl-border)", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", background: "var(--idl-background-soft)", color: "var(--idl-text)", boxSizing: "border-box" }} />
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", paddingTop: "8px" }}>
          <Link href="/recognitions" className="btn-outline">Cancelar</Link>
          <button type="submit" className="btn-primary">Criar reconhecimento</button>
        </div>
      </form>
    </div>
  );
}
