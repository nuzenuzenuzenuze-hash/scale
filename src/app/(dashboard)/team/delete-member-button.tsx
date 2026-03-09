"use client";

import { useTransition } from "react";
import { deleteMember } from "@/lib/actions/team";

export function DeleteMemberButton({ memberId }: { memberId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        if (confirm("¿Eliminar este miembro del equipo?")) {
          startTransition(() => deleteMember(memberId));
        }
      }}
      disabled={isPending}
      className="flex h-7 w-7 items-center justify-center rounded-[8px] text-text-muted hover:bg-[rgba(255,255,255,0.03)] hover:text-error transition-all duration-300 disabled:opacity-50"
      style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      aria-label="Eliminar miembro"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2 2L10 10M2 10L10 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </button>
  );
}
