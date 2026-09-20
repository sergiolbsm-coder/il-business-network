import { requireRole } from "@/lib/auth/session";
import { getMySolutions, deleteSolutionAction, updateSolutionStatusAction } from "@/domains/solutions/actions";
import { Package, Plus, Trash2, EyeOff, Eye } from "lucide-react";
import Link from "next/link";

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

export default async function PartnerSolutionsPage() {
  const session = await requireRole(["parceiro"]);
  const rows = await getMySolutions();

  return (
    <div className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>Minhas soluções</h1>
          <p style={{ fontSize: "14px", color: "var(--idl-text-muted)" }}>
            {rows.length} solução{rows.length !== 1 ? "ões" : ""} cadastrada{rows.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/partner/solutions/new" className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px" }}>
          <Plus size={15} /> Nova solução
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "64px 24px" }}>
          <Package size={36} style={{ margin: "0 auto 16px", color: "var(--idl-text-muted)" }} />
          <p style={{ fontWeight: 600, marginBottom: "8px" }}>Nenhuma solução cadastrada</p>
          <p style={{ fontSize: "14px", color: "var(--idl-text-muted)", marginBottom: "20px" }}>
            Cadastre suas soluções para aparecer nas recomendações do Instituto.
          </p>
          <Link href="/partner/solutions/new" className="btn-primary" style={{ fontSize: "13px", padding: "9px 18px" }}>
            Cadastrar primeira solução
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {rows.map(({ solution }) => (
            <div key={solution.id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <span style={{ fontWeight: 700, fontSize: "15px" }}>{solution.title}</span>
                    <span className={`badge ${STATUS_CLASS[solution.status] ?? "badge-muted"}`}>
                      {solution.status === "ativa" ? "Ativa" : solution.status === "inativa" ? "Inativa" : "Em revisão"}
                    </span>
                    <span className="badge badge-info">{solution.category}</span>
                    <span style={{ fontSize: "12px", color: "var(--idl-text-muted)" }}>📍 {solution.region}</span>
                  </div>
                  <p style={{ fontSize: "14px", lineHeight: "1.5", color: "var(--idl-text-muted)" }}>{solution.description}</p>
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
  );
}
