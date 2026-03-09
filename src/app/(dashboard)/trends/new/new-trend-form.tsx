"use client";

import { useActionState } from "react";
import Link from "next/link";

interface NewTrendFormProps {
  action: (formData: FormData) => Promise<void>;
}

export function NewTrendForm({ action }: NewTrendFormProps) {
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
        <label className={labelClass}>URL del reel</label>
        <input name="reel_url" type="url" required placeholder="https://www.instagram.com/reel/..." disabled={isPending} className={inputClass} style={easing} />
      </div>

      <div>
        <label className={labelClass}>Creador</label>
        <input name="creator_name" type="text" placeholder="@nombre_creador" disabled={isPending} className={inputClass} style={easing} />
      </div>

      <div>
        <label className={labelClass}>Hook utilizado</label>
        <textarea name="hook_used" required placeholder="El hook que usaron en el reel..." rows={2} disabled={isPending} className={inputClass + " resize-none"} style={easing} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Formato</label>
          <select name="format" required disabled={isPending} className={inputClass + " min-h-[44px]"} style={easing}>
            <option value="">Seleccionar</option>
            <option value="talking_head">Talking Head</option>
            <option value="voiceover">Voiceover</option>
            <option value="text_on_screen">Texto en pantalla</option>
            <option value="storytelling">Storytelling</option>
            <option value="tutorial">Tutorial</option>
            <option value="before_after">Antes/Después</option>
            <option value="list">Lista</option>
            <option value="reaction">Reacción</option>
            <option value="duet">Duet/Stitch</option>
            <option value="other">Otro</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Duración</label>
          <input name="duration" type="text" placeholder="Ej: 30s, 60s, 90s" disabled={isPending} className={inputClass} style={easing} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Tipo de contenido</label>
        <div className="grid grid-cols-2 gap-3">
          <label
            className="flex items-center gap-3 rounded-[10px] border border-border-subtle px-4 py-3 cursor-pointer transition-all duration-300 hover:border-border-hover min-h-[44px]"
            style={easing}
          >
            <input type="radio" name="type" value="documented" required className="sr-only peer" />
            <div className="h-4 w-4 rounded-full border-2 border-border-subtle peer-checked:border-accent flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-accent scale-0 peer-checked:scale-100 transition-transform duration-200" />
            </div>
            <span className="text-[13px] font-400 text-text-primary">Documentado</span>
          </label>
          <label
            className="flex items-center gap-3 rounded-[10px] border border-border-subtle px-4 py-3 cursor-pointer transition-all duration-300 hover:border-border-hover min-h-[44px]"
            style={easing}
          >
            <input type="radio" name="type" value="engineered" className="sr-only peer" />
            <div className="h-4 w-4 rounded-full border-2 border-border-subtle peer-checked:border-accent flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-accent scale-0 peer-checked:scale-100 transition-transform duration-200" />
            </div>
            <span className="text-[13px] font-400 text-text-primary">Engineered</span>
          </label>
        </div>
      </div>

      <div>
        <label className={labelClass}>Notas</label>
        <textarea name="notes" placeholder="Por qué crees que funciona, qué patrones detectas..." rows={3} disabled={isPending} className={inputClass + " resize-none"} style={easing} />
      </div>

      <div>
        <label className={labelClass}>Adaptable a (nichos)</label>
        <input name="adaptable_to" type="text" placeholder="Ej: Fitness, SaaS, E-commerce" disabled={isPending} className={inputClass} style={easing} />
      </div>

      <div className="flex items-center gap-3 pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-[10px] bg-accent px-8 py-3 text-[13px] font-500 tracking-[0.04em] text-white transition-all duration-300 hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(254,46,46,0.25)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          style={easing}
        >
          {isPending ? "Guardando..." : "Registrar tendencia"}
        </button>
        <Link
          href="/trends"
          className="rounded-[10px] border border-border-subtle px-6 py-3 text-[13px] font-400 text-text-secondary transition-all duration-300 hover:border-border-hover hover:text-text-body"
          style={easing}
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
