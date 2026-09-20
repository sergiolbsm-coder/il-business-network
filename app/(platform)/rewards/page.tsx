import { requireSession } from "@/lib/auth/session";
import { getRewards, deleteRewardAction, updateRewardStatusAction } from "@/domains/rewards/actions";
import { Gift, Plus } from "lucide-react";
import Link from "next/link";

async function deleteReward(formData: FormData) {
  "use server";
  await deleteRewardAction(formData);
}
async function toggleReward(formData: FormData) {
  "use server";
  await updateRewardStatusAction(formData);
}

export default async function RewardsPage() {
  const session = await requireSession();
  const isAdmin = session.role === "instituto";
  const rows = await getRewards();

  return (
    <div className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>Recompensas</h1>
          <p style={{ fontSize: "14px", color: "var(--idl-text-muted)" }}>
            Recompensas disponíveis na rede — {rows.length} no total
          </p>
        </div>
        {isAdmin && (
          <Link href="/rewards/new" className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px" }}>
            <Plus size={15} /> Nova recompensa
          </Link>
        )}
      </div>

      {rows.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "64px 24px" }}>
          <Gift size={36} style={{ margin: "0 auto 16px", color: "var(--idl-text-muted)" }} />
          <p style={{ fontWeight: 600, marginBottom: "8px" }}>Nenhuma recompensa cadastrada</p>
          {isAdmin && (
            <Link href="/rewards/new" className="btn-primary" style={{ fontSize: "13px", padding: "9px 18px", display: "inline-block", marginTop: "12px" }}>
              Criar primeira recompensa
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
          {rows.map((reward) => (
            <div key={reward.id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <span className={`badge ${reward.status === "ativo" ? "badge-success" : "badge-muted"}`}>
                  {reward.status === "ativo" ? "Ativo" : "Inativo"}
                </span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--idl-magenta)" }}>
                  {reward.points} pts
                </span>
              </div>
              <h3 style={{ fontWeight: 700, fontSize: "15px", marginBottom: "8px" }}>{reward.title}</h3>
              <p style={{ fontSize: "13px", color: "var(--idl-text-muted)", lineHeight: "1.5" }}>
                {reward.description}
              </p>
              {isAdmin && (
                <div style={{ display: "flex", gap: "8px", paddingTop: "12px", marginTop: "12px", borderTop: "1px solid var(--idl-border)" }}>
                  <form action={toggleReward}>
                    <input type="hidden" name="rewardId" value={reward.id} />
                    <input type="hidden" name="status" value={reward.status === "ativo" ? "inativo" : "ativo"} />
                    <button type="submit" className="btn-outline" style={{ fontSize: "12px", padding: "5px 10px" }}>
                      {reward.status === "ativo" ? "Desativar" : "Ativar"}
                    </button>
                  </form>
                  <form action={deleteReward}>
                    <input type="hidden" name="rewardId" value={reward.id} />
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
