"use client";

import { Bell, Search } from "lucide-react";
import { logoutAction } from "@/lib/auth/actions";
import { useTransition } from "react";

const ROLE_LABELS: Record<string, string> = {
  instituto: "Administrador",
  empresa: "Empresa",
  profissional: "Profissional",
  parceiro: "Parceiro",
};

interface HeaderProps {
  userName: string;
  role: string;
}

export function Header({ userName, role }: HeaderProps) {
  const [pending, startTransition] = useTransition();
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="header">
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ position: "relative" }}>
          <Search
            size={16}
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--idl-text-muted)",
            }}
          />
          <input
            type="text"
            placeholder="Buscar..."
            style={{
              border: "1px solid var(--idl-border)",
              borderRadius: "8px",
              padding: "7px 12px 7px 32px",
              fontSize: "13px",
              color: "var(--idl-text)",
              background: "var(--idl-background-soft)",
              outline: "none",
              width: "220px",
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--idl-text-muted)",
            position: "relative",
          }}
        >
          <Bell size={18} />
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "4px 8px 4px 4px",
            borderRadius: "100px",
            border: "1px solid var(--idl-border)",
            cursor: "pointer",
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: "var(--idl-gradient)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: 700,
              color: "#FBF9FF",
            }}
          >
            {initials}
          </div>

          <div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--idl-text)", lineHeight: 1.2 }}>
              {userName}
            </div>
            <div style={{ fontSize: "11px", color: "var(--idl-text-muted)" }}>
              {ROLE_LABELS[role] ?? role}
            </div>
          </div>
        </div>

        <form action={logoutAction}>
          <button
            type="submit"
            disabled={pending}
            style={{
              fontSize: "12px",
              color: "var(--idl-text-muted)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 8px",
            }}
          >
            Sair
          </button>
        </form>
      </div>
    </header>
  );
}
