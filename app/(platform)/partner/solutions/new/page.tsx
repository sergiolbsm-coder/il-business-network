import { requireRole } from "@/lib/auth/session";
import { createSolutionAction } from "@/domains/solutions/actions";
import { FormAction } from "@/components/ui/FormAction";
import Link from "next/link";

export default async function NewSolutionPage() {
  await requireRole(["parceiro"]);

  return (
    <div className="page-container" style={{ maxWidth: "720px" }}>
      <div style={{ marginBottom: "24px" }}>
        <Link href="/partner/solutions" style={{ fontSize: "13px", color: "var(--idl-text-muted)", textDecoration: "none" }}>
          ← Voltar para soluções
        </Link>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginTop: "12px", marginBottom: "4px" }}>Nova solução</h1>
        <p style={{ fontSize: "14px", color: "var(--idl-text-muted)" }}>
          Cadastre sua solução para que o Instituto possa recomendá-la às empresas.
        </p>
      </div>

      <div className="card">
        <FormAction action={createSolutionAction}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label className="form-label">Nome da solução *</label>
              <input name="title" className="form-input" placeholder="Ex: Programa de Desenvolvimento de Lideranças" required />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label className="form-label">Categoria *</label>
                <select name="category" className="form-input" required>
                  <option value="">Selecione...</option>
                  <option value="Treinamento & Desenvolvimento">Treinamento & Desenvolvimento</option>
                  <option value="Saúde Ocupacional">Saúde Ocupacional</option>
                  <option value="Tecnologia RH">Tecnologia RH</option>
                  <option value="Consultoria de Gestão">Consultoria de Gestão</option>
                  <option value="Benefícios Corporativos">Benefícios Corporativos</option>
                  <option value="Recrutamento & Seleção">Recrutamento & Seleção</option>
                  <option value="Bem-estar Organizacional">Bem-estar Organizacional</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
              <div>
                <label className="form-label">Região de atuação *</label>
                <select name="region" className="form-input" required>
                  <option value="nacional">Nacional</option>
                  <option value="Sul">Sul</option>
                  <option value="Sudeste">Sudeste</option>
                  <option value="Centro-Oeste">Centro-Oeste</option>
                  <option value="Nordeste">Nordeste</option>
                  <option value="Norte">Norte</option>
                  <option value="São Paulo">São Paulo</option>
                  <option value="Rio de Janeiro">Rio de Janeiro</option>
                  <option value="Curitiba e região">Curitiba e região</option>
                </select>
              </div>
            </div>

            <div>
              <label className="form-label">Descrição da solução *</label>
              <textarea name="description" className="form-input" rows={5} placeholder="Descreva sua solução, diferenciais, metodologia e resultados esperados..." required style={{ resize: "vertical" }} />
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", paddingTop: "8px", borderTop: "1px solid var(--idl-border)" }}>
              <Link href="/partner/solutions" className="btn-outline" style={{ fontSize: "14px" }}>Cancelar</Link>
              <button type="submit" className="btn-primary" style={{ fontSize: "14px" }}>Cadastrar solução</button>
            </div>
          </div>
        </FormAction>
      </div>
    </div>
  );
}
