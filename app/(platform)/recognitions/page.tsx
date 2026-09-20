import { requireSession } from "@/lib/auth/session";
import { getRecognitions, deleteRecognitionAction } from "@/domains/recognitions/actions";
import { Award, Plus } from "lucide-react";
import Link from "next/link";

async function deleteRecognition(formData: FormData) {
  "use server";
  await deleteRecognitionAction(formData);
}

export default async function RecognitionsPage() {
  const session = await requireSession();
  const isAdmin = session.role === "instituto";
  const rows = await getRecognitions();

  return (
    <div className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>Reconhecimentos</h1>
          <p style={{ fontSize: "14px", color: "var(--idl-text-muted)" }}>
            Reconhecimentos concedidos pelo Instituto — {rows.length} no total
          </p>
        </div>
        {isAdmin && (
          <Link href="/recognitions/new" className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px" }}>
            <Plus size={15} /> Novo reconhecimento
          </Link>
        )}
      </div>

      {rows.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "64px 24px" }}>
          <Award size={36} style={{ margin: "0 auto 16px", color: "var(--idl-text-muted)" }} />
          <p style={{ fontWeight: 600, marginBottom: "8px" }}>Nenhum reconhecimento registrado</p>
          {isAdmin && (
            <Link href="/recognitions/new" className="btn-primary" style={{ fontSize: "13px", padding: "9px 18px", display: "inline-block", marginTop: "12px" }}>
              Criar primeiro reconhecimento
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {rows.map((rec) => (
            <div key={rec.id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <Award size={18} style={{ color: "var(--idl-magenta)" }} />
                    <span style={{ fontWeight: 700, fontSize: "15px" }}>{rec.title}</span>
                    {rec.points > 0 && (
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--idl-magenta)" }}>{rec.points} pts</span>
                    )}
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--idl-text-muted)", marginBottom: "4px" }}>
                    Para: <strong>{rec.recipientName}</strong>
                  </p>
                  <p style={{ fontSize: "13px", color: "var(--idl-text)", lineHeight: "1.5" }}>{rec.reason}</p>
                  <p style={{ fontSize: "11px", color: "var(--idl-text-muted)", marginTop: "8px" }}>
                    {new Date(rec.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                {isAdmin && (
                  <form action={deleteRecognition} style={{ marginLeft: "16px" }}>
                    <input type="hidden" name="recognitionId" value={rec.id} />
                    <button type="submit" className="btn-outline" style={{ fontSize: "12px", padding: "5px 10px", color: "#ef4444", borderColor: "#ef4444" }}>
                      Excluir
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
