import { requireRole } from "@/lib/auth/session";
import { getJobs, deleteJobAction, updateJobStatusAction } from "@/domains/jobs/actions";
import { Briefcase, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

const TYPE_LABELS: Record<string, string> = { clt: "CLT", pj: "PJ", estagio: "Estágio", freelance: "Freelance" };
const STATUS_CLASS: Record<string, string> = { rascunho: "badge-muted", publicada: "badge-success", encerrada: "badge-error" };

async function deleteJob(formData: FormData) {
  "use server";
  await deleteJobAction(String(formData.get("jobId")));
}
async function archiveJob(formData: FormData) {
  "use server";
  await updateJobStatusAction(String(formData.get("jobId")), "encerrada");
}
async function publishJob(formData: FormData) {
  "use server";
  await updateJobStatusAction(String(formData.get("jobId")), "publicada");
}

export default async function AdminTalentsPage() {
  await requireRole(["instituto"]);
  const rows = await getJobs();

  return (
    <div className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>Talentos e vagas</h1>
          <p style={{ fontSize: "14px", color: "var(--idl-text-muted)" }}>
            Todas as vagas da rede — {rows.length} no total
          </p>
        </div>
        <Link href="/jobs/new" className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px" }}>
          <Plus size={15} /> Nova vaga
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "64px 24px" }}>
          <Briefcase size={36} style={{ margin: "0 auto 16px", color: "var(--idl-text-muted)" }} />
          <p style={{ color: "var(--idl-text-muted)" }}>Nenhuma vaga cadastrada pelas empresas ainda.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {rows.map(({ job, orgName }) => (
            <div key={job.id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ fontWeight: 700, fontSize: "15px" }}>{job.title}</span>
                    <span className={`badge ${STATUS_CLASS[job.status] ?? "badge-muted"}`}>
                      {job.status === "publicada" ? "Publicada" : job.status === "encerrada" ? "Encerrada" : "Rascunho"}
                    </span>
                    <span className="badge badge-info">{TYPE_LABELS[job.type] ?? job.type}</span>
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--idl-text-muted)" }}>
                    <span style={{ marginRight: "12px" }}>🏢 {orgName}</span>
                    <span style={{ marginRight: "12px" }}>📁 {job.department}</span>
                    <span>📍 {job.location}</span>
                    {job.salaryRange && <span style={{ marginLeft: "12px" }}>💰 {job.salaryRange}</span>}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px", marginLeft: "16px" }}>
                  {job.status === "publicada" ? (
                    <form action={archiveJob}>
                      <input type="hidden" name="jobId" value={job.id} />
                      <button type="submit" className="btn-outline" style={{ fontSize: "12px", padding: "6px 12px", display: "flex", alignItems: "center", gap: "4px" }}>
                        <EyeOff size={13} /> Encerrar
                      </button>
                    </form>
                  ) : (
                    <form action={publishJob}>
                      <input type="hidden" name="jobId" value={job.id} />
                      <button type="submit" className="btn-primary" style={{ fontSize: "12px", padding: "6px 12px", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Eye size={13} /> Publicar
                      </button>
                    </form>
                  )}
                  <form action={deleteJob}>
                    <input type="hidden" name="jobId" value={job.id} />
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
