import { requireSession } from "@/lib/auth/session";
import { requireRole } from "@/lib/authorization";
import { createDemandAction } from "@/domains/opportunities/actions";
import { FormAction } from "@/components/ui/FormAction";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  "Liderança e Cultura",
  "Saúde Ocupacional",
  "Jurídico e Compliance",
  "Contabilidade e BPO",
  "Tecnologia e Sistemas",
  "Treinamento e Desenvolvimento",
  "Benefícios Corporativos",
  "Comunicação Interna",
  "Outro",
];

const REGIONS = [
  "Nacional",
  "São Paulo (SP)",
  "Rio de Janeiro (RJ)",
  "Curitiba (PR)",
  "Belo Horizonte (MG)",
  "Porto Alegre (RS)",
  "Brasília (DF)",
  "Nordeste",
  "Sul",
  "Sudeste",
  "Centro-Oeste",
  "Norte",
];

const BUDGET_RANGES = [
  "Até R$ 10.000/mês",
  "R$ 10.000 – R$ 30.000/mês",
  "R$ 30.000 – R$ 100.000/mês",
  "Acima de R$ 100.000/mês",
  "A definir em proposta",
];

export default async function NewDemandPage() {
  const session = await requireSession();
  requireRole(
    { userId: session.userId, organizationId: session.organizationId, role: session.role, isAdmin: session.isAdmin },
    "empresa", "instituto"
  );

  return (
    <div className="page-container" style={{ maxWidth: "720px" }}>
      <Link href="/demands" className="btn-secondary" style={{ marginBottom: "24px", display: "inline-flex" }}>
        <ArrowLeft size={16} /> Voltar
      </Link>

      <h1 className="page-title">Novo desafio organizacional</h1>
      <p className="page-subtitle">
        O Instituto vai qualificar sua demanda e conectar você com parceiros homologados.
      </p>

      <div className="callout" style={{ marginBottom: "24px" }}>
        <div style={{ fontSize: "13px", color: "var(--idl-text-muted)", lineHeight: "1.6" }}>
          🔒 <strong>Privacidade por padrão:</strong> a identidade da sua empresa não é revelada aos parceiros antes que você autorize a conexão. O Instituto gerencia todo o processo.
        </div>
      </div>

      <FormAction action={createDemandAction} style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        <div className="card">
          <div className="form-group">
            <label className="label" htmlFor="title">Título do desafio *</label>
            <input
              className="input"
              id="title"
              name="title"
              placeholder="Ex: Gestão de benefícios para 200 funcionários remotos"
              required
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="description">Descrição detalhada *</label>
            <textarea
              className="textarea"
              id="description"
              name="description"
              placeholder="Descreva o contexto, o problema atual e o resultado esperado. Quanto mais detalhes, melhor o match."
              required
              style={{ minHeight: "140px" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label className="label" htmlFor="category">Categoria *</label>
              <select className="select" id="category" name="category" required>
                <option value="">Selecione...</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="label" htmlFor="region">Região *</label>
              <select className="select" id="region" name="region" required>
                <option value="">Selecione...</option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label className="label" htmlFor="budget_range">Faixa de investimento</label>
              <select className="select" id="budget_range" name="budget_range">
                <option value="">Não informar</option>
                {BUDGET_RANGES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="label" htmlFor="urgency">Urgência *</label>
              <select className="select" id="urgency" name="urgency" required>
                <option value="baixa">Baixa — posso aguardar</option>
                <option value="media" selected>Média — próximas semanas</option>
                <option value="alta">Alta — resolução urgente</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "20px" }}>
          <Link href="/demands" className="btn-secondary">
            Cancelar
          </Link>
          <button type="submit" className="btn-primary">
            Salvar como rascunho
          </button>
        </div>
      </FormAction>
    </div>
  );
}
