"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { events, organizations } from "@/db/schema";
import { requireRole, requireSession } from "@/lib/auth/session";
import { eq, and, gte } from "drizzle-orm";

export async function createEventAction(formData: FormData) {
  await requireRole(["instituto"]);
  const session = await requireRole(["instituto"]);

  await db.insert(events).values({
    organizationId: session.organizationId,
    createdById: session.userId,
    title: String(formData.get("title")),
    description: String(formData.get("description")),
    eventDate: new Date(String(formData.get("event_date"))),
    location: formData.get("location") ? String(formData.get("location")) : null,
    format: String(formData.get("format") ?? "online"),
    capacity: formData.get("capacity") ? Number(formData.get("capacity")) : null,
    status: "publicado",
  });

  redirect("/events");
}

export async function deleteEventAction(eventId: string) {
  await requireRole(["instituto"]);
  await db.delete(events).where(eq(events.id, eventId));
}

export async function updateEventStatusAction(eventId: string, status: string) {
  await requireRole(["instituto"]);
  await db.update(events).set({ status, updatedAt: new Date() }).where(eq(events.id, eventId));
}

export async function getEvents() {
  await requireSession();
  return db
    .select({ event: events, orgName: organizations.name })
    .from(events)
    .leftJoin(organizations, eq(events.organizationId, organizations.id))
    .orderBy(events.eventDate);
}
