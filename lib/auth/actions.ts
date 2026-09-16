"use server";

import { db } from "@/lib/db";
import { users, sessions, memberships, organizations } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";
import { z } from "zod";
import { randomUUID } from "crypto";
import { createHash } from "crypto";
import { redirect } from "next/navigation";

function hashPassword(password: string): string {
  // Em produção usar bcrypt — aqui SHA256+salt para MVP sem dependência nativa
  const salt = "ilbn_salt_2024";
  return createHash("sha256")
    .update(salt + password)
    .digest("hex");
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { email, password } = parsed.data;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user || !user.hashedPassword || !verifyPassword(password, user.hashedPassword)) {
    return { error: "E-mail ou senha inválidos" };
  }

  // Busca o primeiro membership do usuário
  const [membership] = await db
    .select({ organizationId: memberships.organizationId })
    .from(memberships)
    .where(eq(memberships.userId, user.id))
    .limit(1);

  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias

  await db.insert(sessions).values({
    userId: user.id,
    activeOrganizationId: membership?.organizationId ?? null,
    token,
    expiresAt,
  });

  const cookieStore = await cookies();
  cookieStore.set("session_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
  });

  redirect("/community");
}

const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  organizationName: z.string().min(2, "Nome da organização inválido"),
  role: z.enum(["empresa", "profissional", "parceiro"]),
});

export async function registerAction(formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    organizationName: formData.get("organization_name"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, email, password, organizationName, role } = parsed.data;

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    return { error: "E-mail já cadastrado" };
  }

  const userId = randomUUID();
  const orgId = randomUUID();
  const slug = organizationName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    + "-" + orgId.slice(0, 6);

  await db.insert(users).values({
    id: userId,
    name,
    email,
    hashedPassword: hashPassword(password),
    emailVerified: true,
  });

  await db.insert(organizations).values({
    id: orgId,
    name: organizationName,
    slug,
    type: role,
  });

  await db.insert(memberships).values({
    userId,
    organizationId: orgId,
    role,
    isAdmin: true,
  });

  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await db.insert(sessions).values({
    userId,
    activeOrganizationId: orgId,
    token,
    expiresAt,
  });

  const cookieStore = await cookies();
  cookieStore.set("session_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
  });

  redirect("/community");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (token) {
    await db.delete(sessions).where(eq(sessions.token, token));
    cookieStore.delete("session_token");
  }

  redirect("/login");
}
