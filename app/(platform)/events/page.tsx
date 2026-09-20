import { requireSession } from "@/lib/auth/session";
import { getEvents, deleteEventAction, updateEventStatusAction } from "@/domains/events/actions";
import { Calendar, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";

const FORMAT_LABELS: Record<string, string> = { online: "Online", presencial: "Presencial", hibrido: "Híbrido" };
const STATUS_CLASS: Record<string, string> = { publicado: "badge-success", rascunho: "badge-muted", cancelado: "badge-error", encerrado: "badge-muted" };

async function deleteEvent(formData: FormData) {
  "use server";
  await deleteEventAction(String(formData.get("eventId")));
}

async function cancelEvent(formData: FormData) {
  "use server";
  await updateEventStatusAction(String(formData.get("eventId")), "cancelado");
}

export default async function EventsPage() {
  const session = await requireSession();
  const rows = await getEvents();

  const isAdmin = session.role === "instituto";

  return (
    <div className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>Eventos</h1>
          <p style={{ fontSize: "14px", color: "var(--idl-text-muted)" }}>
            {rows.length} evento{rows.length !== 1 ? "s" : ""} disponível{rows.length !== 1 ? "is" : ""}
          </p>
        </div>
        {isAdmin && (
          <Link href="/events/new" className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px" }}>
            <Plus size={15} /> Criar evento
          </Link>
        )}
      </div>

      {rows.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "64px 24px" }}>
          <Calendar size={36} style={{ margin: "0 auto 16px", color: "var(--idl-text-muted)" }} />
          <p style={{ fontWeight: 600, marginBottom: "8px" }}>Nenhum evento agendado</p>
          <p style={{ fontSize: "14px", color: "var(--idl-text-muted)" }}>
            Os eventos da rede aparecerão aqui.
          </p>
          {isAdmin && (
            <Link href="/events/new" className="btn-primary" style={{ fontSize: "13px", padding: "9px 18px", display: "inline-block", marginTop: "16px" }}>
              Criar primeiro evento
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "16px" }}>
          {rows.map(({ event, orgName }) => {
            const date = new Date(event.eventDate);
            return (
              <div key={event.id} className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <span className={`badge ${STATUS_CLASS[event.status] ?? "badge-muted"}`}>
                      {event.status === "publicado" ? "Publicado" : event.status === "cancelado" ? "Cancelado" : event.status}
                    </span>
                    <span className="badge badge-info">{FORMAT_LABELS[event.format] ?? event.format}</span>
                  </div>
                  {isAdmin && event.status === "publicado" && (
                    <div style={{ display: "flex", gap: "6px" }}>
                      <form action={cancelEvent} style={{ display: "inline" }}>
                        <input type="hidden" name="eventId" value={event.id} />
                        <button type="submit" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--idl-text-muted)" }} title="Cancelar evento">
                          <X size={15} />
                        </button>
                      </form>
                      <form action={deleteEvent} style={{ display: "inline" }}>
                        <input type="hidden" name="eventId" value={event.id} />
                        <button type="submit" style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }} title="Excluir evento" onClick={(e) => { if (!confirm("Excluir este evento?")) e.preventDefault(); }}>
                          <Trash2 size={15} />
                        </button>
                      </form>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: "16px", marginBottom: "12px" }}>
                  <div style={{ background: "var(--idl-background-soft)", borderRadius: "8px", padding: "8px 12px", textAlign: "center", minWidth: "52px" }}>
                    <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--idl-navy)", lineHeight: 1 }}>{date.getDate()}</div>
                    <div style={{ fontSize: "11px", color: "var(--idl-text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      {date.toLocaleDateString("pt-BR", { month: "short" })}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "4px" }}>{event.title}</div>
                    <div style={{ fontSize: "12px", color: "var(--idl-text-muted)" }}>
                      {date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      {event.location && ` · ${event.location}`}
                      {event.capacity && ` · Capacidade: ${event.capacity}`}
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: "13px", lineHeight: "1.5", color: "var(--idl-text-muted)", marginBottom: "12px", WebkitLineClamp: 2, overflow: "hidden", display: "-webkit-box", WebkitBoxOrient: "vertical" }}>
                  {event.description}
                </p>

                <div style={{ fontSize: "11px", color: "var(--idl-text-muted)", borderTop: "1px solid var(--idl-border)", paddingTop: "8px" }}>
                  Organizado por {orgName}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
