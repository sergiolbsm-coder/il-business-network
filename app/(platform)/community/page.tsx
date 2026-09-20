import { requireSession } from "@/lib/auth/session";
import { getPosts } from "@/domains/community/actions";
import { CommunityFeed } from "@/components/platform/CommunityFeed";

export default async function CommunityPage() {
  const session = await requireSession();
  const feedPosts = await getPosts();
  const isAdmin = session.role === "instituto";

  return (
    <div className="page-container">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "24px" }}>
        {/* Feed principal */}
        <div>
          <p style={{ fontSize: "12px", color: "var(--idl-text-muted)", marginBottom: "16px", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em" }}>
            Feed da comunidade · {session.role}
          </p>
          <CommunityFeed
            posts={feedPosts}
            authorInitial={session.organizationName[0]}
            isAdmin={isAdmin}
          />
        </div>

        {/* Sidebar direita */}
        <div>
          <div className="card" style={{ marginBottom: "16px", textAlign: "center" }}>
            <div style={{
              width: "56px", height: "56px", borderRadius: "50%",
              background: "var(--idl-gradient)", display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: "20px", fontWeight: 700, color: "#FBF9FF",
              margin: "0 auto 12px",
            }}>
              {session.organizationName[0]}
            </div>
            <div style={{ fontWeight: 700, marginBottom: "4px" }}>{session.organizationName}</div>
            <div style={{ fontSize: "12px", color: "var(--idl-text-muted)", textTransform: "capitalize" }}>
              {session.role}
            </div>
          </div>

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
