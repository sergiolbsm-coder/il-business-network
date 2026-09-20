"use client";

import { useRef } from "react";
import { MessageSquare, ThumbsUp, Trash2, Plus } from "lucide-react";
import { createPostAction, deletePostAction } from "@/domains/community/actions";

interface Post {
  id: string;
  authorName: string;
  content: string;
  createdAt: Date;
}

interface Props {
  posts: Post[];
  authorInitial: string;
  isAdmin: boolean;
}

export function CommunityFeed({ posts, authorInitial, isAdmin }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div>
      {/* Composer */}
      <div className="card" style={{ marginBottom: "16px" }}>
        <form
          ref={formRef}
          action={async (formData) => {
            await createPostAction(formData);
            formRef.current?.reset();
          }}
        >
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "50%",
              background: "var(--idl-gradient)", display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: "13px", fontWeight: 700, color: "#FBF9FF", flexShrink: 0,
            }}>
              {authorInitial}
            </div>
            <div style={{ flex: 1 }}>
              <textarea
                name="content"
                placeholder="Compartilhe uma ideia, aprendizado ou oportunidade..."
                required
                rows={3}
                style={{
                  width: "100%", border: "1px solid var(--idl-border)",
                  borderRadius: "12px", padding: "10px 18px",
                  fontSize: "14px", background: "var(--idl-background-soft)",
                  outline: "none", color: "var(--idl-text)", resize: "vertical",
                  boxSizing: "border-box", fontFamily: "inherit",
                }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
                <button type="submit" className="btn-primary" style={{ padding: "9px 18px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Plus size={14} /> Publicar
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Posts */}
      {posts.length === 0 && (
        <div className="card" style={{ textAlign: "center", padding: "48px 24px", color: "var(--idl-text-muted)" }}>
          <MessageSquare size={36} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
          <p>Nenhuma publicação ainda. Seja o primeiro a compartilhar!</p>
        </div>
      )}
      {posts.map((post) => (
        <div key={post.id} className="card" style={{ marginBottom: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div style={{
                width: "38px", height: "38px", borderRadius: "50%",
                background: "var(--idl-gradient)", display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: "13px", fontWeight: 700, color: "#FBF9FF", flexShrink: 0,
              }}>
                {post.authorName[0]}
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 600 }}>{post.authorName}</div>
                <div style={{ fontSize: "12px", color: "var(--idl-text-muted)" }}>
                  {new Date(post.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
            {isAdmin && (
              <form action={deletePostAction}>
                <input type="hidden" name="postId" value={post.id} />
                <button
                  type="submit"
                  onClick={(e) => { if (!confirm("Excluir esta publicação?")) e.preventDefault(); }}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--idl-text-muted)", padding: "4px",
                    display: "flex", alignItems: "center",
                  }}
                  title="Excluir publicação"
                >
                  <Trash2 size={15} />
                </button>
              </form>
            )}
          </div>

          <p style={{ fontSize: "14px", lineHeight: "1.6", margin: "0 0 16px", whiteSpace: "pre-wrap" }}>
            {post.content}
          </p>

          <div style={{ display: "flex", gap: "20px", paddingTop: "12px", borderTop: "1px solid var(--idl-border)" }}>
            <button style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--idl-text-muted)", background: "none", border: "none", cursor: "pointer" }}>
              <ThumbsUp size={15} /> Curtir
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--idl-text-muted)", background: "none", border: "none", cursor: "pointer" }}>
              <MessageSquare size={15} /> Comentar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
