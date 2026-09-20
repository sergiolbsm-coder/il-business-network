import Link from "next/link";
import Image from "next/image";
import {
  MessageSquare,
  LayoutDashboard,
  FileText,
  Users,
  Package,
  Calendar,
  Trophy,
  Gift,
  BookOpen,
  Award,
  Building2,
  Briefcase,
  Star,
  Target,
  TrendingUp,
  Shield,
} from "lucide-react";

type Role = "instituto" | "empresa" | "profissional" | "parceiro";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  instituto: [
    { href: "/community",        label: "Comunidade",         icon: <MessageSquare size={16} /> },
    { href: "/admin",            label: "Visão geral",         icon: <LayoutDashboard size={16} /> },
    { href: "/admin/demands",    label: "Demandas",            icon: <FileText size={16} /> },
    { href: "/admin/talents",    label: "Talentos e vagas",    icon: <Users size={16} /> },
    { href: "/admin/partners",   label: "Soluções e parceiros",icon: <Package size={16} /> },
    { href: "/events",           label: "Eventos",             icon: <Calendar size={16} /> },
    { href: "/challenges",       label: "Desafios",            icon: <Trophy size={16} /> },
    { href: "/rewards",          label: "Recompensas",         icon: <Gift size={16} /> },
    { href: "/recognitions",     label: "Reconhecimentos",     icon: <Award size={16} /> },
    { href: "/content",          label: "Conteúdos",           icon: <BookOpen size={16} /> },
  ],
  empresa: [
    { href: "/community",        label: "Comunidade",         icon: <MessageSquare size={16} /> },
    { href: "/dashboard",        label: "Painel da empresa",   icon: <Building2 size={16} /> },
    { href: "/demands",          label: "Meus desafios",       icon: <FileText size={16} /> },
    { href: "/jobs",             label: "Minhas vagas",        icon: <Briefcase size={16} /> },
    { href: "/recommended",      label: "Soluções recomendadas",icon: <Star size={16} /> },
    { href: "/events",           label: "Eventos",             icon: <Calendar size={16} /> },
    { href: "/content",          label: "Conteúdos",           icon: <BookOpen size={16} /> },
  ],
  profissional: [
    { href: "/community",        label: "Comunidade",         icon: <MessageSquare size={16} /> },
    { href: "/journey",          label: "Minha jornada",       icon: <TrendingUp size={16} /> },
    { href: "/opportunities",    label: "Oportunidades",       icon: <Target size={16} /> },
    { href: "/applications",     label: "Candidaturas",        icon: <FileText size={16} /> },
    { href: "/events",           label: "Eventos",             icon: <Calendar size={16} /> },
    { href: "/challenges",       label: "Desafios",            icon: <Trophy size={16} /> },
    { href: "/rewards",          label: "Recompensas",         icon: <Gift size={16} /> },
  ],
  parceiro: [
    { href: "/community",           label: "Comunidade",       icon: <MessageSquare size={16} /> },
    { href: "/partner/dashboard",   label: "Meu desempenho",   icon: <TrendingUp size={16} /> },
    { href: "/partner/opportunities",label: "Oportunidades B2B",icon: <Target size={16} /> },
    { href: "/partner/solutions",   label: "Minhas soluções",  icon: <Package size={16} /> },
    { href: "/partner/proposals",   label: "Propostas",        icon: <FileText size={16} /> },
    { href: "/events",              label: "Eventos",          icon: <Calendar size={16} /> },
    { href: "/challenges",          label: "Desafios",         icon: <Trophy size={16} /> },
    { href: "/benefits",            label: "Benefícios",       icon: <Gift size={16} /> },
  ],
};

const ROLE_LABELS: Record<Role, string> = {
  instituto: "Instituto",
  empresa: "Empresa",
  profissional: "Profissional",
  parceiro: "Parceiro",
};

interface SidebarProps {
  role: Role;
  currentPath: string;
  organizationName: string;
}

export function Sidebar({ role, currentPath, organizationName }: SidebarProps) {
  const navItems = NAV_BY_ROLE[role];

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div style={{ textAlign: "center" }}>
          <Image
            src="/logo.png"
            alt="Instituto da Liderança"
            width={140}
            height={56}
            style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }}
            priority
          />
          <div className="sidebar-logo-sub" style={{ marginTop: "4px" }}>B2B</div>
        </div>
      </div>

      {/* Org info */}
      <div style={{ padding: "12px 16px", marginBottom: "4px" }}>
        <div style={{
          fontSize: "11px",
          color: "rgba(255,255,255,.4)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          fontFamily: "'JetBrains Mono', monospace",
          marginBottom: "4px",
        }}>
          {ROLE_LABELS[role]}
        </div>
        <div style={{
          fontSize: "13px",
          fontWeight: 600,
          color: "rgba(255,255,255,.85)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          {organizationName}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, paddingTop: "8px" }}>
        <div className="nav-section">Navegação</div>
        {navItems.map((item) => {
          const isActive = currentPath === item.href || currentPath.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Rede curada notice */}
      <div className="rede-curada-notice">
        <Shield size={14} style={{ flexShrink: 0, marginTop: 1, color: "rgba(255,0,96,.8)" }} />
        <div>
          <div style={{ fontWeight: 600, fontSize: "10px", color: "rgba(255,0,96,.9)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "2px" }}>
            Rede Curada
          </div>
          <div style={{ fontSize: "11px", lineHeight: "1.4" }}>
            Contatos são liberados somente após análise e autorização.
          </div>
        </div>
      </div>
    </aside>
  );
}
