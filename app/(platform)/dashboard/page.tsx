import { requireRole } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { demands, jobs, connections } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { Building2, FileText, Briefcase, Star, TrendingUp, Plus } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await requireRole(["empresa"]);

  const [demandCount] = await db
    .select({ total: count() })
    .from(demands)
    .where(eq(demands.organizationId, session.organizationId));

  const [jobCount] = await db
    .select({ total: count() })
    .from(jobs)
    .where(eq(jobs.organizationId, session.organizationId));

  const [connectionCount] = await db
    .select({ total: count() })
    .from(connections);

  const recentDemands = await db
    .select()
    .from(demands)
    .where(eq(demands.organizationId, session.organizationId))
    .orderBy(demands.createdAt)
    .limit(5);

  const STATUS_LABELS: Record<string, string> = {
    rascunho: "Rascunho",
    enviada: "Enviada",
    em_qualificacao: "Em qualificação",
    em_matching: "Em matching",
    recomendacoes_publicadas: "Recomendações publicadas",
    conexao_autorizada: "Conexão autorizada",
    proposta: "Proposta",
    ganha: "Ganha",
    perdida: "Perdida",
    cancelada: "Cancelada",
  };

  const STATUS_CLASS: Record<string, string> = {
    rascunho: "badge-muted",
    enviada: "badge-info",
    em_qualificacao: "badge-warning",
    recomendacoes_publicadas: "badge-success",
    conexao_autorizada: "badge-success",
    ganha: "badge-success",
    perdida: "badge-error",
    cancelada: "badge-error",
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>
          Painel da empresa
        </h1>
        <p style={{ fontSize: "14px", color: "var(--idl-text-muted)" }}>
          {session.organizationName} — visão geral das suas atividades
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(255,0,96,.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <FileText size={18} color="var(--idl-magenta)" />
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--idl-navy)" }}>{demandCount?.total ?? 0}</div>
          <div style={{ fontSize: "12px", color: "var(--idl-text-muted)", marginTop: "4px" }}>Desafios publicados</div>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(79,70,229,.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <Briefcase size={18} color="#4F46E5" />
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--idl-navy)" }}>{jobCount?.total ?? 0}</div>
          <div style={{ fontSize: "12px", color: "var(--idl-text-muted)", marginTop: "4px" }}>Vagas abertas</div>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(16,185,129,.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <TrendingUp size={18} color="#10B981" />
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--idl-navy)" }}>{connectionCount?.total ?? 0}</div>
          <div style={{ fontSize: "12px", color: "var(--idl-text-muted)", marginTop: "4px" }}>Conexões ativas</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "24px" }}>
        {/* Desafios recentes */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700 }}>Desafios recentes</h2>
            <Link href="/demands/new" className="btn-primary" style={{ fontSize: "13px", padding: "8px 16px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Plus size={14} /> Novo desafio
            </Link>
          </div>

          {recentDemands.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
              <FileText size={32} style={{ margin: "0 auto 12px", color: "var(--idl-text-muted)" }} />
              <p style={{ color: "var(--idl-text-muted)", marginBottom: "16px" }}>Nenhum desafio publicado ainda</p>
              <Link href="/demands/new" className="btn-primary" style={{ fontSize: "13px", padding: "9px 18px" }}>
                Publicar primeiro desafio
              </Link>
            </div>
          ) : (
            recentDemands.map((demand) => (
              <Link key={demand.id} href={`/demands/${demand.id}`} style={{ textDecoration: "none", display: "block", marginBottom: "12px" }}>
                <div className="card" style={{ cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "15px", marginBottom: "4px" }}>{demand.title}</div>
                      <div style={{ fontSize: "13px", color: "var(--idl-text-muted)" }}>{demand.category} · {demand.region}</div>
                    </div>
                    <span className={`badge ${STATUS_CLASS[demand.status] ?? "badge-muted"}`}>
                      {STATUS_LABELS[demand.status] ?? demand.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Ações rápidas */}
        <div>
          <div className="callout" style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "11px", color: "var(--idl-magenta)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>Ações rápidas</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Link href="/demands/new" className="btn-primary" style={{ fontSize: "13px", padding: "9px 16px", textAlign: "center" }}>
                + Novo desafio
              </Link>
              <Link href="/jobs" className="btn-outline" style={{ fontSize: "13px", padding: "9px 16px", textAlign: "center" }}>
                Gerenciar vagas
              </Link>
              <Link href="/recommended" className="btn-outline" style={{ fontSize: "13px", padding: "9px 16px", textAlign: "center" }}>
                Ver soluções recomendadas
              </Link>
            </div>
          </div>

          <div className="card">
            <div style={{ fontSize: "11px", color: "var(--idl-text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>Dica</div>
            <p style={{ fontSize: "13px", lineHeight: "1.5", color: "var(--idl-text-muted)" }}>
              Publique desafios detalhados para atrair os parceiros mais qualificados da rede.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
