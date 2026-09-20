import { requireSession } from "@/lib/auth/session";
import { getContentItems, getAllContentItems, deleteContentAction } from "@/domains/content/actions";
import { BookOpen, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

const CATEGORY_LABELS: Record<string, string> = {
  lideranca: "Liderança",
  gestao: "Gestão",
  inovacao: "Inovação",
  cultura: "Cultura organizacional",
  rh: "RH & Pessoas",
  estrategia: "Estratégia",
  financas: "Finanças",
  tecnologia: "Tecnologia",
};

async function deleteContent(formData: FormData) {
  "use server";
  await deleteContentAction(String(formData.get("contentId")));
}

export default async function ContentPage() {
  const session = await requireSession();
  const isAdmin = session.role === "instituto";
  const rows = isAdmin ? await getAllContentItems() : await getContentItems();

  return (
    <div className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>Conteúdos</h1>
          <p style={{ fontSize: "14px", color: "var(--idl-text-muted)" }}>
            Artigos e conteúdos curados pelo Instituto da Liderança
          </p>
        </div>
        {isAdmin && (
          <Link href="/content/new" className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px" }}>
            <Plus size={15} /> Novo conteúdo
          </Link>
        )}
      </div>

      {rows.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "64px 24px" }}>
          <BookOpen size={36} style={{ margin: "0 auto 16px", color: "var(--idl-text-muted)" }} />
          <p style={{ fontWeight: 600, marginBottom: "8px" }}>Nenhum conteúdo publicado</p>
          <p style={{ fontSize: "14px", color: "var(--idl-text-muted)" }}>Os artigos e materiais da rede aparecerão aqui.</p>
          {isAdmin && (
            <Link href="/content/new" className="btn-primary" style={{ fontSize: "13px", padding: "9px 18px", display: "inline-block", marginTop: "16px" }}>
              Publicar primeiro conteúdo
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "16px" }}>
          {rows.map(({ item, orgName }) => (
            <div key={item.id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <span className="badge badge-info">{CATEGORY_LABELS[item.category] ?? item.category}</span>
                {isAdmin && (
                  <div style={{ display: "flex", gap: "6px" }}>
                    <Link href={`/content/${item.id}/edit`} style={{ fontSize: "12px", color: "var(--idl-text-muted)", textDecoration: "none", border: "1px solid var(--idl-border)", borderRadius: "6px", padding: "4px 8px" }}>
                      Editar
                    </Link>
                    <form action={deleteContent} style={{ display: "inline" }}>
                      <input type="hidden" name="contentId" value={item.id} />
                      <button type="submit" style={{ background: "none", border: "1px solid #ef4444", borderRadius: "6px", padding: "4px 8px", cursor: "pointer", color: "#ef4444", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }} onClick={(e) => { if (!confirm("Excluir este conteúdo?")) e.preventDefault(); }}>
                        <Trash2 size={12} /> Excluir
                      </button>
                    </form>
                  </div>
                )}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: "15px", marginBottom: "8px", lineHeight: "1.4" }}>{item.title}</h3>
              <p style={{ fontSize: "13px", lineHeight: "1.5", color: "var(--idl-text-muted)", marginBottom: "16px", WebkitLineClamp: 3, overflow: "hidden", display: "-webkit-box", WebkitBoxOrient: "vertical" }}>
                {item.summary}
              </p>
              <div style={{ fontSize: "11px", color: "var(--idl-text-muted)", borderTop: "1px solid var(--idl-border)", paddingTop: "10px", display: "flex", justifyContent: "space-between" }}>
                <span>{orgName}</span>
                <span>{new Date(item.createdAt).toLocaleDateString("pt-BR")}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
