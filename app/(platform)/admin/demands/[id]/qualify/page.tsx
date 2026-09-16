import { requireSession } from "@/lib/auth/session";
import { requireRole } from "@/lib/authorization";
import { qualifyDemandAction, getDemandById } from "@/domains/opportunities/actions";
import { FormAction } from "@/components/ui/FormAction";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function QualifyDemandPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireSession();
  requireRole(
    { userId: session.userId, organizationId: session.organizationId, role: session.role, isAdmin: session.isAdmin },
    "instituto"
  );

  const data = await getDemandById(id);
  if (!data) notFound();

  const { demand, company } = data as any;

  if (!["enviada", "em_qualificacao"].includes(demand.status)) {
    return (
      <div className="page-container" style={{ maxWidth: "720px" }}>
        <Link href="/admin/demands" className="btn-secondary" style={{ marginBottom: "24px", display: "inline-flex" }}>
          <ArrowLeft size={16} /> Voltar
        </Link>
        <div className="alert-error">Esta demanda não está em estado de qualificação.</div>
      </div>
    );
  }

  const qualify = qualifyDemandAction.bind(null, id);

  return (
    <div className="page-container" style={{ maxWidth: "720px" }}>
      <Link href="/admin/demands" className="btn-secondary" style={{ marginBottom: "24px", display: "inline-flex" }}>
        <ArrowLeft size={16} /> Voltar
      </Link>

      <h1 className="page-title">Qualificar demanda</h1>
      <p className="page-subtitle">Revise os dados, adicione notas e decida se publica para os parceiros.</p>

      {/* Resumo da demanda */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
          <span className="badge">{demand.category}</span>
          <span className="badge badge-purple">{demand.region}</span>
          {demand.urgency === "alta" && (
            <span className="badge" style={{ color: "#dc2626", background: "rgba(220,38,38,.07)" }}>⚡ Urgente</span>
          )}
        </div>

        <h2 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 12px" }}>{demand.title}</h2>

        <div style={{ marginBottom: "16px" }}>
          <div className="label">Empresa</div>
          <div style={{ fontSize: "14px", fontWeight: 600 }}>{company?.name ?? "—"}</div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <div className="label">Descrição</div>
          <p style={{ fontSize: "14px", lineHeight: "1.7", margin: 0 }}>{demand.description}</p>
        </div>

        {demand.budgetRange && (
          <div>
            <div className="label">Faixa de investimento</div>
            <div style={{ fontSize: "14px" }}>{demand.budgetRange}</div>
          </div>
        )}
      </div>

      {/* Formulário de qualificação */}
      <FormAction action={qualify}>
        <div className="card">
          <div className="form-group">
            <label className="label" htmlFor="internal_notes">
              Notas internas do Instituto
            </label>
            <textarea
              className="textarea"
              id="internal_notes"
              name="internal_notes"
              placeholder="Observações sobre a demanda, critérios adicionais, ajustes de categoria..."
              defaultValue={demand.internalNotes ?? ""}
              style={{ minHeight: "100px" }}
            />
            <div style={{ fontSize: "11px", color: "var(--idl-text-muted)", marginTop: "4px" }}>
              Estas notas são visíveis apenas para o Instituto.
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "20px" }}>
          <button
            type="submit"
            name="publish"
            value="false"
            className="btn-secondary"
          >
            Salvar em qualificação
          </button>
          <button
            type="submit"
            name="publish"
            value="true"
            className="btn-primary"
          >
            <CheckCircle size={16} /> Publicar para parceiros
          </button>
        </div>
      </FormAction>
    </div>
  );
}
