"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { recognitions } from "@/db/schema";
import { requireRole, requireSession } from "@/lib/auth/session";
import { eq } from "drizzle-orm";

export async function createRecognitionAction(formData: FormData) {
  const session = await requireRole(["instituto"]);

  await db.insert(recognitions).values({
    organizationId: session.organizationId,
    createdById: session.userId,
    recipientName: String(formData.get("recipientName")),
    title: String(formData.get("title")),
    reason: String(formData.get("reason")),
    points: Number(formData.get("points") || 0),
  });

  redirect("/recognitions");
}

export async function deleteRecognitionAction(formData: FormData) {
  await requireRole(["instituto"]);
  await db.delete(recognitions).where(eq(recognitions.id, String(formData.get("recognitionId"))));
  revalidatePath("/recognitions");
}

export async function getRecognitions() {
  await requireSession();
  return db.select().from(recognitions).orderBy(recognitions.createdAt);
}
