/**
 * Seed fictício — dados EXCLUSIVAMENTE para demonstração.
 * Nunca use dados reais de candidatos, empresas ou assessments.
 *
 * Executar: npx tsx db/seed.ts
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema/index";
import { createHash } from "crypto";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

function hashPassword(password: string): string {
  return createHash("sha256").update("ilbn_salt_2024" + password).digest("hex");
}

async function seed() {
  console.log("🌱 Iniciando seed fictício...");

  // Organizações
  const [orgInstituto] = await db
    .insert(schema.organizations)
    .values({
      name: "Instituto da Liderança",
      slug: "instituto-da-lideranca",
      type: "instituto",
      website: "https://institutolideranca.com.br",
    })
    .onConflictDoNothing()
    .returning();

  const [orgClinica] = await db
    .insert(schema.organizations)
    .values({
      name: "Clínica Horizonte",
      slug: "clinica-horizonte",
      type: "empresa",
    })
    .onConflictDoNothing()
    .returning();

  const [orgTech] = await db
    .insert(schema.organizations)
    .values({
      name: "TechSaúde Soluções",
      slug: "techsaude-solucoes",
      type: "parceiro",
    })
    .onConflictDoNothing()
    .returning();

  if (!orgInstituto || !orgClinica || !orgTech) {
    console.log("ℹ️  Seed já executado. Pulando...");
    return;
  }

  // Usuários fictícios
  const [userAdmin] = await db.insert(schema.users).values({
    name: "Sergio Moura",
    email: "admin@institutolideranca.com.br",
    emailVerified: true,
    hashedPassword: hashPassword("admin123"),
  }).returning();

  const [userEmpresa] = await db.insert(schema.users).values({
    name: "Ana Horizonte",
    email: "ana@clinicahorizonte.com.br",
    emailVerified: true,
    hashedPassword: hashPassword("empresa123"),
  }).returning();

  const [userParceiro] = await db.insert(schema.users).values({
    name: "Carlos Tech",
    email: "carlos@techsaude.com.br",
    emailVerified: true,
    hashedPassword: hashPassword("parceiro123"),
  }).returning();

  // Memberships
  await db.insert(schema.memberships).values([
    { userId: userAdmin.id, organizationId: orgInstituto.id, role: "instituto", isAdmin: true },
    { userId: userEmpresa.id, organizationId: orgClinica.id, role: "empresa", isAdmin: true },
    { userId: userParceiro.id, organizationId: orgTech.id, role: "parceiro", isAdmin: true },
  ]);

  // Sessões com org ativa
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await db.insert(schema.sessions).values([
    { userId: userAdmin.id, activeOrganizationId: orgInstituto.id, token: "seed-token-admin", expiresAt },
    { userId: userEmpresa.id, activeOrganizationId: orgClinica.id, token: "seed-token-empresa", expiresAt },
    { userId: userParceiro.id, activeOrganizationId: orgTech.id, token: "seed-token-parceiro", expiresAt },
  ]);

  // Demanda fictícia publicada (para parceiro ver)
  const [demand] = await db.insert(schema.demands).values({
    organizationId: orgClinica.id,
    createdById: userEmpresa.id,
    qualifiedById: userAdmin.id,
    title: "Gestão de saúde ocupacional para 180 funcionários",
    description: `Nossa clínica cresceu 60% nos últimos 18 meses e precisamos estruturar um programa de saúde ocupacional consistente para 180 colaboradores distribuídos em 3 unidades na Grande Curitiba.

Buscamos um parceiro que possa oferecer: exames admissionais e periódicos, PCMSO, laudos ASO, gestão de afastamentos e integração com nosso sistema de RH (TOTVS).

Já tentamos resolver internamente mas falta expertise. O parceiro ideal tem experiência no setor de saúde e atende empresas de porte similar.`,
    category: "Saúde Ocupacional",
    region: "Curitiba (PR)",
    budgetRange: "R$ 10.000 – R$ 30.000/mês",
    urgency: "alta",
    status: "recomendacoes_publicadas",
    qualifiedAt: new Date(),
    internalNotes: "Demanda bem estruturada. Empresa verificada. Urgência real — PCMSO vencendo em 60 dias.",
  }).returning();

  console.log("✅ Seed concluído com sucesso!");
  console.log("\n📋 Credenciais de acesso (FICTÍCIAS — apenas para demo):");
  console.log("─────────────────────────────────────────────────────────");
  console.log("🏛  Instituto: admin@institutolideranca.com.br / admin123");
  console.log("🏢  Empresa:   ana@clinicahorizonte.com.br    / empresa123");
  console.log("🤝  Parceiro:  carlos@techsaude.com.br        / parceiro123");
  console.log("─────────────────────────────────────────────────────────");
  console.log(`\n🎯 Demanda criada: "${demand.title}"`);
  console.log("   Status: recomendacoes_publicadas (visível para parceiros)");
}

seed().catch(console.error);
