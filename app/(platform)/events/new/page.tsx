import { requireRole } from "@/lib/auth/session";
import { createEventAction } from "@/domains/events/actions";
import { FormAction } from "@/components/ui/FormAction";
import Link from "next/link";

export default async function NewEventPage() {
  await requireRole(["instituto"]);

  return (
    <div className="page-container" style={{ maxWidth: "720px" }}>
      <div style={{ marginBottom: "24px" }}>
        <Link href="/events" style={{ fontSize: "13px", color: "var(--idl-text-muted)", textDecoration: "none" }}>
          ← Voltar para eventos
        </Link>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginTop: "12px", marginBottom: "4px" }}>Criar evento</h1>
        <p style={{ fontSize: "14px", color: "var(--idl-text-muted)" }}>Publique um novo evento para a rede.</p>
      </div>

      <div className="card">
        <FormAction action={createEventAction}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label className="form-label">Título do evento *</label>
              <input name="title" className="form-input" placeholder="Ex: Workshop de Liderança Adaptativa" required />
            </div>

            <div>
              <label className="form-label">Descrição *</label>
              <textarea name="description" className="form-input" rows={4} placeholder="Descreva o conteúdo, palestrantes e objetivos do evento..." required style={{ resize: "vertical" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label className="form-label">Data e horário *</label>
                <input name="event_date" type="datetime-local" className="form-input" required />
              </div>
              <div>
                <label className="form-label">Formato *</label>
                <select name="format" className="form-input" required>
                  <option value="online">Online</option>
                  <option value="presencial">Presencial</option>
                  <option value="hibrido">Híbrido</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label className="form-label">Local / Link</label>
                <input name="location" className="form-input" placeholder="Ex: São Paulo, SP ou link do Zoom" />
              </div>
              <div>
                <label className="form-label">Capacidade (vagas)</label>
                <input name="capacity" type="number" className="form-input" placeholder="Ex: 50" min="1" />
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", paddingTop: "8px", borderTop: "1px solid var(--idl-border)" }}>
              <Link href="/events" className="btn-outline" style={{ fontSize: "14px" }}>Cancelar</Link>
              <button type="submit" className="btn-primary" style={{ fontSize: "14px" }}>Publicar evento</button>
            </div>
          </div>
        </FormAction>
      </div>
    </div>
  );
}
