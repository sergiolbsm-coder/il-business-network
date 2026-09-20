import { requireRole } from "@/lib/auth/session";
import { createJobAction } from "@/domains/jobs/actions";
import { FormAction } from "@/components/ui/FormAction";
import Link from "next/link";

export default async function NewJobPage() {
  await requireRole(["empresa", "instituto"]);

  return (
    <div className="page-container" style={{ maxWidth: "720px" }}>
      <div style={{ marginBottom: "24px" }}>
        <Link href="/jobs" style={{ fontSize: "13px", color: "var(--idl-text-muted)", textDecoration: "none" }}>
          ← Voltar para vagas
        </Link>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginTop: "12px", marginBottom: "4px" }}>
          Nova vaga
        </h1>
        <p style={{ fontSize: "14px", color: "var(--idl-text-muted)" }}>
          Preencha os dados da vaga para atrair os melhores talentos da rede.
        </p>
      </div>

      <div className="card">
        <FormAction action={createJobAction}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label className="form-label">Título da vaga *</label>
              <input name="title" className="form-input" placeholder="Ex: Gerente de RH" required />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label className="form-label">Departamento *</label>
                <input name="department" className="form-input" placeholder="Ex: Recursos Humanos" required />
              </div>
              <div>
                <label className="form-label">Local de trabalho *</label>
                <input name="location" className="form-input" placeholder="Ex: São Paulo, SP" required />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label className="form-label">Tipo de contrato *</label>
                <select name="type" className="form-input" required>
                  <option value="clt">CLT</option>
                  <option value="pj">PJ</option>
                  <option value="estagio">Estágio</option>
                  <option value="freelance">Freelance</option>
                </select>
              </div>
              <div>
                <label className="form-label">Faixa salarial</label>
                <input name="salary_range" className="form-input" placeholder="Ex: R$ 8.000 – R$ 12.000" />
              </div>
            </div>

            <div>
              <label className="form-label">Descrição da vaga *</label>
              <textarea name="description" className="form-input" rows={5} placeholder="Descreva as responsabilidades, benefícios e diferenciais da vaga..." required style={{ resize: "vertical" }} />
            </div>

            <div>
              <label className="form-label">Requisitos</label>
              <textarea name="requirements" className="form-input" rows={4} placeholder="Liste os requisitos e qualificações desejadas..." style={{ resize: "vertical" }} />
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", paddingTop: "8px", borderTop: "1px solid var(--idl-border)" }}>
              <Link href="/jobs" className="btn-outline" style={{ fontSize: "14px" }}>Cancelar</Link>
              <button type="submit" className="btn-primary" style={{ fontSize: "14px" }}>Publicar vaga</button>
            </div>
          </div>
        </FormAction>
      </div>
    </div>
  );
}
