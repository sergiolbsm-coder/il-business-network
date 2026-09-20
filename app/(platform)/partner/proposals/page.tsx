import { requireRole } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { connections, demands } from "@/db/schema";
import { eq } from "drizzle-orm";
import { FileText } from "lucide-react";
import Link from "next/link";

const STATUS_LABELS: Record<string, string> = {
  solicitada: "Solicitada",
  aguardando_autorizacao: "Aguardando autorização",
  autorizada: "Autorizada",
  contato_liberado: "Contato liberado",
  encerrada: "Encerrada",
  recusada: "Recusada",
};
const STATUS_CLASS: Record<string, string> = {
  aguardando_autorizacao: "badge-warning",
  autorizada: "badge-success",
  contato_liberado: "badge-success",
  encerrada: "badge-muted",
  recusada: "badge-error",
};

export default async function PartnerProposalsPage() {
  const session = await requireRole(["parceiro"]);

  const rows = await db
    .select({ conn: connections, demand: demands })
    .from(connections)
    .leftJoin(demands, eq(connections.demandId, demands.id))
    .where(eq(connections.partnerOrganizationId, session.organizationId))
    .orderBy(connections.createdAt);

  return (
    <div className="page-container">
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>Propostas</h1>
        <p style={{ fontSize: "14px", color: "var(--idl-text-muted)" }}>
          Manifestações de interesse que você enviou para demandas da rede
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "64px 24px" }}>
          <FileText size={36} style={{ margin: "0 auto 16px", color: "var(--idl-text-muted)" }} />
          <p style={{ fontWeight: 600, marginBottom: "8px" }}>Nenhuma proposta enviada</p>
          <p style={{ fontSize: "14px", color: "var(--idl-text-muted)", marginBottom: "20px" }}>
            Manifeste interesse nas oportunidades B2B para ver suas propostas aqui.
          </p>
          <Link href="/partner/opportunities" className="btn-primary" style={{ fontSize: "13px", padding: "9px 18px" }}>
            Ver oportunidades
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {rows.map(({ conn, demand }) => (
            <div key={conn.id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <span style={{ fontWeight: 600, fontSize: "15px" }}>
                      {demand?.category ?? "Demanda"} · {demand?.region ?? ""}
                    </span>
                    <span className={`badge ${STATUS_CLASS[conn.status] ?? "badge-info"}`}>
                      {STATUS_LABELS[conn.status] ?? conn.status}
                    </span>
                  </div>
                  {conn.interestMessage && (
                    <p style={{ fontSize: "13px", color: "var(--idl-text-muted)", lineHeight: "1.5", marginBottom: "8px" }}>
                      <em>"{conn.interestMessage}"</em>
                    </p>
                  )}
                  <div style={{ fontSize: "12px", color: "var(--idl-text-muted)" }}>
                    Enviado em {new Date(conn.createdAt).toLocaleDateString("pt-BR")}
                    {conn.contactRevealedAt && ` · Contato liberado em ${new Date(conn.contactRevealedAt).toLocaleDateString("pt-BR")}`}
                  </div>
                </div>
                {conn.status === "contato_liberado" && (
                  <div className="callout" style={{ marginLeft: "16px", padding: "12px 16px", minWidth: "180px" }}>
                    <div style={{ fontSize: "11px", color: "var(--idl-magenta)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>
                      Contato liberado
                    </div>
                    <div style={{ fontSize: "12px" }}>
                      Entre em contato com a empresa para avançar a proposta.
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
