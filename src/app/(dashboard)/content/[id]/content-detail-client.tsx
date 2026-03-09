"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Stepper, StepPanel } from "@/components/stepper";
import { updatePieceStep, deletePiece } from "@/lib/actions/content";
import type { ContentPiece } from "@/lib/actions/content";
import type { Brand } from "@/lib/actions/brands";
import type { TeamMember } from "@/lib/actions/team";

interface ContentDetailClientProps {
  piece: ContentPiece;
  brand: Brand | null;
  members: TeamMember[];
}

export function ContentDetailClient({ piece, brand, members }: ContentDetailClientProps) {
  const [activeStep, setActiveStep] = useState(piece.current_step || 1);
  const [isPending, startTransition] = useTransition();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedHook, setGeneratedHook] = useState(piece.hook || "");
  const [generatedBody, setGeneratedBody] = useState(piece.body || "");
  const [generatedCta, setGeneratedCta] = useState(piece.cta || "");
  const [additionalPrompt, setAdditionalPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  function handleStepSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await updatePieceStep(piece.id, formData);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error desconocido");
      }
    });
  }

  async function handleGenerateScript() {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand_id: piece.brand_id,
          framework_type: piece.framework_type,
          funnel_position: piece.funnel_position,
          platform: piece.platform,
          idea_description: piece.idea_description,
          additional_prompt: additionalPrompt,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al generar el script");
      }

      const data = await res.json();
      setGeneratedHook(data.hook || "");
      setGeneratedBody(data.body || "");
      setGeneratedCta(data.cta || "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al generar");
    } finally {
      setIsGenerating(false);
    }
  }

  const inputClass = "w-full rounded-[10px] border border-border-subtle bg-bg-primary px-4 py-3 text-[14px] font-300 text-text-primary placeholder:text-text-muted transition-all duration-300 focus:border-accent focus:shadow-[0_0_0_3px_rgba(254,46,46,0.125)] focus:outline-none disabled:opacity-50";
  const labelClass = "block text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted mb-2";
  const btnClass = "rounded-[10px] bg-accent px-6 py-2.5 text-[13px] font-500 tracking-[0.04em] text-white transition-all duration-300 hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(254,46,46,0.25)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none";
  const secondaryBtnClass = "rounded-[10px] border border-border-subtle px-5 py-2.5 text-[13px] font-400 text-text-secondary transition-all duration-300 hover:border-border-hover hover:text-text-body";
  const easing = { transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" };

  return (
    <div className="stagger">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/content" className="text-text-muted hover:text-text-secondary transition-colors duration-300">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <h1 className="text-[24px] font-300 tracking-[-0.02em] text-text-primary">
              {piece.title}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {brand && (
              <Link
                href={`/brands/${brand.id}`}
                className="text-[12px] text-text-secondary hover:text-accent transition-colors duration-300"
              >
                {brand.name}
              </Link>
            )}
            {piece.funnel_position && (
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-500 uppercase tracking-[0.1em] ${
                  piece.funnel_position === "tofu"
                    ? "bg-[rgba(59,130,246,0.1)] text-[#60a5fa]"
                    : piece.funnel_position === "mofu"
                    ? "bg-[rgba(251,191,36,0.1)] text-[#fbbf24]"
                    : "bg-[rgba(52,211,153,0.1)] text-[#34d399]"
                }`}
              >
                {piece.funnel_position}
              </span>
            )}
            {piece.framework_type && (
              <span className="text-[11px] text-text-muted capitalize">{piece.framework_type}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {confirming ? (
            <>
              <span className="text-[12px] text-text-muted">¿Confirmar eliminación?</span>
              <button
                onClick={() => startTransition(() => deletePiece(piece.id))}
                disabled={isPending}
                className="rounded-[10px] bg-error px-4 py-2 text-[12px] font-500 text-white transition-all duration-300 disabled:opacity-50"
                style={easing}
              >
                Sí, eliminar
              </button>
              <button onClick={() => setConfirming(false)} className={secondaryBtnClass} style={easing}>
                Cancelar
              </button>
            </>
          ) : (
            <button onClick={() => setConfirming(true)} className={secondaryBtnClass} style={easing}>
              Eliminar
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-[10px] bg-[rgba(248,113,113,0.08)] border border-[rgba(248,113,113,0.15)] px-4 py-3 text-[13px] text-error">
          {error}
        </div>
      )}

      {/* Stepper */}
      <Stepper currentStep={piece.current_step || 1} activeStep={activeStep} onStepClick={setActiveStep}>
            {/* Step 1 — Idea */}
            <StepPanel step={1} activeStep={activeStep}>
              <h3 className="text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted mb-6">
                Paso 1 — Idea
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleStepSubmit(new FormData(e.currentTarget));
                }}
                className="space-y-5"
              >
                <input type="hidden" name="step" value="1" />
                <div>
                  <label className={labelClass}>Fuente</label>
                  <input name="idea_source" type="text" defaultValue={piece.idea_source || ""} placeholder="Tendencia, pregunta de audiencia, experiencia..." className={inputClass} style={easing} disabled={isPending} />
                </div>
                <div>
                  <label className={labelClass}>Descripción</label>
                  <textarea name="idea_description" defaultValue={piece.idea_description || ""} placeholder="Describe la idea..." rows={3} className={inputClass + " resize-none"} style={easing} disabled={isPending} />
                </div>
                <div>
                  <label className={labelClass}>URL de referencia</label>
                  <input name="idea_reference_url" type="url" defaultValue={piece.idea_reference_url || ""} placeholder="https://..." className={inputClass} style={easing} disabled={isPending} />
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button type="submit" disabled={isPending} className={btnClass} style={easing}>
                    {isPending ? "Guardando..." : "Guardar"}
                  </button>
                  <button
                    type="submit"
                    name="advance_to_step"
                    value="2"
                    disabled={isPending}
                    className={btnClass}
                    style={easing}
                  >
                    Guardar y avanzar
                  </button>
                </div>
              </form>
            </StepPanel>

            {/* Step 2 — Framework */}
            <StepPanel step={2} activeStep={activeStep}>
              <h3 className="text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted mb-6">
                Paso 2 — Framework
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleStepSubmit(new FormData(e.currentTarget));
                }}
                className="space-y-5"
              >
                <input type="hidden" name="step" value="2" />
                <div>
                  <label className={labelClass}>Tipo de framework</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(["documented", "engineered"] as const).map((type) => (
                      <label
                        key={type}
                        className={`flex items-center gap-3 rounded-[10px] border px-4 py-3 cursor-pointer transition-all duration-300 min-h-[44px] ${
                          piece.framework_type === type ? "border-accent bg-accent-secondary" : "border-border-subtle hover:border-border-hover"
                        }`}
                        style={easing}
                      >
                        <input
                          type="radio"
                          name="framework_type"
                          value={type}
                          defaultChecked={piece.framework_type === type}
                          className="sr-only"
                        />
                        <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                          piece.framework_type === type ? "border-accent" : "border-border-subtle"
                        }`}>
                          {piece.framework_type === type && <div className="h-2 w-2 rounded-full bg-accent" />}
                        </div>
                        <span className="text-[13px] font-400 text-text-primary capitalize">{type === "documented" ? "Documentado" : "Engineered"}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Posición en el embudo</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(["tofu", "mofu", "bofu"] as const).map((pos) => {
                      const labels = { tofu: "TOFU — Descubrimiento", mofu: "MOFU — Consideración", bofu: "BOFU — Conversión" };
                      const colors = { tofu: "#60a5fa", mofu: "#fbbf24", bofu: "#34d399" };
                      return (
                        <label
                          key={pos}
                          className={`flex flex-col items-center gap-1 rounded-[10px] border px-3 py-3 cursor-pointer transition-all duration-300 min-h-[44px] text-center ${
                            piece.funnel_position === pos ? "border-accent bg-accent-secondary" : "border-border-subtle hover:border-border-hover"
                          }`}
                          style={easing}
                        >
                          <input type="radio" name="funnel_position" value={pos} defaultChecked={piece.funnel_position === pos} className="sr-only" />
                          <span className="text-[10px] font-500 uppercase tracking-[0.1em]" style={{ color: colors[pos] }}>{pos}</span>
                          <span className="text-[11px] text-text-muted">{labels[pos].split(" — ")[1]}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Plataforma</label>
                  <select name="platform" defaultValue={piece.platform || ""} className={inputClass + " min-h-[44px]"} style={easing} disabled={isPending}>
                    <option value="">Seleccionar plataforma</option>
                    <option value="instagram_reels">Instagram Reels</option>
                    <option value="tiktok">TikTok</option>
                    <option value="youtube_shorts">YouTube Shorts</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="twitter">Twitter/X</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button type="submit" disabled={isPending} className={btnClass} style={easing}>
                    {isPending ? "Guardando..." : "Guardar"}
                  </button>
                  <button type="submit" name="advance_to_step" value="3" disabled={isPending} className={btnClass} style={easing}>
                    Guardar y avanzar
                  </button>
                </div>
              </form>
            </StepPanel>

            {/* Step 3 — Script */}
            <StepPanel step={3} activeStep={activeStep}>
              <h3 className="text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted mb-6">
                Paso 3 — Script
              </h3>
              {/* Generate button */}
              <div className="mb-6 rounded-[10px] border border-border-subtle bg-bg-primary p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[13px] font-400 text-text-primary mb-1">Generar script con IA</p>
                    <p className="text-[12px] text-text-muted">
                      Usa Claude para generar hook, cuerpo y CTA basado en el contexto de la marca
                    </p>
                  </div>
                  <button
                    onClick={handleGenerateScript}
                    disabled={isGenerating || !piece.framework_type || !piece.funnel_position}
                    className={btnClass + " shrink-0"}
                    style={easing}
                  >
                    {isGenerating ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="20 10" />
                        </svg>
                        Generando...
                      </span>
                    ) : "Generar script"}
                  </button>
                </div>
                <div className="mt-3">
                  <label className={labelClass}>Prompt adicional (opcional)</label>
                  <input
                    type="text"
                    value={additionalPrompt}
                    onChange={(e) => setAdditionalPrompt(e.target.value)}
                    placeholder="Instrucciones adicionales para la generación..."
                    className={inputClass}
                    style={easing}
                  />
                </div>
                {(!piece.framework_type || !piece.funnel_position) && (
                  <p className="mt-2 text-[11px] text-warning">
                    Completa el paso 2 (Framework y embudo) para poder generar
                  </p>
                )}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleStepSubmit(new FormData(e.currentTarget));
                }}
                className="space-y-5"
              >
                <input type="hidden" name="step" value="3" />
                <div>
                  <label className={labelClass}>Hook</label>
                  <textarea
                    name="hook"
                    value={generatedHook}
                    onChange={(e) => setGeneratedHook(e.target.value)}
                    placeholder="El gancho que captura la atención..."
                    rows={2}
                    className={inputClass + " resize-none"}
                    style={easing}
                    disabled={isPending}
                  />
                </div>
                <div>
                  <label className={labelClass}>Cuerpo</label>
                  <textarea
                    name="body"
                    value={generatedBody}
                    onChange={(e) => setGeneratedBody(e.target.value)}
                    placeholder="El desarrollo del contenido..."
                    rows={6}
                    className={inputClass + " resize-none"}
                    style={easing}
                    disabled={isPending}
                  />
                </div>
                <div>
                  <label className={labelClass}>CTA</label>
                  <textarea
                    name="cta"
                    value={generatedCta}
                    onChange={(e) => setGeneratedCta(e.target.value)}
                    placeholder="La llamada a la acción..."
                    rows={2}
                    className={inputClass + " resize-none"}
                    style={easing}
                    disabled={isPending}
                  />
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button type="submit" disabled={isPending} className={btnClass} style={easing}>
                    {isPending ? "Guardando..." : "Guardar"}
                  </button>
                  <button type="submit" name="advance_to_step" value="4" disabled={isPending} className={btnClass} style={easing}>
                    Guardar y avanzar
                  </button>
                </div>
              </form>
            </StepPanel>

            {/* Step 4 — Editor */}
            <StepPanel step={4} activeStep={activeStep}>
              <h3 className="text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted mb-6">
                Paso 4 — Editor
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleStepSubmit(new FormData(e.currentTarget));
                }}
                className="space-y-5"
              >
                <input type="hidden" name="step" value="4" />
                <div>
                  <label className={labelClass}>Asignar editor</label>
                  {members.filter((m) => m.role === "editor" || m.role === "editor_lead").length === 0 ? (
                    <div className="rounded-[10px] border border-border-subtle bg-bg-primary p-4 text-center">
                      <p className="text-[13px] text-text-muted mb-2">No hay editores registrados</p>
                      <Link href="/team/new" className="text-[12px] text-accent hover:text-accent-hover">
                        Añadir miembro de equipo
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {members
                        .filter((m) => m.role === "editor" || m.role === "editor_lead")
                        .map((m) => (
                          <label
                            key={m.id}
                            className={`flex items-center justify-between rounded-[10px] border px-4 py-3 cursor-pointer transition-all duration-300 min-h-[44px] ${
                              piece.assigned_editor_id === m.id ? "border-accent bg-accent-secondary" : "border-border-subtle hover:border-border-hover"
                            }`}
                            style={easing}
                          >
                            <div className="flex items-center gap-3">
                              <input type="radio" name="assigned_editor_id" value={m.id} defaultChecked={piece.assigned_editor_id === m.id} className="sr-only" />
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-bg-elevated border border-border-subtle text-[11px] font-500 text-text-secondary uppercase">
                                {m.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-[13px] font-400 text-text-primary">{m.name}</p>
                                <p className="text-[11px] text-text-muted capitalize">{m.role.replace("_", " ")}</p>
                              </div>
                            </div>
                            <span className="text-[11px] text-text-muted">
                              {m.active_pieces || 0}/{m.capacity || 5} piezas
                            </span>
                          </label>
                        ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Brief para el editor</label>
                  <textarea
                    name="editor_brief"
                    defaultValue={piece.editor_brief || generateBrief(piece, brand)}
                    rows={4}
                    className={inputClass + " resize-none"}
                    style={easing}
                    disabled={isPending}
                  />
                </div>
                <div>
                  <label className={labelClass}>Fecha límite</label>
                  <input
                    name="editor_deadline"
                    type="date"
                    defaultValue={piece.editor_deadline ? piece.editor_deadline.split("T")[0] : ""}
                    className={inputClass + " min-h-[44px]"}
                    style={easing}
                    disabled={isPending}
                  />
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button type="submit" disabled={isPending} className={btnClass} style={easing}>
                    {isPending ? "Guardando..." : "Guardar"}
                  </button>
                  <button type="submit" name="advance_to_step" value="5" disabled={isPending} className={btnClass} style={easing}>
                    Guardar y avanzar
                  </button>
                </div>
              </form>
            </StepPanel>

            {/* Step 5 — Review */}
            <StepPanel step={5} activeStep={activeStep}>
              <h3 className="text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted mb-6">
                Paso 5 — Revisión
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleStepSubmit(new FormData(e.currentTarget));
                }}
                className="space-y-5"
              >
                <input type="hidden" name="step" value="5" />
                <div>
                  <label className={labelClass}>Estado de revisión</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`flex items-center gap-3 rounded-[10px] border px-4 py-3 cursor-pointer transition-all duration-300 min-h-[44px] ${
                        piece.review_status === "approved" ? "border-success bg-[rgba(52,211,153,0.05)]" : "border-border-subtle hover:border-border-hover"
                      }`}
                      style={easing}
                    >
                      <input type="radio" name="review_status" value="approved" defaultChecked={piece.review_status === "approved"} className="sr-only" />
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8L6.5 11.5L13 4.5" stroke={piece.review_status === "approved" ? "#34d399" : "#666"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="text-[13px] font-400 text-text-primary">Aprobado</span>
                    </label>
                    <label
                      className={`flex items-center gap-3 rounded-[10px] border px-4 py-3 cursor-pointer transition-all duration-300 min-h-[44px] ${
                        piece.review_status === "changes_requested" ? "border-warning bg-[rgba(251,191,36,0.05)]" : "border-border-subtle hover:border-border-hover"
                      }`}
                      style={easing}
                    >
                      <input type="radio" name="review_status" value="changes_requested" defaultChecked={piece.review_status === "changes_requested"} className="sr-only" />
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 4V9M8 12V12.01" stroke={piece.review_status === "changes_requested" ? "#fbbf24" : "#666"} strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <span className="text-[13px] font-400 text-text-primary">Cambios</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Comentarios de revisión</label>
                  <textarea
                    name="review_comments"
                    defaultValue={piece.review_comments || ""}
                    placeholder="Comentarios sobre el contenido..."
                    rows={4}
                    className={inputClass + " resize-none"}
                    style={easing}
                    disabled={isPending}
                  />
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button type="submit" disabled={isPending} className={btnClass} style={easing}>
                    {isPending ? "Guardando..." : "Guardar"}
                  </button>
                  <button type="submit" name="advance_to_step" value="6" disabled={isPending} className={btnClass} style={easing}>
                    Aprobar y publicar
                  </button>
                </div>
              </form>
            </StepPanel>

            {/* Step 6 — Published */}
            <StepPanel step={6} activeStep={activeStep}>
              <h3 className="text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted mb-6">
                Paso 6 — Publicado
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleStepSubmit(new FormData(e.currentTarget));
                }}
                className="space-y-5"
              >
                <input type="hidden" name="step" value="6" />
                <div>
                  <label className={labelClass}>URL del post</label>
                  <input name="published_url" type="url" defaultValue={piece.published_url || ""} placeholder="https://instagram.com/reel/..." className={inputClass} style={easing} disabled={isPending} />
                </div>
                <div>
                  <label className={labelClass}>Fecha de publicación</label>
                  <input name="published_at" type="date" defaultValue={piece.published_at ? piece.published_at.split("T")[0] : new Date().toISOString().split("T")[0]} className={inputClass + " min-h-[44px]"} style={easing} disabled={isPending} />
                </div>
                <div>
                  <label className={labelClass}>Métricas</label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <div>
                      <label className="block text-[11px] text-text-muted mb-1">Views</label>
                      <input name="metric_views" type="number" min="0" defaultValue={piece.metric_views || ""} placeholder="0" className={inputClass} style={easing} disabled={isPending} />
                    </div>
                    <div>
                      <label className="block text-[11px] text-text-muted mb-1">Likes</label>
                      <input name="metric_likes" type="number" min="0" defaultValue={piece.metric_likes || ""} placeholder="0" className={inputClass} style={easing} disabled={isPending} />
                    </div>
                    <div>
                      <label className="block text-[11px] text-text-muted mb-1">Saves</label>
                      <input name="metric_saves" type="number" min="0" defaultValue={piece.metric_saves || ""} placeholder="0" className={inputClass} style={easing} disabled={isPending} />
                    </div>
                    <div>
                      <label className="block text-[11px] text-text-muted mb-1">Shares</label>
                      <input name="metric_shares" type="number" min="0" defaultValue={piece.metric_shares || ""} placeholder="0" className={inputClass} style={easing} disabled={isPending} />
                    </div>
                    <div>
                      <label className="block text-[11px] text-text-muted mb-1">Comments</label>
                      <input name="metric_comments" type="number" min="0" defaultValue={piece.metric_comments || ""} placeholder="0" className={inputClass} style={easing} disabled={isPending} />
                    </div>
                    <div>
                      <label className="block text-[11px] text-text-muted mb-1">Follows</label>
                      <input name="metric_follows" type="number" min="0" defaultValue={piece.metric_follows || ""} placeholder="0" className={inputClass} style={easing} disabled={isPending} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button type="submit" disabled={isPending} className={btnClass} style={easing}>
                    {isPending ? "Guardando..." : "Guardar métricas"}
                  </button>
                </div>
              </form>
            </StepPanel>
      </Stepper>
    </div>
  );
}

function generateBrief(piece: ContentPiece, brand: Brand | null): string {
  const parts: string[] = [];
  parts.push(`PIEZA: ${piece.title}`);
  if (brand) parts.push(`MARCA: ${brand.name} — ${brand.niche}`);
  if (piece.framework_type) parts.push(`FRAMEWORK: ${piece.framework_type === "documented" ? "Documentado" : "Engineered"}`);
  if (piece.funnel_position) parts.push(`EMBUDO: ${piece.funnel_position.toUpperCase()}`);
  if (piece.platform) parts.push(`PLATAFORMA: ${piece.platform.replace("_", " ")}`);
  if (piece.hook) parts.push(`\nHOOK:\n${piece.hook}`);
  if (piece.body) parts.push(`\nCUERPO:\n${piece.body}`);
  if (piece.cta) parts.push(`\nCTA:\n${piece.cta}`);
  return parts.join("\n");
}
