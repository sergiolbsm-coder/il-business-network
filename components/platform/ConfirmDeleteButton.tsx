"use client";

import { Trash2 } from "lucide-react";

interface Props {
  fieldName: string;
  fieldValue: string;
  action: (formData: FormData) => Promise<void>;
  confirmMessage?: string;
  label?: string;
}

export function ConfirmDeleteButton({
  fieldName,
  fieldValue,
  action,
  confirmMessage = "Excluir este item?",
  label = "Excluir",
}: Props) {
  return (
    <form action={action} style={{ display: "inline" }}>
      <input type="hidden" name={fieldName} value={fieldValue} />
      <button
        type="submit"
        style={{
          background: "none",
          border: "1px solid #ef4444",
          borderRadius: "6px",
          padding: "4px 8px",
          cursor: "pointer",
          color: "#ef4444",
          fontSize: "12px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
        onClick={(e) => {
          if (!confirm(confirmMessage)) e.preventDefault();
        }}
      >
        <Trash2 size={12} /> {label}
      </button>
    </form>
  );
}
