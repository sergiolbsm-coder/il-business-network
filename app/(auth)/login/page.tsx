import { loginAction } from "@/lib/auth/actions";
import { FormAction } from "@/components/ui/FormAction";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--idl-gradient-light)",
        padding: "24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>
        {/* Logo / título */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "32px",
              fontWeight: 700,
              color: "var(--idl-purple-dark)",
              marginBottom: "4px",
            }}
          >
            Instituto
          </div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.2em",
              color: "var(--idl-text-muted)",
              textTransform: "uppercase",
            }}
          >
            DA LIDERANÇA · B2B
          </div>
          <div
            style={{
              width: "40px",
              height: "3px",
              background: "var(--idl-gradient)",
              borderRadius: "2px",
              margin: "12px auto 0",
            }}
          />
        </div>

        <div className="card">
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 700,
              marginBottom: "6px",
              color: "var(--idl-purple-dark)",
            }}
          >
            Entrar na plataforma
          </h1>
          <p style={{ fontSize: "14px", color: "var(--idl-text-muted)", marginBottom: "24px" }}>
            Acesse sua conta do IL Business Network
          </p>

          <FormAction action={loginAction} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label" htmlFor="email">E-mail</label>
              <input
                className="input"
                type="email"
                id="email"
                name="email"
                placeholder="seu@email.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label" htmlFor="password">Senha</label>
              <input
                className="input"
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              Entrar
            </button>
          </FormAction>

          <div style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "var(--idl-text-muted)" }}>
            Não tem conta?{" "}
            <Link href="/register" style={{ color: "var(--idl-purple)", fontWeight: 600, textDecoration: "none" }}>
              Cadastre-se
            </Link>
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "24px",
            fontSize: "11px",
            color: "var(--idl-text-muted)",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          Instituto da Liderança · Curitiba, PR
        </div>
      </div>
    </div>
  );
}
