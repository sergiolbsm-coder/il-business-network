"use server";

import { db } from "@/lib/db";
import { demands, connections, organizations } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { z } from "zod";
import { requireSession } from "@/lib/auth/session";
import { requireRole, canQualifyDemand, canAuthorizeConnection, canViewDemand } from "@/lib/authorization";
import { recordAudit } from "@/lib/audit";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// ─── Empresa: Criar demanda ───────────────────────────────────────────────────

const createDemandSchema = z.object({
  title: z.string().min(5, "Título deve ter pelo menos 5 caracteres"),
  description: z.string().min(20, "Descrição muito curta"),
  category: z.string().min(1, "Categoria obrigatória"),
  region: z.string().min(1, "Região obrigatória"),
  budgetRange: z.string().optional(),
  urgency: z.enum(["baixa", "media", "alta"]).default("media"),
});

export async function createDemandAction(formData: FormData) {
  const session = await requireSession();
  requireRole({ userId: session.userId, organizationId: session.organizationId, role: session.role, isAdmin: session.isAdmin }, "empresa", "instituto");

  const parsed = createDemandSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    region: formData.get("region"),
    budgetRange: formData.get("budget_range") || undefined,
    urgency: formData.get("urgency") || "media",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const [demand] = await db
    .insert(demands)
    .values({
      organizationId: session.organizationId,
      createdById: session.userId,
      ...parsed.data,
      status: "rascunho",
    })
    .returning();

  await recordAudit({
    actorId: session.userId,
    actorOrganizationId: session.organizationId,
    action: "demand.created",
    resourceType: "demand",
    resourceId: demand.id,
    metadata: { title: demand.title, category: demand.category },
  });

  revalidatePath("/demands");
  redirect(`/demands/${demand.id}`);
}

// ─── Empresa: Submeter demanda para qualificação ──────────────────────────────

export async function submitDemandAction(demandId: string) {
  const session = await requireSession();
  requireRole({ userId: session.userId, organizationId: session.organizationId, role: session.role, isAdmin: session.isAdmin }, "empresa", "instituto");

  const [demand] = await db
    .select()
    .from(demands)
    .where(and(eq(demands.id, demandId), eq(demands.organizationId, session.organizationId)))
    .limit(1);

  if (!demand) return { error: "Demanda não encontrada" };
  if (demand.status !== "rascunho") return { error: "Demanda já foi enviada" };

  await db
    .update(demands)
    .set({ status: "enviada", updatedAt: new Date() })
    .where(eq(demands.id, demandId));

  await recordAudit({
    actorId: session.userId,
    actorOrganizationId: session.organizationId,
    action: "demand.submitted",
    resourceType: "demand",
    resourceId: demandId,
  });

  revalidatePath(`/demands/${demandId}`);
  revalidatePath("/demands");
}

// ─── Instituto: Qualificar demanda ───────────────────────────────────────────

const qualifyDemandSchema = z.object({
  internalNotes: z.string().optional(),
  publish: z.coerce.boolean().default(false),
});

