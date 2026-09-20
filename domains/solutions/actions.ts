"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { solutions, organizations } from "@/db/schema";
import { requireRole, requireSession } from "@/lib/auth/session";
import { eq, and } from "drizzle-orm";

export async function createSolutionAction(formData: FormData) {
  const session = await requireRole(["parceiro"]);

  await db.insert(solutions).values({
    organizationId: session.organizationId,
    createdById: session.userId,
    title: String(formData.get("title")),
    description: String(formData.get("description")),
    category: String(formData.get("category")),
    region: String(formData.get("region") ?? "nacional"),
    status: "ativa",
  });

  redirect("/partner/solutions");
}

export async function deleteSolutionAction(solutionId: string) {
  const session = await requireRole(["parceiro", "instituto"]);
  await db
    .delete(solutions)
    .where(
      session.role === "instituto"
        ? eq(solutions.id, solutionId)
        : and(eq(solutions.id, solutionId), eq(solutions.organizationId, session.organizationId))
    );
}

export async function updateSolutionStatusAction(solutionId: string, status: string) {
  const session = await requireRole(["parceiro", "instituto"]);
  await db
    .update(solutions)
    .set({ status, updatedAt: new Date() })
    .where(
      session.role === "instituto"
        ? eq(solutions.id, solutionId)
        : and(eq(solutions.id, solutionId), eq(solutions.organizationId, session.organizationId))
    );
}

export async function getMySolutions() {
  const session = await requireRole(["parceiro"]);
  return db
    .select({ solution: solutions, orgName: organizations.name })
    .from(solutions)
    .leftJoin(organizations, eq(solutions.organizationId, organizations.id))
    .where(eq(solutions.organizationId, session.organizationId))
    .orderBy(solutions.createdAt);
}

export async function getAllSolutions() {
  await requireSession();
  return db
    .select({ solution: solutions, orgName: organizations.name })
    .from(solutions)
    .leftJoin(organizations, eq(solutions.organizationId, organizations.id))
    .where(eq(solutions.status, "ativa"))
    .orderBy(solutions.createdAt);
}
