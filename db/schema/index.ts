import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  pgEnum,
  uuid,
} from "drizzle-orm/pg-core";

// ─── Enums ──────────────────────────────────────────────────────────────────

export const roleEnum = pgEnum("role", [
  "instituto",
  "empresa",
  "profissional",
  "parceiro",
]);

export const demandStatusEnum = pgEnum("demand_status", [
  "rascunho",
  "enviada",
  "em_qualificacao",
  "em_matching",
  "recomendacoes_publicadas",
  "conexao_autorizada",
  "proposta",
  "ganha",
  "perdida",
  "cancelada",
]);

export const connectionStatusEnum = pgEnum("connection_status", [
  "solicitada",
  "aguardando_autorizacao",
  "autorizada",
  "contato_liberado",
  "encerrada",
  "recusada",
]);

// ─── Identidade ──────────────────────────────────────────────────────────────

export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  type: roleEnum("type").notNull(),
  logoUrl: text("logo_url"),
  website: text("website"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  hashedPassword: text("hashed_password"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const memberships = pgTable("memberships", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  role: roleEnum("role").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  activeOrganizationId: uuid("active_organization_id").references(
    () => organizations.id
  ),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Oportunidades (vertical slice) ─────────────────────────────────────────

export const demands = pgTable("demands", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id),
  createdById: uuid("created_by_id")
    .notNull()
    .references(() => users.id),
  qualifiedById: uuid("qualified_by_id").references(() => users.id),

  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  region: text("region").notNull(),
  budgetRange: text("budget_range"),
  urgency: text("urgency").notNull().default("media"),
  deadline: timestamp("deadline"),

  status: demandStatusEnum("status").notNull().default("rascunho"),
  internalNotes: text("internal_notes"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  qualifiedAt: timestamp("qualified_at"),
});

export const connections = pgTable("connections", {
  id: uuid("id").primaryKey().defaultRandom(),
  demandId: uuid("demand_id")
    .notNull()
    .references(() => demands.id),
  partnerOrganizationId: uuid("partner_organization_id")
    .notNull()
    .references(() => organizations.id),
  requestedById: uuid("requested_by_id")
    .notNull()
    .references(() => users.id),
  authorizedById: uuid("authorized_by_id").references(() => users.id),

  status: connectionStatusEnum("status").notNull().default("solicitada"),
  interestMessage: text("interest_message"),
  authorizationReason: text("authorization_reason"),

  contactRevealedAt: timestamp("contact_revealed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Auditoria ───────────────────────────────────────────────────────────────

export const auditEvents = pgTable("audit_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorId: uuid("actor_id").references(() => users.id),
  actorOrganizationId: uuid("actor_organization_id").references(
    () => organizations.id
  ),
  action: text("action").notNull(),
  resourceType: text("resource_type").notNull(),
  resourceId: uuid("resource_id"),
  metadata: jsonb("metadata"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Tipos exportados ────────────────────────────────────────────────────────

export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Membership = typeof memberships.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Demand = typeof demands.$inferSelect;
export type NewDemand = typeof demands.$inferInsert;
export type Connection = typeof connections.$inferSelect;
export type AuditEvent = typeof auditEvents.$inferSelect;
