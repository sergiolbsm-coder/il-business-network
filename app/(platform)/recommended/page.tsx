import { requireRole } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { demands, connections, solutions, organizations } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { Star, Package } from "lucide-react";
import Link from "next/link";

export default async function RecommendedPage() {
  const session = await requireRole(["empresa"]);

  // Demandas da empresa com recomendações publicadas
  const activeDemands = await db
    .select()
    .from(demands)
    .where(
      and(
        eq(demands.organizationId, session.organizationId),
        inArray(demands.status, ["recomendacoes_publicadas", "conexao_autorizada", "em_matching"])
      )
    );

  // Conexões autorizadas (parceiros liberados)
  const authorizedConnections = await db
    .select({ conn: connections, orgName: organizations.name })
    .from(connections)
    .leftJoin(organizations, eq(connections.partnerOrganizationId, organizations.id))
    .where(
      and(
        inArray(connections.demandId, activeDemands.map((d) => d.id)),
        inArray(connections.status, ["contato_liberado", "autorizada"])
      )
    );

  // Soluções ativas de parceiros
  const allSolutions = await db
    .select({ solution: solutions, orgName: organizations.name })
    .from(solutions)
    .leftJoin(organizations, eq(solutions.organizationId, organizations.id))
    .where(eq(solutions.status, "ativa"));

  return (
    <div className="page-container">
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>Soluções recomendadas</h1>
        <p style={{ fontSize: "14px", color: "var(--idl-text-muted)" }}>
          Parceiros e soluções indicados pelo Instituto para os seus desafios
        </p>
      </div>

      {/* Conexões autorizadas */}
      {authorizedConnections.length > 0 && (
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Star size={16} color="var(--idl-magenta)" /> Parceiros liberados para contato
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {authorizedConnections.map(({ conn, orgName }) => (
              <div key={conn.id} className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "4px" }}>{orgName}</div>
                    <div style={{ fontSize: "13px", color: "var(--idl-text-muted)" }}>
                      Contato liberado pelo Instituto · Parceiro qualificado
                    </div>
                  </div>
                  <span className="badge badge-success">Contato liberado</span>
                </div>
                {conn.interestMessage && (
                  <p style={{ fontSize: "13px", marginTop: "12px", padding: "12px", background: "var(--idl-background-soft)", borderRadius: "8px", lineHeight: "1.5" }}>
                    "{conn.interestMessage}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Soluções disponíveis na rede */}
      <div>
        <h2 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Package size={16} /> Soluções disponíveis na rede
        </h2>

        {allSolutions.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
            <Star size={32} style={{ margin: "0 auto 12px", color: "var(--idl-text-muted)" }} />
            <p style={{ color: "var(--idl-text-muted)" }}>
              Nenhuma solução disponível ainda. Publique seus desafios para receber recomendações.
            </p>
            <Link href="/demands/new" className="btn-primary" style={{ fontSize: "13px", padding: "9px 18px", display: "inline-block", marginTop: "16px" }}>
              Publicar desafio
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
            {allSolutions.map(({ solution, orgName }) => (
              <div key={solution.id} className="card">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span className="badge badge-info">{solution.category}</span>
                  <span style={{ fontSize: "11px", color: "var(--idl-text-muted)" }}>{solution.region}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "6px" }}>{solution.title}</div>
                <div style={{ fontSize: "12px", color: "var(--idl-magenta)", marginBottom: "8px", fontWeight: 600 }}>{orgName}</div>
                <p style={{ fontSize: "13px", lineHeight: "1.5", color: "var(--idl-text-muted)" }}>{solution.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeDemands.length === 0 && allSolutions.length === 0 && (
        <div className="callout" style={{ marginTop: "24px" }}>
          <p style={{ fontSize: "14px" }}>
            <strong>Dica:</strong> Publique seus desafios para que o Instituto indique parceiros qualificados para você.
          </p>
          <Link href="/demands/new" className="btn-primary" style={{ fontSize: "13px", padding: "9px 18px", display: "inline-block", marginTop: "12px" }}>
            Criar desafio
          </Link>
        </div>
      )}
    </div>
  );
}
