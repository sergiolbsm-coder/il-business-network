import { requireRole } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { connections, solutions, demands, organizations } from "@/db/schema";
import { eq, count, inArray } from "drizzle-orm";
import { TrendingUp, Link as LinkIcon, Package, CheckCircle } from "lucide-react";
import Link from "next/link";

export default async function PartnerDashboardPage() {
  const session = await requireRole(["parceiro"]);

  const myConnections = await db
    .select({ conn: connections, demand: demands })
    .from(connections)
    .leftJoin(demands, eq(connections.demandId, demands.id))
    .where(eq(connections.partnerOrganizationId, session.organizationId));

  const [solCount] = await db
    .select({ total: count() })
    .from(solutions)
    .where(eq(solutions.organizationId, session.organizationId));

  const authorized = myConnections.filter((c) => ["autorizada", "contato_liberado"].includes(c.conn.status));
  const pending = myConnections.filter((c) => c.conn.status === "aguardando_autorizacao");

  return (
    <div className="page-container">
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>Meu desempenho</h1>
        <p style={{ fontSize: "14px", color: "var(--idl-text-muted)" }}>{session.organizationName}</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "28px" }}>
        {[
          { icon: <Package size={16} color="#4F46E5" />, value: solCount?.total ?? 0, label: "Soluções ativas", bg: "rgba(79,70,229,.08)", href: "/partner/solutions" },
          { icon: <LinkIcon size={16} color="var(--idl-magenta)" />, value: myConnections.length, label: "Manifestações", bg: "rgba(255,0,96,.08)", href: "/partner/proposals" },
          { icon: <TrendingUp size={16} color="#F59E0B" />, value: pending.length, label: "Aguardando resposta", bg: "rgba(245,158,11,.08)", href: "/partner/proposals" },
          { icon: <CheckCircle size={16} color="#10B981" />, value: authorized.length, label: "Contatos liberados", bg: "rgba(16,185,129,.08)", href: "/partner/proposals" },
        ].map((s) => (
          <Link key={s.label} href={s.href} style={{ textDecoration: "none" }}>
            <div className="card" style={{ textAlign: "center", cursor: "pointer" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                {s.icon}
              </div>
              <div style={{ fontSize: "24px", fontWeight: 800 }}>{s.value}</div>
              <div style={{ fontSize: "11px", color: "var(--idl-text-muted)", marginTop: "2px" }}>{s.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "24px" }}>
        {/* Últimas manifestações */}
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>Últimas manifestações de interesse</h2>
          {myConnections.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "40px 24px" }}>
              <p style={{ color: "var(--idl-text-muted)", marginBottom: "16px" }}>
                Você ainda não manifestou interesse em nenhuma demanda.
              </p>
              <Link href="/partner/opportunities" className="btn-primary" style={{ fontSize: "13px", padding: "9px 18px" }}>
                Ver oportunidades
              </Link>
            </div>
          ) : (
            myConnections.slice(0, 5).map(({ conn, demand }) => (
              <div key={conn.id} className="card" style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "14px", marginBottom: "4px" }}>
                      {demand?.category ?? "Demanda"} · {demand?.region ?? ""}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--idl-text-muted)" }}>
                      {new Date(conn.createdAt).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                  <span className={`badge ${conn.status === "contato_liberado" ? "badge-success" : conn.status === "aguardando_autorizacao" ? "badge-warning" : "badge-muted"}`}>
                    {conn.status === "aguardando_autorizacao" ? "Aguardando" : conn.status === "autorizada" ? "Autorizada" : conn.status === "contato_liberado" ? "Contato liberado" : conn.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Ações */}
        <div>
          <div className="callout">
            <div style={{ fontSize: "11px", color: "var(--idl-magenta)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>Ações rápidas</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Link href="/partner/opportunities" className="btn-primary" style={{ fontSize: "13px", padding: "9px 16px", textAlign: "center" }}>
                Ver oportunidades B2B
              </Link>
              <Link href="/partner/solutions" className="btn-outline" style={{ fontSize: "13px", padding: "9px 16px", textAlign: "center" }}>
                Minhas soluções
              </Link>
              <Link href="/partner/proposals" className="btn-outline" style={{ fontSize: "13px", padding: "9px 16px", textAlign: "center" }}>
                Ver propostas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
