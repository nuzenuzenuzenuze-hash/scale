export const dynamic = "force-dynamic";

import Link from "next/link";
import { getTrends } from "@/lib/actions/trends";
import { TrendFilters } from "./trend-filters";
import { DeleteTrendButton } from "./delete-trend-button";

export default async function TrendsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; creator?: string }>;
}) {
  const params = await searchParams;
  const trends = await getTrends({
    type: params.type || undefined,
    creator_name: params.creator || undefined,
  });

  return (
    <div className="stagger">
      {/* Header */}
      <div className="mb-10 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-300 tracking-[-0.02em] text-text-primary">
            Trend Radar
          </h1>
          <p className="mt-2 text-[14px] text-text-secondary">
            Señales de tendencia y formatos que funcionan
          </p>
        </div>
        <Link
          href="/trends/new"
          className="shrink-0 rounded-[10px] bg-accent px-6 py-2.5 text-[13px] font-500 tracking-[0.04em] text-white transition-all duration-300 hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(254,46,46,0.25)]"
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          Registrar tendencia
        </Link>
      </div>

      {/* Filters */}
      <TrendFilters params={params} />

      {/* Content */}
      {trends.length === 0 ? (
        <div className="rounded-[16px] border border-border-subtle bg-bg-surface p-8">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mb-4">
              <path d="M6 38L16 24L26 30L42 12" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M32 12H42V22" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-[14px] text-text-muted mb-6">
              Aún no has registrado ninguna tendencia
            </p>
            <Link
              href="/trends/new"
              className="rounded-[10px] bg-accent px-6 py-2.5 text-[13px] font-500 tracking-[0.04em] text-white transition-all duration-300 hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(254,46,46,0.25)]"
              style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
            >
              Registrar primera tendencia
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {trends.map((trend) => (
            <div
              key={trend.id}
              className="rounded-[16px] border border-border-subtle bg-bg-surface p-6 transition-all duration-300 hover:border-border-hover"
              style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-500 uppercase tracking-[0.1em] ${
                        trend.type === "documented"
                          ? "bg-[rgba(59,130,246,0.1)] text-[#60a5fa]"
                          : "bg-[rgba(168,85,247,0.1)] text-[#a855f7]"
                      }`}
                    >
                      {trend.type === "documented" ? "Documentado" : "Engineered"}
                    </span>
                    <span className="text-[11px] text-text-muted">{trend.format}</span>
                    {trend.duration && (
                      <span className="text-[11px] text-text-muted">{trend.duration}</span>
                    )}
                    {trend.creator_name && (
                      <span className="text-[11px] text-text-muted">@{trend.creator_name}</span>
                    )}
                  </div>

                  <div className="mb-3">
                    <span className="text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted">
                      Hook
                    </span>
                    <p className="mt-1 text-[14px] font-300 text-text-primary leading-[1.6]">
                      &ldquo;{trend.hook_used}&rdquo;
                    </p>
                  </div>

                  {trend.notes && (
                    <p className="text-[13px] text-text-body leading-[1.6] mb-3">
                      {trend.notes}
                    </p>
                  )}

                  <div className="flex items-center gap-4">
                    {trend.reel_url && (
                      <a
                        href={trend.reel_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[12px] text-accent hover:text-accent-hover transition-colors duration-300"
                      >
                        Ver reel original
                      </a>
                    )}
                    {trend.adaptable_to && (
                      <span className="text-[11px] text-text-muted">
                        Adaptable a: {trend.adaptable_to}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-text-muted">
                    {new Date(trend.created_at).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  <DeleteTrendButton trendId={trend.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
