import { requireRole } from "@/lib/auth/session";
import { createContentAction } from "@/domains/content/actions";
import { FormAction } from "@/components/ui/FormAction";
import Link from "next/link";

export default async function NewContentPage() {
  await requireRole(["instituto"]);

  return (
    <div className="page-container" style={{ maxWidth: "720px" }}>
      <div style={{ marginBottom: "24px" }}>
        <Link href="/content" style={{ fontSize: "13px", color: "var(--idl-text-muted)", textDecoration: "none" }}>
          ← Voltar para conteúdos
        </Link>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginTop: "12px", marginBottom: "4px" }}>Novo conteúdo</h1>
        <p style={{ fontSize: "14px", color: "var(--idl-text-muted)" }}>Publique um artigo ou material para a rede.</p>
      </div>

      <div className="card">
        <FormAction action={createContentAction}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label className="form-label">Título *</label>
              <input name="title" className="form-input" placeholder="Ex: Como desenvolver lideranças em tempos de incerteza" required />
            </div>

            <div>
              <label className="form-label">Categoria *</label>
              <select name="category" className="form-input" required>
                <option value="">Selecione...</option>
                <option value="lideranca">Liderança</option>
                <option value="gestao">Gestão</option>
                <option value="inovacao">Inovação</option>
                <option value="cultura">Cultura organizacional</option>
                <option value="rh">RH & Pessoas</option>
                <option value="estrategia">Estratégia</option>
                <option value="financas">Finanças</option>
                <option value="tecnologia">Tecnologia</option>
              </select>
            </div>

            <div>
              <label className="form-label">Resumo *</label>
              <textarea name="summary" className="form-input" rows={3} placeholder="Uma ou duas frases que descrevam o conteúdo do artigo..." required style={{ resize: "vertical" }} />
            </div>

            <div>
              <label className="form-label">Conteúdo completo *</label>
              <textarea name="body" className="form-input" rows={10} placeholder="Escreva o conteúdo completo do artigo aqui..." required style={{ resize: "vertical" }} />
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", paddingTop: "8px", borderTop: "1px solid var(--idl-border)" }}>
              <Link href="/content" className="btn-outline" style={{ fontSize: "14px" }}>Cancelar</Link>
              <button type="submit" className="btn-primary" style={{ fontSize: "14px" }}>Publicar conteúdo</button>
            </div>
          </div>
        </FormAction>
      </div>
    </div>
  );
}
