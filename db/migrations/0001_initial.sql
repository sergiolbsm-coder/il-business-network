-- IL Business Network — migração inicial
-- Rodar via: psql $DATABASE_URL -f db/migrations/0001_initial.sql

CREATE TYPE role AS ENUM ('instituto', 'empresa', 'profissional', 'parceiro');
CREATE TYPE demand_status AS ENUM (
  'rascunho', 'enviada', 'em_qualificacao', 'em_matching',
  'recomendacoes_publicadas', 'conexao_autorizada', 'proposta',
  'ganha', 'perdida', 'cancelada'
);
CREATE TYPE connection_status AS ENUM (
  'solicitada', 'aguardando_autorizacao', 'autorizada',
  'contato_liberado', 'encerrada', 'recusada'
);

-- Identidade
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type role NOT NULL,
  logo_url TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  email_verified BOOLEAN DEFAULT FALSE NOT NULL,
  hashed_password TEXT,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role role NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  active_organization_id UUID REFERENCES organizations(id),
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Oportunidades
CREATE TABLE IF NOT EXISTS demands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  created_by_id UUID NOT NULL REFERENCES users(id),
  qualified_by_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  region TEXT NOT NULL,
  budget_range TEXT,
  urgency TEXT NOT NULL DEFAULT 'media',
  deadline TIMESTAMPTZ,
  status demand_status NOT NULL DEFAULT 'rascunho',
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  qualified_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  demand_id UUID NOT NULL REFERENCES demands(id),
  partner_organization_id UUID NOT NULL REFERENCES organizations(id),
  requested_by_id UUID NOT NULL REFERENCES users(id),
  authorized_by_id UUID REFERENCES users(id),
  status connection_status NOT NULL DEFAULT 'solicitada',
  interest_message TEXT,
  authorization_reason TEXT,
  contact_revealed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Auditoria (imutável — sem UPDATE/DELETE nesta tabela)
CREATE TABLE IF NOT EXISTS audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES users(id),
  actor_organization_id UUID REFERENCES organizations(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  metadata JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_memberships_user ON memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_org ON memberships(organization_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_demands_org ON demands(organization_id);
CREATE INDEX IF NOT EXISTS idx_demands_status ON demands(status);
CREATE INDEX IF NOT EXISTS idx_connections_demand ON connections(demand_id);
CREATE INDEX IF NOT EXISTS idx_connections_partner ON connections(partner_organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_events(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_resource ON audit_events(resource_type, resource_id);
