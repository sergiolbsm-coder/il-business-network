import { requireRole } from "@/lib/auth/session";
import { getAllSolutions, deleteSolutionAction, updateSolutionStatusAction } from "@/domains/solutions/actions";
import { db } from "@/lib/db";
import { organizations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Package, Trash2, EyeOff, Eye } from "lucide-react";

const STATUS_CLASS: Record<string, string> = { ativa: "badge-success", inativa: "badge-muted", em_revisao: "badge-warning" };

async function deleteSol(formData: FormData) {
  "use server";
  await deleteSolutionAction(String(formData.get("solutionId")));
}
async function deactivateSol(formData: FormData) {
  "use server";
  await updateSolutionStatusAction(String(formData.get("solutionId")), "inativa");
}
async function activateSol(formData: FormData) {
  "use server";
  await updateSolutionStatusAction(String(formData.get("solutionId")), "ativa");
}

export default async function AdminPartnersPage() {
  await requireRole(["instituto"]);
  const rows = await getAllSolutions();

  const parceiros = await db
    .select({ id: organizations.id, name: organizations.name })
    .from(organizations)
    .where(eq(organizations.type, "parceiro"));

  return (
    <div className="page-container">
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>Soluções e parceiros</h1>
        <p style={{ fontSize: "14px", color: "var(--idl-text-muted)" }}>
          {parceiros.length} parceiro{parceiros.length !== 1 ? "s" : ""} · {rows.length} solução{rows.length !== 1 ? "ões" : ""} cadastrada{rows.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Lista de parceiros */}
      <div style={{ marginBottom: "28px" }}>
        <h2 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "12px" }}>Parceiros da rede</h2>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {parceiros.map((p) => (
            <div key={p.id} style={{ background: "var(--idl-background-soft)", border: "1px solid var(--idl-border)", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", fontWeight: 600 }}>
              {p.name}
            </div>
          ))}
          {parceiros.length === 0 && <p style={{ color: "var(--idl-text-muted)", fontSize: "14px" }}>Nenhum parceiro cadastrado ainda.</p>}
        </div>
      </div>

      {/* Soluções */}
      <div>
        <h2 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "12px" }}>Soluções cadastradas</h2>

        {rows.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
            <Package size={32} style={{ margin: "0 auto 12px", color: "var(--idl-text-muted)" }} />
            <p style={{ color: "var(--idl-text-muted)" }}>Nenhuma solução cadastrada pelos parceiros ainda.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {rows.map(({ solution, orgName }) => (
              <div key={solution.id} className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ fontWeight: 700, fontSize: "15px" }}>{solution.title}</span>
                      <span className={`badge ${STATUS_CLASS[solution.status] ?? "badge-muted"}`}>
                        {solution.status === "ativa" ? "Ativa" : solution.status === "inativa" ? "Inativa" : "Em revisão"}
                      </span>
                      <span className="badge badge-info">{solution.category}</span>
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--idl-text-muted)", marginBottom: "6px" }}>
                      🏢 {orgName} · 📍 {solution.region}
                    </div>
                    <p style={{ fontSize: "13px", color: "var(--idl-text-muted)", lineHeight: "1.5" }}>{solution.description}</p>
                  </div>

                  <div style={{ display: "flex", gap: "8px", marginLeft: "16px" }}>
                    {solution.status === "ativa" ? (
                      <form action={deactivateSol}>
                        <input type="hidden" name="solutionId" value={solution.id} />
                        <button type="submit" className="btn-outline" style={{ fontSize: "12px", padding: "6px 12px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <EyeOff size={13} /> Desativar
                        </button>
                      </form>
                    ) : (
                      <form action={activateSol}>
                        <input type="hidden" name="solutionId" value={solution.id} />
                        <button type="submit" className="btn-primary" style={{ fontSize: "12px", padding: "6px 12px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Eye size={13} /> Ativar
                        </button>
                      </form>
                    )}
                    <form action={deleteSol}>
                      <input type="hidden" name="solutionId" value={solution.id} />
                      <button type="submit" className="btn-outline" style={{ fontSize: "12px", padding: "6px 12px", display: "flex", alignItems: "center", gap: "4px", color: "#ef4444", borderColor: "#ef4444" }}>
                        <Trash2 size={13} /> Excluir
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
