import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { sessions, memberships, organizations } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export interface SessionData {
  userId: string;
  organizationId: string;
  role: "instituto" | "empresa" | "profissional" | "parceiro";
  isAdmin: boolean;
  organizationName: string;
  organizationType: "instituto" | "empresa" | "profissional" | "parceiro";
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return null;

  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.token, token))
    .limit(1);

  if (!session || session.expiresAt < new Date()) return null;
  if (!session.activeOrganizationId) return null;

  const [membership] = await db
    .select({
      role: memberships.role,
      isAdmin: memberships.isAdmin,
      organizationName: organizations.name,
      organizationType: organizations.type,
    })
    .from(memberships)
    .innerJoin(organizations, eq(organizations.id, memberships.organizationId))
    .where(
      and(
        eq(memberships.userId, session.userId),
        eq(memberships.organizationId, session.activeOrganizationId)
      )
    )
    .limit(1);

  if (!membership) return null;

  return {
    userId: session.userId,
    organizationId: session.activeOrganizationId,
    role: membership.role,
    isAdmin: membership.isAdmin,
    organizationName: membership.organizationName,
    organizationType: membership.organizationType,
  };
}

export async function requireSession(): Promise<SessionData> {
  const session = await getSession();
  if (!session) throw new Error("Não autenticado");
  return session;
}

export async function requireRole(
  roles: Array<"instituto" | "empresa" | "profissional" | "parceiro">
): Promise<SessionData> {
  const session = await requireSession();
  if (!roles.includes(session.role)) {
    throw new Error(`Acesso negado. Perfil requerido: ${roles.join(" ou ")}`);
  }
  return session;
}
