"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { posts } from "@/db/schema";
import { requireSession, requireRole } from "@/lib/auth/session";
import { eq } from "drizzle-orm";

export async function createPostAction(formData: FormData) {
  const session = await requireSession();
  const content = String(formData.get("content")).trim();
  if (!content) return;

  await db.insert(posts).values({
    organizationId: session.organizationId,
    createdById: session.userId,
    authorName: session.organizationName,
    content,
    status: "publicado",
  });

  revalidatePath("/community");
}

export async function deletePostAction(formData: FormData) {
  await requireRole(["instituto"]);
  const postId = String(formData.get("postId"));
  await db.delete(posts).where(eq(posts.id, postId));
  revalidatePath("/community");
}

export async function getPosts() {
  await requireSession();
  return db
    .select()
    .from(posts)
    .where(eq(posts.status, "publicado"))
    .orderBy(posts.createdAt);
}
