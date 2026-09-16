import { registerAction } from "@/lib/auth/actions";
import { FormAction } from "@/components/ui/FormAction";
import Link from "next/link";

export default function RegisterPage() {
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
      <div style={{ width: "100%", maxWidth: "480px" }}>
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
          <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "6px", color: "var(--idl-purple-dark)" }}>
            Criar conta
          </h1>
          <p style={{ fontSize: "14px", color: "var(--idl-text-muted)", marginBottom: "24px" }}>
            Junte-se à rede curada do Instituto da Liderança
          </p>

          <FormAction action={registerAction} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label" htmlFor="name">Seu nome *</label>
              <input
                className="input"
                type="text"
                id="name"
                name="name"
                placeholder="Ana Horizonte"
                required
                autoComplete="name"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label" htmlFor="email">E-mail *</label>
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
              <label className="label" htmlFor="password">Senha *</label>
              <input
                className="input"
                type="password"
                id="password"
                name="password"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label" htmlFor="organization_name">Nome da organização *</label>
              <input
                className="input"
                type="text"
                id="organization_name"
                name="organization_name"
                placeholder="Clínica Horizonte"
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label" htmlFor="role">Perfil *</label>
              <select className="select" id="role" name="role" required>
                <option value="">Selecione seu perfil...</option>
                <option value="empresa">Empresa — tenho desafios e quero soluções</option>
                <option value="parceiro">Parceiro — ofereço soluções B2B</option>
                <option value="profissional">Profissional — busco oportunidades executivas</option>
              </select>
              <div style={{ fontSize: "11px", color: "var(--idl-text-muted)", marginTop: "4px" }}>
                Acesso do Instituto é concedido diretamente pela equipe.
              </div>
            </div>

            <div
              style={{
                padding: "12px 16px",
                background: "rgba(57,22,148,.04)",
                border: "1px solid var(--idl-border)",
                borderRadius: "var(--r-sm)",
                fontSize: "12px",
                color: "var(--idl-text-muted)",
                lineHeight: "1.5",
              }}
            >
              Ao criar sua conta, você aceita os{" "}
              <span style={{ color: "var(--idl-purple)", fontWeight: 600 }}>Termos de Uso</span> e a{" "}
              <span style={{ color: "var(--idl-purple)", fontWeight: 600 }}>Política de Privacidade</span> do Instituto da Liderança.
              Seus dados são tratados conforme a LGPD.
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              Criar conta
            </button>
          </FormAction>

          <div style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "var(--idl-text-muted)" }}>
            Já tem conta?{" "}
            <Link href="/login" style={{ color: "var(--idl-purple)", fontWeight: 600, textDecoration: "none" }}>
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
