"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { rewards } from "@/db/schema";
import { requireRole, requireSession } from "@/lib/auth/session";
import { eq } from "drizzle-orm";

export async function createRewardAction(formData: FormData) {
  const session = await requireRole(["instituto"]);

  await db.insert(rewards).values({
    organizationId: session.organizationId,
    createdById: session.userId,
    title: String(formData.get("title")),
    description: String(formData.get("description")),
    points: Number(formData.get("points") || 0),
    status: "ativo",
  });

  redirect("/rewards");
}

export async function deleteRewardAction(formData: FormData) {
  await requireRole(["instituto"]);
  await db.delete(rewards).where(eq(rewards.id, String(formData.get("rewardId"))));
  revalidatePath("/rewards");
}

export async function updateRewardStatusAction(formData: FormData) {
  await requireRole(["instituto"]);
  const id = String(formData.get("rewardId"));
  const status = String(formData.get("status"));
  await db.update(rewards).set({ status, updatedAt: new Date() }).where(eq(rewards.id, id));
  revalidatePath("/rewards");
}

export async function getRewards() {
  await requireSession();
  return db.select().from(rewards).orderBy(rewards.createdAt);
}
