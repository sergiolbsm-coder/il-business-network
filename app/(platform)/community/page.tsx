import { requireSession } from "@/lib/auth/session";
import { MessageSquare, ThumbsUp, Share2, Bookmark, Plus } from "lucide-react";

const ROLE_FEED_COPY: Record<string, string> = {
  instituto: "Feed da comunidade · visão completa",
  empresa: "Feed da comunidade · perspectiva empresarial",
  profissional: "Feed da comunidade · para executivos",
  parceiro: "Feed da comunidade · ecossistema de soluções",
};

const MOCK_POSTS = [
  {
    id: "1",
    author: "Instituto da Liderança",
    avatar: "IL",
    role: "Curadoria",
    time: "há 2 horas",
    content:
      "O problema nem sempre é falta de treinamento. Antes de indicar uma solução, precisamos entender se o desafio está na liderança, no processo, nos papéis ou nos indicadores. Qual desses pontos mais limita o crescimento da sua organização hoje?",
    likes: 28,
    comments: 9,
  },
  {
    id: "2",
    author: "Mariana Costa",
    avatar: "MC",
    role: "CEO · Saúde",
    time: "ontem",
    content:
      "Conexão que saiu da comunidade. Encontramos um parceiro de saúde ocupacional com cobertura regional e integração ao nosso sistema. A curadoria reduziu o tempo de comparação e trouxe mais segurança para a decisão.",
    likes: 41,
    comments: 12,
  },
];

export default async function CommunityPage() {
  const session = await requireSession();

  return (
    <div className="page-container">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "24px" }}>
        {/* Feed principal */}
        <div>
          {/* Composer */}
          <div className="card" style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "var(--idl-gradient)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#FBF9FF",
                  flexShrink: 0,
                }}
              >
                {session.organizationName[0]}
              </div>
              <input
                type="text"
                placeholder="Compartilhe uma ideia, aprendizado ou oportunidade..."
                style={{
                  flex: 1,
                  border: "1px solid var(--idl-border)",
                  borderRadius: "100px",
                  padding: "10px 18px",
                  fontSize: "14px",
                  background: "var(--idl-background-soft)",
                  outline: "none",
                  color: "var(--idl-text)",
                }}
              />
              <button className="btn-primary" style={{ padding: "9px 18px", whiteSpace: "nowrap" }}>
                <Plus size={14} /> Publicar
              </button>
            </div>
          </div>

          {/* Segmentação */}
          <p style={{ fontSize: "12px", color: "var(--idl-text-muted)", marginBottom: "16px", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em" }}>
            {ROLE_FEED_COPY[session.role]}
          </p>

          {/* Posts */}
          {MOCK_POSTS.map((post) => (
            <div key={post.id} className="card" style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    background: "var(--idl-gradient)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#FBF9FF",
                    flexShrink: 0,
                  }}
                >
                  {post.avatar}
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600 }}>{post.author}</div>
                  <div style={{ fontSize: "12px", color: "var(--idl-text-muted)" }}>
                    {post.role} · {post.time}
                  </div>
                </div>
              </div>

              <p style={{ fontSize: "14px", lineHeight: "1.6", margin: "0 0 16px" }}>
                {post.content}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  paddingTop: "12px",
                  borderTop: "1px solid var(--idl-border)",
                }}
              >
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    color: "var(--idl-text-muted)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <ThumbsUp size={15} /> {post.likes}
                </button>
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    color: "var(--idl-text-muted)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <MessageSquare size={15} /> {post.comments}
                </button>
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    color: "var(--idl-text-muted)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    marginLeft: "auto",
                  }}
                >
                  <Share2 size={15} /> Compartilhar
                </button>
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    color: "var(--idl-text-muted)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <Bookmark size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar direita */}
        <div>
          {/* Card de perfil */}
          <div className="card" style={{ marginBottom: "16px", textAlign: "center" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "var(--idl-gradient)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: 700,
                color: "#FBF9FF",
                margin: "0 auto 12px",
              }}
            >
              {session.organizationName[0]}
            </div>
            <div style={{ fontWeight: 700, marginBottom: "4px" }}>{session.organizationName}</div>
            <div style={{ fontSize: "12px", color: "var(--idl-text-muted)", textTransform: "capitalize" }}>
              {session.role}
            </div>
          </div>

          {/* Quick actions por perfil */}
          {session.role === "empresa" && (
            <div className="callout">
              <div style={{ fontSize: "11px", color: "var(--idl-magenta)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>
                Para sua empresa
              </div>
              <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>
                Publique seu próximo desafio
              </div>
              <div style={{ fontSize: "13px", color: "var(--idl-text-muted)", marginBottom: "12px" }}>
                O Instituto conecta você com parceiros qualificados.
              </div>
              <a href="/demands/new" className="btn-primary" style={{ fontSize: "13px", padding: "9px 18px" }}>
                Criar desafio
              </a>
            </div>
          )}

          {session.role === "parceiro" && (
            <div className="callout">
              <div style={{ fontSize: "11px", color: "var(--idl-magenta)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>
                Oportunidades para você
              </div>
              <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>
                Veja demandas anonimizadas
              </div>
              <div style={{ fontSize: "13px", color: "var(--idl-text-muted)", marginBottom: "12px" }}>
                Mostre suas soluções para empresas qualificadas.
              </div>
              <a href="/partner/opportunities" className="btn-primary" style={{ fontSize: "13px", padding: "9px 18px" }}>
                Ver oportunidades
              </a>
            </div>
          )}

          {session.role === "instituto" && (
            <div className="callout">
              <div style={{ fontSize: "11px", color: "var(--idl-magenta)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>
                Curadoria do dia
              </div>
              <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>
                Demandas aguardam qualificação
              </div>
              <div style={{ fontSize: "13px", color: "var(--idl-text-muted)", marginBottom: "12px" }}>
                Revise, qualifique e publique para os parceiros.
              </div>
              <a href="/admin/demands" className="btn-primary" style={{ fontSize: "13px", padding: "9px 18px" }}>
                Ver pendências
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
