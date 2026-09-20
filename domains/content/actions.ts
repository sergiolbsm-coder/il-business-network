"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { contentItems, organizations } from "@/db/schema";
import { requireRole, requireSession } from "@/lib/auth/session";
import { eq, and } from "drizzle-orm";

export async function createContentAction(formData: FormData) {
  const session = await requireRole(["instituto"]);

  await db.insert(contentItems).values({
    organizationId: session.organizationId,
    createdById: session.userId,
    title: String(formData.get("title")),
    summary: String(formData.get("summary")),
    body: String(formData.get("body")),
    category: String(formData.get("category")),
    status: "publicado",
  });

  redirect("/content");
}

export async function deleteContentAction(contentId: string) {
  await requireRole(["instituto"]);
  await db.delete(contentItems).where(eq(contentItems.id, contentId));
}

export async function updateContentStatusAction(contentId: string, status: string) {
  await requireRole(["instituto"]);
  await db.update(contentItems).set({ status, updatedAt: new Date() }).where(eq(contentItems.id, contentId));
}

export async function getContentItems() {
  await requireSession();
  return db
    .select({ item: contentItems, orgName: organizations.name })
    .from(contentItems)
    .leftJoin(organizations, eq(contentItems.organizationId, organizations.id))
    .where(eq(contentItems.status, "publicado"))
    .orderBy(contentItems.createdAt);
}

export async function getAllContentItems() {
  await requireRole(["instituto"]);
  return db
    .select({ item: contentItems, orgName: organizations.name })
    .from(contentItems)
    .leftJoin(organizations, eq(contentItems.organizationId, organizations.id))
    .orderBy(contentItems.createdAt);
}
