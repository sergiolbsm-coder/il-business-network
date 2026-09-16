import { requireSession } from "@/lib/auth/session";
import { getDemandById, submitDemandVoidAction, getConnectionsForDemand, authorizeConnectionVoidAction } from "@/domains/opportunities/actions";
import { requireRole } from "@/lib/authorization";
import { ArrowLeft, Send, CheckCircle, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const STATUS_LABELS: Record<string, string> = {
  rascunho:                "Rascunho",
  enviada:                 "Aguardando qualificação",
  em_qualificacao:         "Em qualificação",
  em_matching:             "Em matching",
  recomendacoes_publicadas:"Publicada para parceiros",
  conexao_autorizada:      "Conexão autorizada",
  proposta:                "Proposta recebida",
  ganha:                   "Fechada",
  perdida:                 "Perdida",
  cancelada:               "Cancelada",
};

const STATUS_STEPS = [
  "rascunho",
  "enviada",
  "em_qualificacao",
  "recomendacoes_publicadas",
  "conexao_autorizada",
];

export default async function DemandDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireSession();

  const data = await getDemandById(id);
  if (!data) notFound();

  const { demand, company } = data as any;

  // Conexões — só empresa e instituto veem
  let connections: any[] = [];
  if (session.role === "empresa" || session.role === "instituto") {
    try {
      connections = await getConnectionsForDemand(id);
    } catch {}
  }

  const currentStep = STATUS_STEPS.indexOf(demand.status);

  return (
    <div className="page-container" style={{ maxWidth: "860px" }}>
      <Link href="/demands" className="btn-secondary" style={{ marginBottom: "24px", display: "inline-flex" }}>
        <ArrowLeft size={16} /> Voltar
      </Link>

      {/* Status pipeline */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
          {STATUS_STEPS.map((step, i) => {
            const done = i <= currentStep;
            const active = i === currentStep;
            return (
              <div key={step} style={{ flex: 1, display: "flex", alignItems: "center" }}>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: done ? "var(--idl-gradient)" : "var(--idl-border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 6px",
                      border: active ? "2px solid var(--idl-magenta)" : "none",
                      fontSize: "12px",
                      color: done ? "#FBF9FF" : "var(--idl-text-muted)",
                      fontWeight: 700,
                    }}
                  >
                    {done ? "✓" : i + 1}
                  </div>
                  <div style={{ fontSize: "10px", color: done ? "var(--idl-text)" : "var(--idl-text-muted)", fontWeight: done ? 600 : 400, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em" }}>
                    {STATUS_LABELS[step]?.split(" ")[0]}
                  </div>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div style={{ height: "2px", flex: 0.5, background: i < currentStep ? "var(--idl-magenta)" : "var(--idl-border)" }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px" }}>
        {/* Detalhes */}
        <div>
          <div className="card" style={{ marginBottom: "16px" }}>
            <div style={{ marginBottom: "16px" }}>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "26px", fontWeight: 700, color: "var(--idl-purple-dark)", margin: "0 0 8px" }}>
                {demand.title}
              </h1>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <span className="badge">{demand.category}</span>
                <span className="badge badge-purple">{demand.region}</span>
                {demand.urgency === "alta" && <span className="badge" style={{ color: "#dc2626", background: "rgba(220,38,38,.07)" }}>⚡ Urgente</span>}
              </div>
            </div>

            <p style={{ fontSize: "14px", lineHeight: "1.7", color: "var(--idl-text)", whiteSpace: "pre-wrap" }}>
              {demand.description}
            </p>

            {demand.budgetRange && (
              <div style={{ marginTop: "16px", padding: "12px 16px", background: "var(--idl-background-soft)", borderRadius: "var(--r-sm)" }}>
                <div style={{ fontSize: "11px", color: "var(--idl-text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>
                  Faixa de investimento
                </div>
                <div style={{ fontSize: "14px", fontWeight: 600 }}>{demand.budgetRange}</div>
              </div>
            )}
          </div>

          {/* Ações */}
          {demand.status === "rascunho" && (session.role === "empresa" || session.role === "instituto") && (
            <form action={submitDemandVoidAction.bind(null, id)}>
              <button type="submit" className="btn-primary">
                <Send size={16} /> Enviar para qualificação
              </button>
            </form>
          )}

          {/* Instituto: qualificar */}
          {demand.status === "enviada" && session.role === "instituto" && (
            <a href={`/admin/demands/${id}/qualify`} className="btn-primary">
              Qualificar demanda
            </a>
          )}
        </div>

        {/* Sidebar */}
        <div>
          {/* Info empresa (só para instituto) */}
          {session.role === "instituto" && company && (
            <div className="card" style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "11px", color: "var(--idl-text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>
                Empresa
              </div>
              <div style={{ fontWeight: 700 }}>{company.name}</div>
              {company.website && (
                <div style={{ fontSize: "12px", color: "var(--idl-text-muted)", marginTop: "4px" }}>{company.website}</div>
              )}
            </div>
          )}

          {/* Conexões */}
          {connections.length > 0 && (
            <div className="card">
              <div style={{ fontSize: "11px", color: "var(--idl-text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>
                Manifestações de interesse ({connections.length})
              </div>

              {connections.map((c: any) => (
                <div key={c.connection.id} style={{ padding: "12px 0", borderBottom: "1px solid var(--idl-border)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                    <div style={{ fontWeight: 600, fontSize: "13px" }}>
                      {c.connection.status === "aguardando_autorizacao" && session.role === "empresa"
                        ? "Parceiro (anonimizado)"
                        : c.partner.name}
                    </div>
                    <span className={`badge ${c.connection.status === "contato_liberado" ? "badge-green" : ""}`} style={{ fontSize: "9px" }}>
                      {c.connection.status === "aguardando_autorizacao" ? "Aguardando" :
                       c.connection.status === "contato_liberado" ? "Autorizado" :
                       c.connection.status === "recusada" ? "Recusada" : c.connection.status}
                    </span>
                  </div>

                  {c.connection.interestMessage && (
                    <p style={{ fontSize: "12px", color: "var(--idl-text-muted)", lineHeight: "1.5", margin: "0 0 8px" }}>
                      {c.connection.interestMessage}
                    </p>
                  )}

                  {c.connection.status === "aguardando_autorizacao" && (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <form action={authorizeConnectionVoidAction.bind(null, c.connection.id, true)}>
                        <button type="submit" className="btn-primary" style={{ padding: "7px 14px", fontSize: "12px" }}>
                          <CheckCircle size={13} /> Autorizar
                        </button>
                      </form>
                      <form action={authorizeConnectionVoidAction.bind(null, c.connection.id, false)}>
                        <button type="submit" className="btn-danger" style={{ padding: "7px 14px", fontSize: "12px" }}>
                          <XCircle size={13} /> Recusar
                        </button>
                      </form>
                    </div>
                  )}

                  {c.connection.status === "contato_liberado" && (
                    <div style={{ fontSize: "12px", background: "rgba(5,150,105,.06)", border: "1px solid rgba(5,150,105,.2)", borderRadius: "6px", padding: "8px 12px", color: "#059669" }}>
                      ✓ Contato revelado em {new Date(c.connection.contactRevealedAt).toLocaleDateString("pt-BR")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
