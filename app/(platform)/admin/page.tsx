import { requireRole } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { demands, organizations, connections, users } from "@/db/schema";
import { count, eq, inArray } from "drizzle-orm";
import { FileText, Building2, Users, TrendingUp, Package, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

export default async function AdminOverviewPage() {
  await requireRole(["instituto"]);

  const [demandCount] = await db.select({ total: count() }).from(demands);
  const [empresaCount] = await db.select({ total: count() }).from(organizations).where(eq(organizations.type, "empresa"));
  const [parceiroCount] = await db.select({ total: count() }).from(organizations).where(eq(organizations.type, "parceiro"));
  const [connectionCount] = await db.select({ total: count() }).from(connections);
  const [userCount] = await db.select({ total: count() }).from(users);

  const pendingDemands = await db
    .select()
    .from(demands)
    .where(inArray(demands.status, ["enviada", "em_qualificacao"]))
    .orderBy(demands.createdAt)
    .limit(5);

  const STATUS_LABELS: Record<string, string> = {
    enviada: "Enviada",
    em_qualificacao: "Em qualificação",
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>Visão geral</h1>
        <p style={{ fontSize: "14px", color: "var(--idl-text-muted)" }}>Painel de gestão do Instituto da Liderança</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px", marginBottom: "28px" }}>
        {[
          { icon: <FileText size={16} color="var(--idl-magenta)" />, value: demandCount?.total ?? 0, label: "Demandas", bg: "rgba(255,0,96,.08)" },
          { icon: <Building2 size={16} color="#4F46E5" />, value: empresaCount?.total ?? 0, label: "Empresas", bg: "rgba(79,70,229,.08)" },
          { icon: <Package size={16} color="#0EA5E9" />, value: parceiroCount?.total ?? 0, label: "Parceiros", bg: "rgba(14,165,233,.08)" },
          { icon: <LinkIcon size={16} color="#10B981" />, value: connectionCount?.total ?? 0, label: "Conexões", bg: "rgba(16,185,129,.08)" },
          { icon: <Users size={16} color="#F59E0B" />, value: userCount?.total ?? 0, label: "Usuários", bg: "rgba(245,158,11,.08)" },
        ].map((stat) => (
          <div key={stat.label} className="card" style={{ textAlign: "center", padding: "16px 12px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
              {stat.icon}
            </div>
            <div style={{ fontSize: "24px", fontWeight: 800 }}>{stat.value}</div>
            <div style={{ fontSize: "11px", color: "var(--idl-text-muted)", marginTop: "2px" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "24px" }}>
        {/* Demandas pendentes */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700 }}>Demandas aguardando qualificação</h2>
            <Link href="/admin/demands" style={{ fontSize: "13px", color: "var(--idl-magenta)", textDecoration: "none" }}>Ver todas →</Link>
          </div>

          {pendingDemands.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "40px 24px" }}>
              <p style={{ color: "var(--idl-text-muted)" }}>Nenhuma demanda pendente. Ótimo trabalho! ✓</p>
            </div>
          ) : (
            pendingDemands.map((demand) => (
              <Link key={demand.id} href={`/admin/demands/${demand.id}/qualify`} style={{ textDecoration: "none", display: "block", marginBottom: "10px" }}>
                <div className="card" style={{ cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "14px", marginBottom: "4px" }}>{demand.title}</div>
                      <div style={{ fontSize: "12px", color: "var(--idl-text-muted)" }}>{demand.category} · {demand.region}</div>
                    </div>
                    <span className="badge badge-warning">{STATUS_LABELS[demand.status] ?? demand.status}</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Ações rápidas */}
        <div>
          <div className="callout" style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "11px", color: "var(--idl-magenta)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>Gestão</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Link href="/admin/demands" className="btn-primary" style={{ fontSize: "13px", padding: "9px 16px", textAlign: "center" }}>
                Qualificar demandas
              </Link>
              <Link href="/admin/talents" className="btn-outline" style={{ fontSize: "13px", padding: "9px 16px", textAlign: "center" }}>
                Talentos e vagas
              </Link>
              <Link href="/admin/partners" className="btn-outline" style={{ fontSize: "13px", padding: "9px 16px", textAlign: "center" }}>
                Soluções e parceiros
              </Link>
              <Link href="/events/new" className="btn-outline" style={{ fontSize: "13px", padding: "9px 16px", textAlign: "center" }}>
                Criar evento
              </Link>
              <Link href="/content/new" className="btn-outline" style={{ fontSize: "13px", padding: "9px 16px", textAlign: "center" }}>
                Publicar conteúdo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
