"use client";

import { useActionState } from "react";
import Link from "next/link";

interface NewMemberFormProps {
  action: (formData: FormData) => Promise<void>;
}

export function NewMemberForm({ action }: NewMemberFormProps) {
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

  const inputClass = "w-full rounded-[10px] border border-border-subtle bg-bg-primary px-4 py-3 text-[14px] font-300 text-text-primary placeholder:text-text-muted transition-all duration-300 focus:border-accent focus:shadow-[0_0_0_3px_rgba(254,46,46,0.125)] focus:outline-none disabled:opacity-50";
  const labelClass = "block text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted mb-2";
  const easing = { transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" };

  return (
    <form action={formAction} className="space-y-6">
      {error && (
        <div className="rounded-[10px] bg-[rgba(248,113,113,0.08)] border border-[rgba(248,113,113,0.15)] px-4 py-3 text-[13px] text-error">
          {error}
        </div>
      )}

      <div>
        <label className={labelClass}>Nombre</label>
        <input
          name="name"
          type="text"
          required
          placeholder="Nombre completo"
          disabled={isPending}
          className={inputClass}
          style={easing}
        />
      </div>

      <div>
        <label className={labelClass}>Rol</label>
        <select name="role" required disabled={isPending} className={inputClass + " min-h-[44px]"} style={easing}>
          <option value="">Seleccionar rol</option>
          <option value="editor">Editor</option>
          <option value="editor_lead">Editor Lead</option>
          <option value="content_manager">Content Manager</option>
          <option value="strategist">Estratega</option>
          <option value="designer">Diseñador</option>
          <option value="community_manager">Community Manager</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Especialidades</label>
        <input
          name="specialties"
          type="text"
          placeholder="Ej: Reels, TikTok, Edición vertical, Motion graphics"
          disabled={isPending}
          className={inputClass}
          style={easing}
        />
      </div>

      <div>
        <label className={labelClass}>Capacidad (piezas simultáneas)</label>
        <input
          name="capacity"
          type="number"
          min="1"
          max="50"
          defaultValue="5"
          disabled={isPending}
          className={inputClass}
          style={easing}
        />
        <p className="mt-1 text-[11px] text-text-muted">
          Número máximo de piezas que puede manejar a la vez
        </p>
      </div>

      <div className="flex items-center gap-3 pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-[10px] bg-accent px-8 py-3 text-[13px] font-500 tracking-[0.04em] text-white transition-all duration-300 hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(254,46,46,0.25)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          style={easing}
        >
          {isPending ? "Guardando..." : "Añadir miembro"}
        </button>
        <Link
          href="/team"
          className="rounded-[10px] border border-border-subtle px-6 py-3 text-[13px] font-400 text-text-secondary transition-all duration-300 hover:border-border-hover hover:text-text-body"
          style={easing}
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
