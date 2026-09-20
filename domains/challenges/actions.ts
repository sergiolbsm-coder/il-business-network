"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { challenges } from "@/db/schema";
import { requireRole, requireSession } from "@/lib/auth/session";
import { eq } from "drizzle-orm";

export async function createChallengeAction(formData: FormData) {
  const session = await requireRole(["instituto"]);
  const deadlineVal = String(formData.get("deadline"));

  await db.insert(challenges).values({
    organizationId: session.organizationId,
    createdById: session.userId,
    title: String(formData.get("title")),
    description: String(formData.get("description")),
    category: String(formData.get("category") || "geral"),
    deadline: deadlineVal ? new Date(deadlineVal) : null,
    points: Number(formData.get("points") || 0),
    status: "ativo",
  });

  redirect("/challenges");
}

export async function deleteChallengeAction(formData: FormData) {
  await requireRole(["instituto"]);
  await db.delete(challenges).where(eq(challenges.id, String(formData.get("challengeId"))));
  revalidatePath("/challenges");
}

export async function updateChallengeStatusAction(formData: FormData) {
  await requireRole(["instituto"]);
  const id = String(formData.get("challengeId"));
  const status = String(formData.get("status"));
  await db.update(challenges).set({ status, updatedAt: new Date() }).where(eq(challenges.id, id));
  revalidatePath("/challenges");
}

export async function getChallenges() {
  await requireSession();
  return db.select().from(challenges).orderBy(challenges.createdAt);
}
