export const dynamic = "force-dynamic";

import Link from "next/link";
import { getHooks } from "@/lib/actions/hooks";
import { HookFilters } from "./hook-filters";
import { DeleteHookButton } from "./delete-hook-button";

export default async function HooksPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; source?: string; niche?: string; platform?: string; search?: string }>;
}) {
  const params = await searchParams;
  const hooks = await getHooks({
    type: params.type || undefined,
    source: params.source || undefined,
    niche: params.niche || undefined,
    platform: params.platform || undefined,
    search: params.search || undefined,
  });

  return (
    <div className="stagger">
      {/* Header */}
      <div className="mb-10 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-300 tracking-[-0.02em] text-text-primary">
            Hooks Library
          </h1>
          <p className="mt-2 text-[14px] text-text-secondary">
            Tu biblioteca de hooks con puntuación de rendimiento
          </p>
        </div>
        <Link
          href="/hooks/new"
          className="shrink-0 rounded-[10px] bg-accent px-6 py-2.5 text-[13px] font-500 tracking-[0.04em] text-white transition-all duration-300 hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(254,46,46,0.25)]"
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          Añadir hook
        </Link>
      </div>

      {/* Filters */}
      <HookFilters params={params} />

      {/* Content */}
      {hooks.length === 0 ? (
        <div className="rounded-[16px] border border-border-subtle bg-bg-surface p-8">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mb-4">
              <path d="M24 6V18L32 26" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M24 18C24 18 14 20 14 30C14 35.5 18 40 24 40C30 40 34 35.5 34 30" stroke="#333" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <p className="text-[14px] text-text-muted mb-6">
              Tu biblioteca de hooks está vacía
            </p>
            <Link
              href="/hooks/new"
              className="rounded-[10px] bg-accent px-6 py-2.5 text-[13px] font-500 tracking-[0.04em] text-white transition-all duration-300 hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(254,46,46,0.25)]"
              style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
            >
              Añadir primer hook
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {hooks.map((hook) => (
            <div
              key={hook.id}
              className="group rounded-[16px] border border-border-subtle bg-bg-surface p-5 transition-all duration-300 hover:border-border-hover"
              style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-300 text-text-primary leading-[1.6] mb-3">
                    &ldquo;{hook.hook_text}&rdquo;
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-500 uppercase tracking-[0.1em] ${
                        hook.type === "documented"
                          ? "bg-[rgba(59,130,246,0.1)] text-[#60a5fa]"
                          : "bg-[rgba(168,85,247,0.1)] text-[#a855f7]"
                      }`}
                    >
                      {hook.type === "documented" ? "Documentado" : "Engineered"}
                    </span>
                    <span className="text-[11px] text-text-muted capitalize">
                      {hook.source === "ai_generated" ? "IA" : hook.source === "manual" ? "Manual" : hook.source}
                    </span>
                    {hook.niche && (
                      <span className="text-[11px] text-text-muted">{hook.niche}</span>
                    )}
                    <span className="text-[11px] text-text-muted capitalize">
                      {hook.platform?.replace("_", " ")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 1L7.5 4.5L11 5L8.5 7.5L9 11L6 9.5L3 11L3.5 7.5L1 5L4.5 4.5L6 1Z" fill={hook.performance_score > 7 ? "#fbbf24" : hook.performance_score > 4 ? "#666" : "#333"} />
                      </svg>
                      <span className="text-[14px] font-400 text-text-primary">{hook.performance_score}</span>
                    </div>
                    <p className="text-[10px] text-text-muted mt-0.5">
                      {hook.times_used}x usado
                    </p>
                  </div>
                  <DeleteHookButton hookId={hook.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
