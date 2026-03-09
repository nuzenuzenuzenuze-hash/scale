"use client";

import { useTransition } from "react";
import { deleteHook } from "@/lib/actions/hooks";

export function DeleteHookButton({ hookId }: { hookId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        if (confirm("¿Eliminar este hook?")) {
          startTransition(() => deleteHook(hookId));
        }
      }}
      disabled={isPending}
      className="flex h-8 w-8 items-center justify-center rounded-[8px] text-text-muted hover:bg-[rgba(255,255,255,0.03)] hover:text-error transition-all duration-300 disabled:opacity-50"
      style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      aria-label="Eliminar"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M3 3.5L11 11.5M3 11.5L11 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    </button>
  );
}
