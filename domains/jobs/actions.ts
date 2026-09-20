"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { jobs, organizations } from "@/db/schema";
import { requireRole, requireSession } from "@/lib/auth/session";
import { eq, and } from "drizzle-orm";

export async function createJobAction(formData: FormData) {
  const session = await requireRole(["empresa", "instituto"]);

  const [org] = await db
    .select({ id: organizations.id })
    .from(organizations)
    .where(eq(organizations.id, session.organizationId))
    .limit(1);

  if (!org) throw new Error("Organização não encontrada");

  const [job] = await db.insert(jobs).values({
    organizationId: session.organizationId,
    createdById: session.userId,
    title: String(formData.get("title")),
    department: String(formData.get("department")),
    location: String(formData.get("location")),
    type: String(formData.get("type") ?? "clt"),
    description: String(formData.get("description")),
    requirements: formData.get("requirements") ? String(formData.get("requirements")) : null,
    salaryRange: formData.get("salary_range") ? String(formData.get("salary_range")) : null,
    status: "publicada",
  }).returning({ id: jobs.id });

  redirect(`/jobs`);
}

export async function updateJobStatusAction(jobId: string, status: string) {
  const session = await requireRole(["empresa", "instituto"]);

  await db
    .update(jobs)
    .set({ status, updatedAt: new Date() })
    .where(
      session.role === "instituto"
        ? eq(jobs.id, jobId)
        : and(eq(jobs.id, jobId), eq(jobs.organizationId, session.organizationId))
    );
}

export async function deleteJobAction(jobId: string) {
  const session = await requireRole(["empresa", "instituto"]);

  await db
    .delete(jobs)
    .where(
      session.role === "instituto"
        ? eq(jobs.id, jobId)
        : and(eq(jobs.id, jobId), eq(jobs.organizationId, session.organizationId))
    );
}

export async function getJobs() {
  const session = await requireSession();

  if (session.role === "instituto") {
    return db
      .select({ job: jobs, orgName: organizations.name })
      .from(jobs)
      .leftJoin(organizations, eq(jobs.organizationId, organizations.id))
      .orderBy(jobs.createdAt);
  }

  return db
    .select({ job: jobs, orgName: organizations.name })
    .from(jobs)
    .leftJoin(organizations, eq(jobs.organizationId, organizations.id))
    .where(
      session.role === "empresa"
        ? eq(jobs.organizationId, session.organizationId)
        : eq(jobs.status, "publicada")
    )
    .orderBy(jobs.createdAt);
}
