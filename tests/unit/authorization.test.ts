/**
 * Testes unitários — RBAC / autorização
 * Executar: npx tsx --test tests/unit/authorization.test.ts
 * (ou com vitest quando configurado)
 */

import { strict as assert } from "assert";
import {
  canCreateDemand,
  canViewDemand,
  canQualifyDemand,
  canPublishDemand,
  canExpressInterest,
  canAuthorizeConnection,
  canViewContactDetails,
  requireRole,
} from "../../lib/authorization/index";

type Ctx = { userId: string; organizationId: string; role: any; isAdmin: boolean };

const ctxInstituto: Ctx = { userId: "u1", organizationId: "org1", role: "instituto", isAdmin: true };
const ctxEmpresa: Ctx   = { userId: "u2", organizationId: "org2", role: "empresa",   isAdmin: true };
const ctxParceiro: Ctx  = { userId: "u3", organizationId: "org3", role: "parceiro",  isAdmin: false };
const ctxProf: Ctx      = { userId: "u4", organizationId: "org4", role: "profissional", isAdmin: false };

const demandOwned: any = {
  id: "d1", organizationId: "org2", status: "recomendacoes_publicadas",
  title: "T", description: "D", category: "C", region: "R", urgency: "media",
  createdAt: new Date(), updatedAt: new Date(), createdById: "u2",
  qualifiedById: null, budgetRange: null, deadline: null, internalNotes: null, qualifiedAt: null,
};
const demandOther: any = { ...demandOwned, id: "d2", organizationId: "org9" };
const demandRascunho: any = { ...demandOwned, status: "rascunho" };

const connectionRevealed: any = {
  id: "c1", demandId: "d1", partnerOrganizationId: "org3",
  status: "contato_liberado", requestedById: "u3", authorizedById: "u2",
  contactRevealedAt: new Date(), createdAt: new Date(), updatedAt: new Date(),
  interestMessage: null, authorizationReason: null,
};
const connectionPending: any = { ...connectionRevealed, status: "aguardando_autorizacao", contactRevealedAt: null };

// ─── canCreateDemand ─────────────────────────────────────────────────────────

assert.equal(canCreateDemand(ctxEmpresa), true, "empresa pode criar demanda");
assert.equal(canCreateDemand(ctxInstituto), true, "instituto pode criar demanda");
assert.equal(canCreateDemand(ctxParceiro), false, "parceiro NÃO pode criar demanda");
assert.equal(canCreateDemand(ctxProf), false, "profissional NÃO pode criar demanda");

// ─── canViewDemand ────────────────────────────────────────────────────────────

assert.equal(canViewDemand(ctxInstituto, demandOther), true, "instituto vê qualquer demanda");
assert.equal(canViewDemand(ctxEmpresa, demandOwned), true, "empresa vê própria demanda");
assert.equal(canViewDemand(ctxEmpresa, demandOther), false, "empresa NÃO vê demanda de outra org");
assert.equal(canViewDemand(ctxParceiro, demandOwned), true, "parceiro vê demanda publicada");
assert.equal(canViewDemand(ctxParceiro, demandRascunho), false, "parceiro NÃO vê rascunho");

// ─── canQualifyDemand / canPublishDemand ──────────────────────────────────────

assert.equal(canQualifyDemand(ctxInstituto), true, "instituto qualifica");
assert.equal(canQualifyDemand(ctxEmpresa), false, "empresa NÃO qualifica");
assert.equal(canPublishDemand(ctxInstituto), true, "instituto publica");
assert.equal(canPublishDemand(ctxParceiro), false, "parceiro NÃO publica");

// ─── canExpressInterest ───────────────────────────────────────────────────────

assert.equal(canExpressInterest(ctxParceiro), true, "parceiro manifesta interesse");
assert.equal(canExpressInterest(ctxEmpresa), false, "empresa NÃO manifesta interesse");

// ─── canAuthorizeConnection ───────────────────────────────────────────────────

assert.equal(canAuthorizeConnection(ctxInstituto, demandOther), true, "instituto autoriza qualquer");
assert.equal(canAuthorizeConnection(ctxEmpresa, demandOwned), true, "empresa autoriza conexão da própria demanda");
assert.equal(canAuthorizeConnection(ctxEmpresa, demandOther), false, "empresa NÃO autoriza conexão de outra org");
assert.equal(canAuthorizeConnection(ctxParceiro, demandOwned), false, "parceiro NÃO autoriza");

// ─── canViewContactDetails ────────────────────────────────────────────────────

assert.equal(canViewContactDetails(ctxInstituto, connectionPending), true, "instituto vê contato sempre");
assert.equal(canViewContactDetails(ctxEmpresa, connectionRevealed), true, "empresa vê contato revelado");
assert.equal(canViewContactDetails(ctxEmpresa, connectionPending), false, "empresa NÃO vê contato pendente");
assert.equal(canViewContactDetails(ctxParceiro, connectionRevealed), true, "parceiro vê contato revelado (própria org)");
assert.equal(canViewContactDetails({ ...ctxParceiro, organizationId: "org99" }, connectionRevealed), false, "parceiro diferente NÃO vê contato");

// ─── requireRole ──────────────────────────────────────────────────────────────

assert.doesNotThrow(() => requireRole(ctxInstituto, "instituto"), "requireRole instituto OK");
assert.throws(() => requireRole(ctxEmpresa, "instituto"), "requireRole lança erro para perfil errado");

console.log("✅ Todos os testes de autorização passaram!");
