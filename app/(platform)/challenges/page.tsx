import { requireSession } from "@/lib/auth/session";
import { getChallenges, deleteChallengeAction, updateChallengeStatusAction } from "@/domains/challenges/actions";
import { Trophy, Plus } from "lucide-react";
import Link from "next/link";

async function deleteChallenge(formData: FormData) {
  "use server";
  await deleteChallengeAction(formData);
}
async function activateChallenge(formData: FormData) {
  "use server";
  await updateChallengeStatusAction(formData);
}
async function closeChallenge(formData: FormData) {
  "use server";
  const fd = new FormData();
  fd.set("challengeId", String(formData.get("challengeId")));
  fd.set("status", "encerrado");
  await updateChallengeStatusAction(fd);
}

export default async function ChallengesPage() {
  const session = await requireSession();
  const isAdmin = session.role === "instituto";
  const rows = await getChallenges();

  return (
    <div className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>Desafios</h1>
          <p style={{ fontSize: "14px", color: "var(--idl-text-muted)" }}>
            Desafios ativos da rede de liderança — {rows.length} no total
          </p>
        </div>
        {isAdmin && (
          <Link href="/challenges/new" className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px" }}>
            <Plus size={15} /> Novo desafio
          </Link>
        )}
      </div>

      {rows.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "64px 24px" }}>
          <Trophy size={36} style={{ margin: "0 auto 16px", color: "var(--idl-text-muted)" }} />
          <p style={{ fontWeight: 600, marginBottom: "8px" }}>Nenhum desafio cadastrado</p>
          <p style={{ fontSize: "14px", color: "var(--idl-text-muted)", marginBottom: "20px" }}>
            Os desafios da rede aparecerão aqui.
          </p>
          {isAdmin && (
            <Link href="/challenges/new" className="btn-primary" style={{ fontSize: "13px", padding: "9px 18px", display: "inline-block" }}>
              Criar primeiro desafio
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
          {rows.map((challenge) => (
            <div key={challenge.id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <span className={`badge ${challenge.status === "ativo" ? "badge-success" : "badge-muted"}`}>
                  {challenge.status === "ativo" ? "Ativo" : "Encerrado"}
                </span>
                {challenge.points > 0 && (
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--idl-magenta)" }}>
                    {challenge.points} pts
                  </span>
                )}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: "15px", marginBottom: "8px" }}>{challenge.title}</h3>
              <p style={{ fontSize: "13px", color: "var(--idl-text-muted)", lineHeight: "1.5", marginBottom: "12px" }}>
                {challenge.description}
              </p>
              {challenge.deadline && (
                <p style={{ fontSize: "12px", color: "var(--idl-text-muted)", marginBottom: "12px" }}>
                  Prazo: {new Date(challenge.deadline).toLocaleDateString("pt-BR")}
                </p>
              )}
              {isAdmin && (
                <div style={{ display: "flex", gap: "8px", paddingTop: "12px", borderTop: "1px solid var(--idl-border)" }}>
                  {challenge.status === "ativo" ? (
                    <form action={closeChallenge}>
                      <input type="hidden" name="challengeId" value={challenge.id} />
                      <button type="submit" className="btn-outline" style={{ fontSize: "12px", padding: "5px 10px" }}>
                        Encerrar
                      </button>
                    </form>
                  ) : (
                    <form action={activateChallenge}>
                      <input type="hidden" name="challengeId" value={challenge.id} />
                      <input type="hidden" name="status" value="ativo" />
                      <button type="submit" className="btn-outline" style={{ fontSize: "12px", padding: "5px 10px" }}>
                        Reativar
                      </button>
                    </form>
                  )}
                  <form action={deleteChallenge}>
                    <input type="hidden" name="challengeId" value={challenge.id} />
                    <button type="submit" className="btn-outline" style={{ fontSize: "12px", padding: "5px 10px", color: "#ef4444", borderColor: "#ef4444" }}>
                      Excluir
                    </button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
