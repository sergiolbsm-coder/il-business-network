import { db } from "@/lib/db";
import { auditEvents } from "@/db/schema";

export type AuditAction =
  | "demand.created"
  | "demand.submitted"
  | "demand.qualified"
  | "demand.published"
  | "connection.interest_expressed"
  | "connection.authorized"
  | "connection.refused"
  | "connection.contact_revealed"
  | "user.login"
  | "user.logout";

interface AuditParams {
  actorId: string;
  actorOrganizationId: string;
  action: AuditAction;
  resourceType: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
}

export async function recordAudit(params: AuditParams): Promise<void> {
  await db.insert(auditEvents).values({
    actorId: params.actorId,
    actorOrganizationId: params.actorOrganizationId,
    action: params.action,
    resourceType: params.resourceType,
    resourceId: params.resourceId,
    metadata: params.metadata ?? null,
    ipAddress: params.ipAddress,
  });
}
