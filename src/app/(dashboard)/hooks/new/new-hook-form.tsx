"use client";

import { useActionState } from "react";
import Link from "next/link";

interface NewHookFormProps {
  action: (formData: FormData) => Promise<void>;
}

export function NewHookForm({ action }: NewHookFormProps) {
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
        <label className={labelClass}>Texto del hook</label>
        <textarea
          name="hook_text"
          required
          placeholder="El hook que quieres guardar..."
          rows={3}
          disabled={isPending}
          className={inputClass + " resize-none"}
          style={easing}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Tipo</label>
          <select name="type" required disabled={isPending} className={inputClass + " min-h-[44px]"} style={easing}>
            <option value="documented">Documentado</option>
            <option value="engineered">Engineered</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Fuente</label>
          <select name="source" disabled={isPending} className={inputClass + " min-h-[44px]"} style={easing}>
            <option value="manual">Manual</option>
            <option value="trend">De tendencia</option>
            <option value="ai_generated">Generado por IA</option>
            <option value="competitor">Competidor</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Nicho</label>
          <input name="niche" type="text" placeholder="Ej: Fitness, Tech" disabled={isPending} className={inputClass} style={easing} />
        </div>
        <div>
          <label className={labelClass}>Plataforma</label>
          <select name="platform" disabled={isPending} className={inputClass + " min-h-[44px]"} style={easing}>
            <option value="instagram_reels">Instagram Reels</option>
            <option value="tiktok">TikTok</option>
            <option value="youtube_shorts">YouTube Shorts</option>
            <option value="linkedin">LinkedIn</option>
            <option value="twitter">Twitter/X</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Puntuación de rendimiento (0-10)</label>
        <input
          name="performance_score"
          type="number"
          min="0"
          max="10"
          defaultValue="5"
          disabled={isPending}
          className={inputClass}
          style={easing}
        />
      </div>

      <div className="flex items-center gap-3 pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-[10px] bg-accent px-8 py-3 text-[13px] font-500 tracking-[0.04em] text-white transition-all duration-300 hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(254,46,46,0.25)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          style={easing}
        >
          {isPending ? "Guardando..." : "Guardar hook"}
        </button>
        <Link
          href="/hooks"
          className="rounded-[10px] border border-border-subtle px-6 py-3 text-[13px] font-400 text-text-secondary transition-all duration-300 hover:border-border-hover hover:text-text-body"
          style={easing}
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
