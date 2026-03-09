"use client";

import { useState, useTransition } from "react";
import { updateMember, type TeamMember } from "@/lib/actions/team";

export function EditMemberButton({ member }: { member: TeamMember }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const inputClass = "w-full rounded-[10px] border border-border-subtle bg-bg-primary px-3 py-2 text-[13px] font-300 text-text-primary transition-all duration-300 focus:border-accent focus:shadow-[0_0_0_3px_rgba(254,46,46,0.125)] focus:outline-none disabled:opacity-50";
  const easing = { transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" };

  if (isEditing) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setIsEditing(false)}>
        <div
          className="w-full max-w-md rounded-[16px] border border-border-subtle bg-bg-surface p-6 reveal"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-[15px] font-500 text-text-primary mb-4">Editar miembro</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              startTransition(async () => {
                await updateMember(member.id, formData);
                setIsEditing(false);
              });
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted mb-1">Nombre</label>
              <input name="name" type="text" required defaultValue={member.name} disabled={isPending} className={inputClass} style={easing} />
            </div>
            <div>
              <label className="block text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted mb-1">Rol</label>
              <select name="role" required defaultValue={member.role} disabled={isPending} className={inputClass + " min-h-[40px]"} style={easing}>
                <option value="editor">Editor</option>
                <option value="editor_lead">Editor Lead</option>
                <option value="content_manager">Content Manager</option>
                <option value="strategist">Estratega</option>
                <option value="designer">Diseñador</option>
                <option value="community_manager">Community Manager</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted mb-1">Especialidades</label>
              <input name="specialties" type="text" defaultValue={member.specialties || ""} disabled={isPending} className={inputClass} style={easing} />
            </div>
            <div>
              <label className="block text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted mb-1">Capacidad (piezas simultáneas)</label>
              <input name="capacity" type="number" min="1" max="50" defaultValue={member.capacity} disabled={isPending} className={inputClass} style={easing} />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="rounded-[10px] bg-accent px-5 py-2 text-[12px] font-500 text-white transition-all duration-300 hover:-translate-y-px disabled:opacity-50"
                style={easing}
              >
                {isPending ? "Guardando..." : "Guardar"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-[10px] border border-border-subtle px-5 py-2 text-[12px] font-400 text-text-secondary transition-all duration-300 hover:border-border-hover"
                style={easing}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="flex h-7 w-7 items-center justify-center rounded-[8px] text-text-muted hover:bg-[rgba(255,255,255,0.03)] hover:text-text-secondary transition-all duration-300"
      style={easing}
      aria-label="Editar miembro"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M8.5 1.5L10.5 3.5L4 10H2V8L8.5 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
