import type { Session, Membership, Demand, Connection } from "@/db/schema";

type Role = "instituto" | "empresa" | "profissional" | "parceiro";

interface AuthContext {
  userId: string;
  organizationId: string;
  role: Role;
  isAdmin: boolean;
}

export function getAuthContext(
  session: Session,
  membership: Membership
): AuthContext {
  return {
    userId: session.userId,
    organizationId: membership.organizationId,
    role: membership.role,
    isAdmin: membership.isAdmin,
  };
}

// ─── Demandas ────────────────────────────────────────────────────────────────

export function canCreateDemand(ctx: AuthContext): boolean {
  return ctx.role === "empresa" || ctx.role === "instituto";
}

export function canViewDemand(ctx: AuthContext, demand: Demand): boolean {
  if (ctx.role === "instituto") return true;
  if (ctx.role === "empresa") return demand.organizationId === ctx.organizationId;
  // Parceiros só veem demandas publicadas (anonimizadas — filtro aplicado no serviço)
  if (ctx.role === "parceiro") {
    return demand.status === "recomendacoes_publicadas" ||
      demand.status === "conexao_autorizada";
  }
  return false;
}

export function canQualifyDemand(ctx: AuthContext): boolean {
  return ctx.role === "instituto";
}

export function canPublishDemand(ctx: AuthContext): boolean {
  return ctx.role === "instituto";
}

// ─── Conexões ────────────────────────────────────────────────────────────────

export function canExpressInterest(ctx: AuthContext): boolean {
  return ctx.role === "parceiro";
}

export function canAuthorizeConnection(
  ctx: AuthContext,
  demand: Demand
): boolean {
  // Instituto pode autorizar qualquer conexão
  if (ctx.role === "instituto") return true;
  // Empresa só autoriza conexões das suas próprias demandas
  if (ctx.role === "empresa") return demand.organizationId === ctx.organizationId;
  return false;
}

export function canViewContactDetails(
  ctx: AuthContext,
  connection: Connection
): boolean {
  if (ctx.role === "instituto") return true;
  if (connection.status !== "contato_liberado") return false;
  // Empresa dona da demanda
  if (ctx.role === "empresa") return true;
  // Parceiro que manifestou interesse
  if (ctx.role === "parceiro")
    return connection.partnerOrganizationId === ctx.organizationId;
  return false;
}

export function requireRole(ctx: AuthContext, ...roles: Role[]): void {
  if (!roles.includes(ctx.role)) {
    throw new Error(`Acesso negado. Perfil requerido: ${roles.join(" ou ")}`);
  }
}