export async function qualifyDemandAction(demandId: string, formData: FormData) {
  const session = await requireSession();
  requireRole({ userId: session.userId, organizationId: session.organizationId, role: session.role, isAdmin: session.isAdmin }, "instituto");

  const parsed = qualifyDemandSchema.safeParse({
    internalNotes: formData.get("internal_notes"),
    publish: formData.get("publish"),
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const newStatus = parsed.data.publish
    ? ("recomendacoes_publicadas" as const)
    : ("em_qualificacao" as const);

  await db
    .update(demands)
    .set({
      status: newStatus,
      qualifiedById: session.userId,
      qualifiedAt: new Date(),
      internalNotes: parsed.data.internalNotes,
      updatedAt: new Date(),
    })
    .where(eq(demands.id, demandId));

  await recordAudit({
    actorId: session.userId,
    actorOrganizationId: session.organizationId,
    action: parsed.data.publish ? "demand.published" : "demand.qualified",
    resourceType: "demand",
    resourceId: demandId,
    metadata: { publish: parsed.data.publish },
  });

  revalidatePath(`/demands/${demandId}`);
  revalidatePath("/demands");
  revalidatePath("/admin/demands");
}

// ─── Parceiro: Manifestar interesse (conexão) ─────────────────────────────────

const expressInterestSchema = z.object({
  interestMessage: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
});

export async function expressInterestAction(demandId: string, formData: FormData) {
  const session = await requireSession();
  requireRole({ userId: session.userId, organizationId: session.organizationId, role: session.role, isAdmin: session.isAdmin }, "parceiro");

  const parsed = expressInterestSchema.safeParse({
    interestMessage: formData.get("interest_message"),
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const [demand] = await db
    .select()
    .from(demands)
    .where(eq(demands.id, demandId))
    .limit(1);

  if (!demand || demand.status !== "recomendacoes_publicadas") {
    return { error: "Esta oportunidade não está disponível" };
  }

  // Verifica se já manifestou interesse
  const [existing] = await db
    .select({ id: connections.id })
    .from(connections)
    .where(
      and(
        eq(connections.demandId, demandId),
        eq(connections.partnerOrganizationId, session.organizationId)
      )
    )
    .limit(1);

  if (existing) return { error: "Você já manifestou interesse nesta oportunidade" };

  const [connection] = await db
    .insert(connections)
    .values({
      demandId,
      partnerOrganizationId: session.organizationId,
      requestedById: session.userId,
      interestMessage: parsed.data.interestMessage,
      status: "aguardando_autorizacao",
    })
    .returning();

  await recordAudit({
    actorId: session.userId,
    actorOrganizationId: session.organizationId,
    action: "connection.interest_expressed",
    resourceType: "connection",
    resourceId: connection.id,
    metadata: { demandId },
  });

  revalidatePath(`/partners/opportunities/${demandId}`);
}

// ─── Empresa / Instituto: Autorizar conexão ───────────────────────────────────

export async function authorizeConnectionAction(connectionId: string, authorize: boolean) {
  const session = await requireSession();
  requireRole({ userId: session.userId, organizationId: session.organizationId, role: session.role, isAdmin: session.isAdmin }, "empresa", "instituto");

  const [connection] = await db
    .select({ connection: connections, demand: demands })
    .from(connections)
    .innerJoin(demands, eq(demands.id, connections.demandId))
    .where(eq(connections.id, connectionId))
    .limit(1);

  if (!connection) return { error: "Conexão não encontrada" };
  if (!canAuthorizeConnection(
    { userId: session.userId, organizationId: session.organizationId, role: session.role, isAdmin: session.isAdmin },
    connection.demand
  )) {
    return { error: "Sem permissão para autorizar esta conexão" };
  }

  const newStatus = authorize
    ? ("contato_liberado" as const)
    : ("recusada" as const);

  await db
    .update(connections)
    .set({
      status: newStatus,
      authorizedById: session.userId,
      contactRevealedAt: authorize ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(connections.id, connectionId));

  if (authorize) {
    await db
      .update(demands)
      .set({ status: "conexao_autorizada", updatedAt: new Date() })
      .where(eq(demands.id, connection.demand.id));
  }

  await recordAudit({
    actorId: session.userId,
    actorOrganizationId: session.organizationId,
    action: authorize ? "connection.contact_revealed" : "connection.refused",
    resourceType: "connection",
    resourceId: connectionId,
    metadata: {
      demandId: connection.demand.id,
      partnerOrgId: connection.connection.partnerOrganizationId,
    },
  });

  revalidatePath("/demands");
  revalidatePath("/admin/connections");
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function getDemands() {
  const session = await requireSession();

  if (session.role === "instituto") {
    return db.select().from(demands).orderBy(demands.createdAt);
  }

  if (session.role === "empresa") {
    return db
      .select()
      .from(demands)
      .where(eq(demands.organizationId, session.organizationId))
      .orderBy(demands.createdAt);
  }

  if (session.role === "parceiro") {
    // Parceiro vê apenas demandas publicadas — SEM identidade da empresa
    return db
      .select({
        id: demands.id,
        title: demands.title,
        description: demands.description,
        category: demands.category,
        region: demands.region,
        budgetRange: demands.budgetRange,
        urgency: demands.urgency,
        status: demands.status,
        createdAt: demands.createdAt,
        // organizationId propositalmente omitido
      })
      .from(demands)
      .where(
        inArray(demands.status, ["recomendacoes_publicadas", "conexao_autorizada"])
      )
      .orderBy(demands.createdAt);
  }

  return [];
}

export async function getDemandById(demandId: string) {
  const session = await requireSession();

  const [row] = await db
    .select({
      demand: demands,
      company: organizations,
    })
    .from(demands)
    .leftJoin(organizations, eq(organizations.id, demands.organizationId))
    .where(eq(demands.id, demandId))
    .limit(1);

  if (!row) return null;

  if (!canViewDemand(
    { userId: session.userId, organizationId: session.organizationId, role: session.role, isAdmin: session.isAdmin },
    row.demand
  )) {
    return null;
  }

  // Parceiro não vê nome da empresa antes de conexão autorizada
  if (session.role === "parceiro" && row.demand.status !== "conexao_autorizada") {
    return { ...row, company: null };
  }

  return row;
}

export async function getConnectionsForDemand(demandId: string) {
  const session = await requireSession();
  requireRole({ userId: session.userId, organizationId: session.organizationId, role: session.role, isAdmin: session.isAdmin }, "empresa", "instituto");

  return db
    .select({
      connection: connections,
      partner: organizations,
    })
    .from(connections)
    .innerJoin(organizations, eq(organizations.id, connections.partnerOrganizationId))
    .where(eq(connections.demandId, demandId));
}

// ─── Wrappers void (para <form action={...}> sem retorno) ─────────────────────

export async function submitDemandVoidAction(demandId: string): Promise<void> {
  await submitDemandAction(demandId);
}

export async function authorizeConnectionVoidAction(connectionId: string, authorize: boolean): Promise<void> {
  await authorizeConnectionAction(connectionId, authorize);
}
