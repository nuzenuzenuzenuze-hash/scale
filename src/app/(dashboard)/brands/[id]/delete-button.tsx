"use client";

import { useState, useTransition } from "react";
import { deleteBrand } from "@/lib/actions/brands";

export function DeleteBrandButton({ brandId }: { brandId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-[12px] text-text-muted">¿Confirmar?</span>
        <button
          onClick={() => {
            startTransition(async () => {
              await deleteBrand(brandId);
            });
          }}
          disabled={isPending}
          className="rounded-[10px] bg-error px-4 py-2 text-[12px] font-500 text-white transition-all duration-300 hover:-translate-y-px disabled:opacity-50"
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          {isPending ? "Eliminando..." : "Sí, eliminar"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={isPending}
          className="rounded-[10px] border border-border-subtle px-4 py-2 text-[12px] font-400 text-text-secondary transition-all duration-300 hover:border-border-hover"
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="rounded-[10px] border border-border-subtle px-5 py-2.5 text-[13px] font-400 text-text-muted transition-all duration-300 hover:border-error hover:text-error"
      style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      Eliminar
    </button>
  );
}
