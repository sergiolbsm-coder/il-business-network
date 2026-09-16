import { requireSession } from "@/lib/auth/session";
import { requireRole } from "@/lib/authorization";
import { getDemandById, expressInterestAction } from "@/domains/opportunities/actions";
import { FormAction } from "@/components/ui/FormAction";
import { db } from "@/lib/db";
import { connections } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { ArrowLeft, Lock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PartnerOpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireSession();
  requireRole(
    { userId: session.userId, organizationId: session.organizationId, role: session.role, isAdmin: session.isAdmin },
    "parceiro"
  );

  const data = await getDemandById(id);
  if (!data) notFound();

  const { demand } = data as any;

  // Verificar se já manifestou interesse
  const [existingConnection] = await db
    .select()
    .from(connections)
    .where(
      and(
        eq(connections.demandId, id),
        eq(connections.partnerOrganizationId, session.organizationId)
      )
    )
    .limit(1);

  const expressInterest = expressInterestAction.bind(null, id);

  return (
    <div className="page-container" style={{ maxWidth: "720px" }}>
      <Link
        href="/partners/opportunities"
        className="btn-secondary"
        style={{ marginBottom: "24px", display: "inline-flex" }}
      >
        <ArrowLeft size={16} /> Voltar às oportunidades
      </Link>

      {/* Cabeçalho anonimizado */}
      <div
        style={{
          background: "rgba(57,22,148,.04)",
          border: "1px solid var(--idl-border)",
          borderRadius: "var(--r)",
          padding: "16px 20px",
          marginBottom: "24px",
          display: "flex",
          gap: "12px",
          alignItems: "center",
        }}
      >
        <Lock size={16} style={{ color: "var(--idl-purple)", flexShrink: 0 }} />
        <div style={{ fontSize: "13px", color: "var(--idl-text-muted)" }}>
          <strong>Empresa não identificada.</strong> A identidade será revelada somente após autorização mútua pelo Instituto e pela empresa.
        </div>
      </div>

      {/* Detalhes da demanda */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
          <span className="badge">{demand.category}</span>
          <span className="badge badge-purple">{demand.region}</span>
          {demand.urgency === "alta" && (
            <span className="badge" style={{ color: "#dc2626", background: "rgba(220,38,38,.07)" }}>⚡ Urgente</span>
          )}
        </div>

        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "26px",
            fontWeight: 700,
            color: "var(--idl-purple-dark)",
            margin: "0 0 16px",
          }}
        >
          {demand.title}
        </h1>

        <p style={{ fontSize: "14px", lineHeight: "1.7", margin: "0 0 16px" }}>
          {demand.description}
        </p>

        {demand.budgetRange && (
          <div
            style={{
              padding: "12px 16px",
              background: "var(--idl-background-soft)",
              borderRadius: "var(--r-sm)",
              display: "inline-block",
            }}
          >
            <div style={{ fontSize: "11px", color: "var(--idl-text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "2px" }}>
              Faixa de investimento
            </div>
            <div style={{ fontSize: "15px", fontWeight: 700 }}>{demand.budgetRange}</div>
          </div>
        )}
      </div>

      {/* Formulário de interesse ou status */}
      {existingConnection ? (
        <div className="card">
          {existingConnection.status === "aguardando_autorizacao" && (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>⏳</div>
              <div style={{ fontWeight: 700, fontSize: "18px", marginBottom: "8px" }}>
                Interesse manifestado
              </div>
              <div style={{ color: "var(--idl-text-muted)", fontSize: "14px" }}>
                Sua manifestação foi enviada. Aguardando autorização do Instituto e da empresa.
              </div>
            </div>
          )}

          {existingConnection.status === "contato_liberado" && (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <CheckCircle size={48} style={{ color: "#059669", margin: "0 auto 12px" }} />
              <div style={{ fontWeight: 700, fontSize: "18px", marginBottom: "8px" }}>
                Conexão autorizada!
              </div>
              <div style={{ color: "var(--idl-text-muted)", fontSize: "14px", marginBottom: "16px" }}>
                A empresa autorizou o contato. Você já pode entrar em contato diretamente.
              </div>
              <div
                style={{
                  background: "rgba(5,150,105,.06)",
                  border: "1px solid rgba(5,150,105,.2)",
                  borderRadius: "var(--r-sm)",
                  padding: "16px",
                  textAlign: "left",
                }}
              >
                <div style={{ fontSize: "12px", color: "var(--idl-text-muted)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Contato revelado em {new Date(existingConnection.contactRevealedAt!).toLocaleDateString("pt-BR")}
                </div>
                <div style={{ fontSize: "14px", fontWeight: 600 }}>
                  O Instituto enviará os dados de contato por e-mail.
                </div>
              </div>
            </div>
          )}

          {existingConnection.status === "recusada" && (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>❌</div>
              <div style={{ fontWeight: 700, fontSize: "18px", marginBottom: "8px" }}>
                Conexão não autorizada
              </div>
              <div style={{ color: "var(--idl-text-muted)", fontSize: "14px" }}>
                A empresa optou por não prosseguir com esta conexão neste momento.
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="card">
          <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>
            Manifestar interesse
          </h2>
          <p style={{ fontSize: "14px", color: "var(--idl-text-muted)", marginBottom: "20px", lineHeight: "1.6" }}>
            Apresente brevemente como sua solução atende esta demanda. O Instituto revisará sua manifestação antes de encaminhar à empresa.
          </p>

          <FormAction action={expressInterest}>
            <div className="form-group">
              <label className="label" htmlFor="interest_message">
                Como você pode ajudar? *
              </label>
              <textarea
                className="textarea"
                id="interest_message"
                name="interest_message"
                placeholder="Descreva sua solução, experiência relevante e diferenciais. Seja específico sobre como atende os critérios desta demanda."
                required
                style={{ minHeight: "140px" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="submit" className="btn-primary">
                <CheckCircle size={16} /> Enviar manifestação
              </button>
            </div>
          </FormAction>
        </div>
      )}
    </div>
  );
}
