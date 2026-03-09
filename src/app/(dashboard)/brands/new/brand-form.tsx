"use client";

import { useActionState } from "react";
import Link from "next/link";
import { type Brand } from "@/lib/actions/brands";

interface BrandFormProps {
  action: (formData: FormData) => Promise<void>;
  brand?: Brand;
}

export function BrandForm({ action, brand }: BrandFormProps) {
  const [error, formAction, isPending] = useActionState(
    async (_prevState: string | null, formData: FormData) => {
      try {
        await action(formData);
        return null;
      } catch (e) {
        return e instanceof Error ? e.message : "Error desconocido";
      }
    },
    null
  );

  return (
    <form action={formAction} className="space-y-6">
      {error && (
        <div className="rounded-[10px] bg-[rgba(248,113,113,0.08)] border border-[rgba(248,113,113,0.15)] px-4 py-3 text-[13px] text-error">
          {error}
        </div>
      )}

      <div>
        <label className="block text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted mb-2">
          Nombre de la marca
        </label>
        <input
          name="name"
          type="text"
          required
          defaultValue={brand?.name || ""}
          placeholder="Ej: NUZE Lab"
          disabled={isPending}
          className="w-full rounded-[10px] border border-border-subtle bg-bg-primary px-4 py-3 text-[14px] font-300 text-text-primary placeholder:text-text-muted transition-all duration-300 focus:border-accent focus:shadow-[0_0_0_3px_rgba(254,46,46,0.125)] focus:outline-none disabled:opacity-50"
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
      </div>

      <div>
        <label className="block text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted mb-2">
          Nicho
        </label>
        <input
          name="niche"
          type="text"
          required
          defaultValue={brand?.niche || ""}
          placeholder="Ej: Fitness, Tecnología, Marketing Digital"
          disabled={isPending}
          className="w-full rounded-[10px] border border-border-subtle bg-bg-primary px-4 py-3 text-[14px] font-300 text-text-primary placeholder:text-text-muted transition-all duration-300 focus:border-accent focus:shadow-[0_0_0_3px_rgba(254,46,46,0.125)] focus:outline-none disabled:opacity-50"
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
      </div>

      <div>
        <label className="block text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted mb-2">
          Tono de comunicación
        </label>
        <input
          name="tone"
          type="text"
          required
          defaultValue={brand?.tone || ""}
          placeholder="Ej: Cercano, técnico, inspirador, provocador"
          disabled={isPending}
          className="w-full rounded-[10px] border border-border-subtle bg-bg-primary px-4 py-3 text-[14px] font-300 text-text-primary placeholder:text-text-muted transition-all duration-300 focus:border-accent focus:shadow-[0_0_0_3px_rgba(254,46,46,0.125)] focus:outline-none disabled:opacity-50"
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
      </div>

      <div>
        <label className="block text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted mb-2">
          Audiencia objetivo
        </label>
        <textarea
          name="target_audience"
          required
          defaultValue={brand?.target_audience || ""}
          placeholder="Describe tu audiencia ideal: edad, intereses, problemas, aspiraciones..."
          rows={3}
          disabled={isPending}
          className="w-full rounded-[10px] border border-border-subtle bg-bg-primary px-4 py-3 text-[14px] font-300 text-text-primary placeholder:text-text-muted transition-all duration-300 focus:border-accent focus:shadow-[0_0_0_3px_rgba(254,46,46,0.125)] focus:outline-none disabled:opacity-50 resize-none"
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
      </div>

      <div>
        <label className="block text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted mb-2">
          Archivo de contexto de marca
        </label>
        <p className="text-[12px] text-text-muted mb-3">
          Sube un documento con la guía de marca, estilo de comunicación, valores, etc.
        </p>
        <input
          name="brand_context_file"
          type="file"
          accept=".txt,.md,.pdf,.doc,.docx"
          disabled={isPending}
          className="w-full rounded-[10px] border border-border-subtle bg-bg-primary px-4 py-3 text-[14px] font-300 text-text-primary file:mr-4 file:rounded-[8px] file:border-0 file:bg-bg-elevated file:px-4 file:py-1.5 file:text-[12px] file:font-400 file:text-text-secondary transition-all duration-300 focus:border-accent focus:shadow-[0_0_0_3px_rgba(254,46,46,0.125)] focus:outline-none disabled:opacity-50"
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
        {brand?.brand_context_file && (
          <p className="mt-2 text-[12px] text-text-muted">
            Archivo actual: {brand.brand_context_file.split("/").pop()}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-[10px] bg-accent px-8 py-3 text-[13px] font-500 tracking-[0.04em] text-white transition-all duration-300 hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(254,46,46,0.25)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          {isPending ? "Guardando..." : brand ? "Actualizar marca" : "Crear marca"}
        </button>
        <Link
          href={brand ? `/brands/${brand.id}` : "/brands"}
          className="rounded-[10px] border border-border-subtle px-6 py-3 text-[13px] font-400 text-text-secondary transition-all duration-300 hover:border-border-hover hover:text-text-body"
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
