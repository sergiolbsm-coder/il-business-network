import { requireSession } from "@/lib/auth/session";
import { requireRole } from "@/lib/authorization";
import { getDemands } from "@/domains/opportunities/actions";
import { Plus, FileText, Clock, CheckCircle, Eye } from "lucide-react";
import Link from "next/link";

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  rascunho:               { label: "Rascunho",            cls: "status-rascunho" },
  enviada:                { label: "Enviada",              cls: "status-enviada" },
  em_qualificacao:        { label: "Em qualificação",      cls: "status-qualificacao" },
  em_matching:            { label: "Em matching",          cls: "status-qualificacao" },
  recomendacoes_publicadas:{ label: "Publicada",           cls: "status-publicada" },
  conexao_autorizada:     { label: "Conexão autorizada",   cls: "status-autorizada" },
  proposta:               { label: "Proposta",             cls: "status-autorizada" },
  ganha:                  { label: "Fechada",              cls: "status-publicada" },
  perdida:                { label: "Perdida",              cls: "status-rascunho" },
  cancelada:              { label: "Cancelada",            cls: "status-rascunho" },
};

const URGENCY_LABELS: Record<string, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
};

export default async function DemandsPage() {
  const session = await requireSession();
  requireRole(
    { userId: session.userId, organizationId: session.organizationId, role: session.role, isAdmin: session.isAdmin },
    "empresa", "instituto"
  );

  const demands = await getDemands();

  return (
    <div className="page-container">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h1 className="page-title">Meus desafios</h1>
          <p className="page-subtitle">
            Gerencie seus desafios organizacionais e acompanhe o status de cada um.
          </p>
        </div>
        <Link href="/demands/new" className="btn-primary">
          <Plus size={16} /> Novo desafio
        </Link>
      </div>

      {demands.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 24px",
            background: "var(--idl-white)",
            borderRadius: "var(--r)",
            border: "2px dashed var(--idl-border)",
          }}
        >
          <FileText size={48} style={{ color: "var(--idl-border)", margin: "0 auto 16px" }} />
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 700, color: "var(--idl-purple-dark)", marginBottom: "8px" }}>
            Nenhum desafio ainda
          </div>
          <p style={{ color: "var(--idl-text-muted)", marginBottom: "24px" }}>
            Crie seu primeiro desafio para que o Instituto encontre a solução ideal para você.
          </p>
          <Link href="/demands/new" className="btn-primary">
            <Plus size={16} /> Criar primeiro desafio
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {demands.map((demand: any) => {
            const statusInfo = STATUS_LABELS[demand.status] ?? { label: demand.status, cls: "status-rascunho" };
            return (
              <div key={demand.id} className="card" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <span
                      className={`badge ${statusInfo.cls}`}
                      style={{ fontSize: "10px" }}
                    >
                      {statusInfo.label}
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--idl-text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
                      {demand.category}
                    </span>
                    {demand.urgency === "alta" && (
                      <span style={{ fontSize: "11px", color: "#dc2626", fontWeight: 600 }}>
                        ⚡ Urgente
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: 600, marginBottom: "4px" }}>
                    {demand.title}
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--idl-text-muted)" }}>
                    {demand.region} · {demand.budgetRange ?? "Orçamento a definir"}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ fontSize: "12px", color: "var(--idl-text-muted)", textAlign: "right" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={12} />
                      {new Date(demand.createdAt).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                  <Link
                    href={`/demands/${demand.id}`}
                    className="btn-secondary"
                    style={{ padding: "8px 14px", fontSize: "12px" }}
                  >
                    <Eye size={14} /> Ver
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
