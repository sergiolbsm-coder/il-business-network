import { requireSession } from "@/lib/auth/session";
import { requireRole } from "@/lib/authorization";
import { db } from "@/lib/db";
import { demands, organizations } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import Link from "next/link";
import { Eye, Clock } from "lucide-react";

const PENDING_STATUSES = ["enviada", "em_qualificacao"] as const;

export default async function AdminDemandsPage() {
  const session = await requireSession();
  requireRole(
    { userId: session.userId, organizationId: session.organizationId, role: session.role, isAdmin: session.isAdmin },
    "instituto"
  );

  const pendingDemands = await db
    .select({ demand: demands, company: organizations })
    .from(demands)
    .innerJoin(organizations, eq(organizations.id, demands.organizationId))
    .orderBy(demands.createdAt);

  const pending = pendingDemands.filter((d) => PENDING_STATUSES.includes(d.demand.status as any));
  const published = pendingDemands.filter((d) => d.demand.status === "recomendacoes_publicadas" || d.demand.status === "conexao_autorizada");

  return (
    <div className="page-container">
      <h1 className="page-title">Gestão de demandas</h1>
      <p className="page-subtitle">Qualifique, publique e acompanhe todas as demandas da rede.</p>

      {/* Pendentes de qualificação */}
      <section style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, margin: 0 }}>Aguardando qualificação</h2>
          {pending.length > 0 && (
            <span className="badge" style={{ fontSize: "10px" }}>{pending.length}</span>
          )}
        </div>

        {pending.length === 0 ? (
          <div style={{ color: "var(--idl-text-muted)", fontSize: "14px", padding: "16px", background: "var(--idl-background-soft)", borderRadius: "var(--r-sm)" }}>
            Nenhuma demanda pendente de qualificação.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {pending.map(({ demand, company }) => (
              <div key={demand.id} className="card" style={{ display: "flex", alignItems: "center", gap: "16px", borderLeft: "3px solid var(--idl-magenta)" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "4px", alignItems: "center" }}>
                    <span className="badge">{demand.category}</span>
                    <span style={{ fontSize: "11px", color: "var(--idl-text-muted)" }}>
                      {company.name}
                    </span>
                    {demand.urgency === "alta" && (
                      <span style={{ fontSize: "11px", color: "#dc2626", fontWeight: 600 }}>⚡ Urgente</span>
                    )}
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: 600 }}>{demand.title}</div>
                  <div style={{ fontSize: "12px", color: "var(--idl-text-muted)", marginTop: "2px" }}>
                    {demand.region} · Criado em {new Date(demand.createdAt).toLocaleDateString("pt-BR")}
                  </div>
                </div>
                <Link
                  href={`/admin/demands/${demand.id}/qualify`}
                  className="btn-primary"
                  style={{ padding: "9px 18px", fontSize: "13px", whiteSpace: "nowrap" }}
                >
                  Qualificar
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Publicadas */}
      <section>
        <h2 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>Demandas publicadas</h2>
        {published.length === 0 ? (
          <div style={{ color: "var(--idl-text-muted)", fontSize: "14px", padding: "16px", background: "var(--idl-background-soft)", borderRadius: "var(--r-sm)" }}>
            Nenhuma demanda publicada ainda.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {published.map(({ demand, company }) => (
              <div key={demand.id} className="card" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
                    <span className="badge badge-green" style={{ fontSize: "10px" }}>
                      {demand.status === "conexao_autorizada" ? "Conexão autorizada" : "Publicada"}
                    </span>
                    <span className="badge badge-purple" style={{ fontSize: "10px" }}>{demand.category}</span>
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: 600 }}>{demand.title}</div>
                  <div style={{ fontSize: "12px", color: "var(--idl-text-muted)", marginTop: "2px" }}>
                    {company.name} · {demand.region}
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
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
