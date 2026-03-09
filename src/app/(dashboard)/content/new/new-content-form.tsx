"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createPiece } from "@/lib/actions/content";
import type { Brand } from "@/lib/actions/brands";

interface NewContentFormProps {
  brands: Brand[];
  preselectedBrand?: string;
}

export function NewContentForm({ brands, preselectedBrand }: NewContentFormProps) {
  const [error, formAction, isPending] = useActionState(
    async (_prevState: string | null, formData: FormData) => {
      try {
        await createPiece(formData);
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
          Título de la pieza
        </label>
        <input
          name="title"
          type="text"
          required
          placeholder="Ej: 5 errores que cometes al crear contenido"
          disabled={isPending}
          className="w-full rounded-[10px] border border-border-subtle bg-bg-primary px-4 py-3 text-[14px] font-300 text-text-primary placeholder:text-text-muted transition-all duration-300 focus:border-accent focus:shadow-[0_0_0_3px_rgba(254,46,46,0.125)] focus:outline-none disabled:opacity-50"
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
      </div>

      <div>
        <label className="block text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted mb-2">
          Marca
        </label>
        <select
          name="brand_id"
          required
          defaultValue={preselectedBrand || ""}
          disabled={isPending}
          className="w-full rounded-[10px] border border-border-subtle bg-bg-primary px-4 py-3 text-[14px] font-300 text-text-primary transition-all duration-300 focus:border-accent focus:shadow-[0_0_0_3px_rgba(254,46,46,0.125)] focus:outline-none disabled:opacity-50 min-h-[44px]"
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <option value="" disabled>Selecciona una marca</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>{brand.name}</option>
          ))}
        </select>
        {brands.length === 0 && (
          <p className="mt-2 text-[12px] text-text-muted">
            <Link href="/brands/new" className="text-accent hover:text-accent-hover">
              Crea una marca primero
            </Link>
          </p>
        )}
      </div>

      <div>
        <label className="block text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted mb-2">
          Fuente de la idea
        </label>
        <input
          name="idea_source"
          type="text"
          placeholder="Ej: Tendencia en TikTok, pregunta de audiencia, experiencia personal"
          disabled={isPending}
          className="w-full rounded-[10px] border border-border-subtle bg-bg-primary px-4 py-3 text-[14px] font-300 text-text-primary placeholder:text-text-muted transition-all duration-300 focus:border-accent focus:shadow-[0_0_0_3px_rgba(254,46,46,0.125)] focus:outline-none disabled:opacity-50"
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
      </div>

      <div>
        <label className="block text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted mb-2">
          Descripción de la idea
        </label>
        <textarea
          name="idea_description"
          placeholder="Describe brevemente la idea y el ángulo que quieres darle..."
          rows={3}
          disabled={isPending}
          className="w-full rounded-[10px] border border-border-subtle bg-bg-primary px-4 py-3 text-[14px] font-300 text-text-primary placeholder:text-text-muted transition-all duration-300 focus:border-accent focus:shadow-[0_0_0_3px_rgba(254,46,46,0.125)] focus:outline-none disabled:opacity-50 resize-none"
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
      </div>

      <div>
        <label className="block text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted mb-2">
          URL de referencia
        </label>
        <input
          name="idea_reference_url"
          type="url"
          placeholder="https://..."
          disabled={isPending}
          className="w-full rounded-[10px] border border-border-subtle bg-bg-primary px-4 py-3 text-[14px] font-300 text-text-primary placeholder:text-text-muted transition-all duration-300 focus:border-accent focus:shadow-[0_0_0_3px_rgba(254,46,46,0.125)] focus:outline-none disabled:opacity-50"
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
      </div>

      <div className="flex items-center gap-3 pt-4">
        <button
          type="submit"
          disabled={isPending || brands.length === 0}
          className="rounded-[10px] bg-accent px-8 py-3 text-[13px] font-500 tracking-[0.04em] text-white transition-all duration-300 hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(254,46,46,0.25)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          {isPending ? "Creando..." : "Crear pieza"}
        </button>
        <Link
          href="/content"
          className="rounded-[10px] border border-border-subtle px-6 py-3 text-[13px] font-400 text-text-secondary transition-all duration-300 hover:border-border-hover hover:text-text-body"
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
