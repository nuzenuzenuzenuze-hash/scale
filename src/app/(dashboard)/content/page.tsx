export const dynamic = "force-dynamic";

import Link from "next/link";
import { getPieces } from "@/lib/actions/content";
import { getBrands } from "@/lib/actions/brands";
import { getMembers } from "@/lib/actions/team";
import { ContentFilters } from "./content-filters";

export default async function ContentPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string; step?: string; framework?: string; funnel?: string; editor?: string }>;
}) {
  const params = await searchParams;
  const [pieces, brands, members] = await Promise.all([
    getPieces({
      brand_id: params.brand || undefined,
      current_step: params.step ? parseInt(params.step) : undefined,
      framework_type: params.framework || undefined,
      funnel_position: params.funnel || undefined,
      assigned_editor_id: params.editor || undefined,
    }),
    getBrands(),
    getMembers(),
  ]);

  const stepLabels = ["Idea", "Framework", "Script", "Editor", "Review", "Publicado"];

  return (
    <div className="stagger">
      {/* Header */}
      <div className="mb-10 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-300 tracking-[-0.02em] text-text-primary">
            Contenido
          </h1>
          <p className="mt-2 text-[14px] text-text-secondary">
            Pipeline de producción de contenido
          </p>
        </div>
        <Link
          href="/content/new"
          className="shrink-0 rounded-[10px] bg-accent px-6 py-2.5 text-[13px] font-500 tracking-[0.04em] text-white transition-all duration-300 hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(254,46,46,0.25)]"
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          Nueva pieza
        </Link>
      </div>

      {/* Filters */}
      <ContentFilters brands={brands} members={members} params={params} />

      {/* Content */}
      {pieces.length === 0 ? (
        <div className="rounded-[16px] border border-border-subtle bg-bg-surface p-8">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mb-4">
              <rect x="8" y="6" width="32" height="36" rx="4" stroke="#333" strokeWidth="1.5" />
              <path d="M16 16H32M16 24H32M16 32H26" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="text-[14px] text-text-muted mb-6">
              No hay piezas de contenido que coincidan
            </p>
            <Link
              href="/content/new"
              className="rounded-[10px] bg-accent px-6 py-2.5 text-[13px] font-500 tracking-[0.04em] text-white transition-all duration-300 hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(254,46,46,0.25)]"
              style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
            >
              Crear primera pieza
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {pieces.map((piece) => (
            <Link
              key={piece.id}
              href={`/content/${piece.id}`}
              className="group flex items-center gap-4 rounded-[16px] border border-border-subtle bg-bg-surface p-5 transition-all duration-300 hover:border-border-hover hover:-translate-y-px"
              style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
            >
              {/* Step indicator */}
              <div className="flex items-center gap-1 shrink-0">
                {[1, 2, 3, 4, 5, 6].map((step) => (
                  <div
                    key={step}
                    className={`h-2 w-6 rounded-full transition-colors duration-300 ${
                      step < (piece.current_step || 1)
                        ? "bg-accent"
                        : step === (piece.current_step || 1)
                        ? "bg-accent/60"
                        : "bg-border-subtle"
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <p className="truncate text-[14px] font-400 text-text-primary">
                    {piece.title}
                  </p>
                  {piece.funnel_position && (
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-500 uppercase tracking-[0.1em] ${
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
                </div>
                <div className="mt-1 flex items-center gap-3">
                  {piece.brand_name && (
                    <span className="text-[12px] text-text-muted">{piece.brand_name}</span>
                  )}
                  <span className="text-[12px] text-text-muted">
                    Paso {piece.current_step || 1}/6 — {stepLabels[(piece.current_step || 1) - 1]}
                  </span>
                  {piece.editor_name && (
                    <span className="text-[12px] text-text-muted">
                      Editor: {piece.editor_name}
                    </span>
                  )}
                </div>
              </div>

              {/* Arrow */}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-text-muted group-hover:text-text-secondary transition-colors duration-300">
                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
