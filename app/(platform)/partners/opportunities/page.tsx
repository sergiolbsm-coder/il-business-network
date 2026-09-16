import { requireSession } from "@/lib/auth/session";
import { requireRole } from "@/lib/authorization";
import { getDemands } from "@/domains/opportunities/actions";
import Link from "next/link";
import { Target, Lock } from "lucide-react";

const URGENCY_COLORS: Record<string, string> = {
  baixa: "#059669",
  media: "#d97706",
  alta: "#dc2626",
};

export default async function PartnerOpportunitiesPage() {
  const session = await requireSession();
  requireRole(
    { userId: session.userId, organizationId: session.organizationId, role: session.role, isAdmin: session.isAdmin },
    "parceiro"
  );

  const opportunities = await getDemands() as any[];

  return (
    <div className="page-container">
      <div style={{ marginBottom: "24px" }}>
        <h1 className="page-title">Oportunidades B2B</h1>
        <p className="page-subtitle">
          Demandas qualificadas e anonimizadas pelo Instituto da Liderança. Manifeste interesse para dar o próximo passo.
        </p>
      </div>

      {/* Aviso de privacidade */}
      <div
        style={{
          background: "rgba(57,22,148,.04)",
          border: "1px solid var(--idl-border)",
          borderRadius: "var(--r)",
          padding: "16px 20px",
          marginBottom: "24px",
          display: "flex",
          gap: "12px",
          alignItems: "flex-start",
        }}
      >
        <Lock size={18} style={{ color: "var(--idl-purple)", flexShrink: 0, marginTop: "2px" }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: "13px", marginBottom: "4px" }}>
            Rede curada com privacidade por padrão
          </div>
          <div style={{ fontSize: "13px", color: "var(--idl-text-muted)", lineHeight: "1.5" }}>
            A identidade das empresas não é revelada até que a conexão seja autorizada. Manifeste seu interesse e aguarde a aprovação do Instituto e da empresa.
          </div>
        </div>
      </div>

      {opportunities.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 24px",
            background: "var(--idl-white)",
            borderRadius: "var(--r)",
            border: "2px dashed var(--idl-border)",
          }}
        >
          <Target size={48} style={{ color: "var(--idl-border)", margin: "0 auto 16px" }} />
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "24px",
              fontWeight: 700,
              color: "var(--idl-purple-dark)",
              marginBottom: "8px",
            }}
          >
            Nenhuma oportunidade disponível
          </div>
          <p style={{ color: "var(--idl-text-muted)" }}>
            O Instituto publica novas demandas semanalmente. Volte em breve.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "16px" }}>
          {opportunities.map((opp: any) => (
            <div key={opp.id} className="card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <span className="badge">{opp.category}</span>
                  <span className="badge badge-purple">{opp.region}</span>
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: URGENCY_COLORS[opp.urgency] ?? "var(--idl-text-muted)",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {opp.urgency === "alta" ? "⚡ URGENTE" : opp.urgency === "media" ? "MÉDIA" : "BAIXA"}
                </span>
              </div>

              {/* Title */}
              <div>
                <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "4px" }}>
                  {opp.title}
                </div>
                <p style={{ fontSize: "13px", color: "var(--idl-text-muted)", lineHeight: "1.6", margin: 0, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {opp.description}
                </p>
              </div>

              {/* Meta */}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  padding: "10px",
                  background: "var(--idl-background-soft)",
                  borderRadius: "var(--r-sm)",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "10px", color: "var(--idl-text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "2px" }}>
                    Empresa
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--idl-text-muted)", fontStyle: "italic" }}>
                    Anonimizado
                  </div>
                </div>
                {opp.budgetRange && (
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "10px", color: "var(--idl-text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "2px" }}>
                      Investimento
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: 600 }}>{opp.budgetRange}</div>
                  </div>
                )}
              </div>

              {/* CTA */}
              <Link
                href={`/partners/opportunities/${opp.id}`}
                className="btn-primary"
                style={{ textAlign: "center", justifyContent: "center" }}
              >
                Manifestar interesse
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
