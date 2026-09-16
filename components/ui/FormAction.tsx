"use client";

import { useActionState, useTransition } from "react";

type ActionFn = (formData: FormData) => Promise<{ error?: string } | undefined | void>;

interface FormActionProps {
  action: ActionFn;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function FormAction({ action, children, className, style }: FormActionProps) {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      const result = await action(formData);
      return result ?? null;
    },
    null
  );

  return (
    <form action={formAction} className={className} style={style}>
      {state?.error && (
        <div className="alert-error" style={{ marginBottom: "16px" }}>
          {state.error}
        </div>
      )}
      {children}
    </form>
  );
}
