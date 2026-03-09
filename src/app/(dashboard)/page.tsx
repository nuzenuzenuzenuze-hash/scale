export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  getDashboardStats,
  getBrandMetrics,
  getFunnelBalance,
  getContentCalendar,
  getConsistencyScore,
  getTopHooks,
} from "@/lib/actions/analytics";
import { getPieces } from "@/lib/actions/content";

export default async function DashboardPage() {
  const [stats, brandMetrics, funnel, calendar, consistency, topHooks, recentPieces] =
    await Promise.all([
      getDashboardStats(),
      getBrandMetrics(),
      getFunnelBalance(),
      getContentCalendar(),
      getConsistencyScore(),
      getTopHooks(),
      getPieces(),
    ]);

  const stepLabels = ["Idea", "Framework", "Script", "Editor", "Review", "Publicado"];

  // Calendar: build month grid
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  const calendarMap: Record<string, typeof calendar[0]> = {};
  calendar.forEach((entry) => {
    calendarMap[entry.date] = entry;
  });

  return (
    <div className="stagger">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-[32px] font-300 tracking-[-0.02em] text-text-primary">
          Dashboard
        </h1>
        <p className="mt-2 text-[14px] text-text-secondary">
          Vista general de tus operaciones de contenido
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Piezas activas" value={String(stats.activePieces)} />
        <StatCard label="En producción" value={String(stats.inProduction)} />
        <StatCard label="Publicadas este mes" value={String(stats.publishedThisMonth)} />
        <StatCard label="Marcas activas" value={String(stats.activeBrands)} />
      </div>

      {/* Main grid */}
      <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-3">
        {/* Content Calendar — spans 2 cols */}
        <div className="lg:col-span-2 rounded-[16px] border border-border-subtle bg-bg-surface p-8">
          <h2 className="text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted mb-6">
            Calendario de contenido — {now.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
          </h2>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["L", "M", "X", "J", "V", "S", "D"].map((day) => (
              <div key={day} className="text-center text-[10px] font-500 text-text-muted uppercase tracking-[0.1em] py-1">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before first of month (adjust for Monday start) */}
            {Array.from({ length: (firstDay + 6) % 7 }).map((_, i) => (
              <div key={`empty-${i}`} className="h-10" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const entry = calendarMap[dateStr];
              const isToday = day === now.getDate();

              return (
                <div
                  key={day}
                  className={`relative h-10 flex flex-col items-center justify-center rounded-[8px] text-[12px] ${
                    isToday
                      ? "bg-accent-secondary text-accent font-500"
                      : "text-text-secondary hover:bg-[rgba(255,255,255,0.03)]"
                  } transition-colors duration-200`}
                >
                  {day}
                  {entry && (
                    <div className="flex gap-0.5 mt-0.5">
                      {entry.pieces.slice(0, 3).map((p) => (
                        <div
                          key={p.id}
                          className={`h-1 w-1 rounded-full ${
                            p.funnel_position === "tofu"
                              ? "bg-[#60a5fa]"
                              : p.funnel_position === "mofu"
                              ? "bg-[#fbbf24]"
                              : p.funnel_position === "bofu"
                              ? "bg-[#34d399]"
                              : "bg-text-muted"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-[#60a5fa]" />
              <span className="text-[10px] text-text-muted">TOFU</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-[#fbbf24]" />
              <span className="text-[10px] text-text-muted">MOFU</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-[#34d399]" />
              <span className="text-[10px] text-text-muted">BOFU</span>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-3">
          {/* Funnel Balance */}
          <div className="rounded-[16px] border border-border-subtle bg-bg-surface p-8">
            <h2 className="text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted mb-4">
              Balance del embudo
            </h2>
            {funnel.total === 0 ? (
              <p className="text-[13px] text-text-muted">Sin datos</p>
            ) : (
              <>
                <div className="flex h-3 rounded-full overflow-hidden mb-4">
                  {funnel.tofu > 0 && (
                    <div
                      className="bg-[#60a5fa] transition-all duration-500"
                      style={{
                        width: `${(funnel.tofu / funnel.total) * 100}%`,
                        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    />
                  )}
                  {funnel.mofu > 0 && (
                    <div
                      className="bg-[#fbbf24] transition-all duration-500"
                      style={{
                        width: `${(funnel.mofu / funnel.total) * 100}%`,
                        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    />
                  )}
                  {funnel.bofu > 0 && (
                    <div
                      className="bg-[#34d399] transition-all duration-500"
                      style={{
                        width: `${(funnel.bofu / funnel.total) * 100}%`,
                        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#60a5fa]" />
                      <span className="text-[12px] text-text-secondary">TOFU</span>
                    </div>
                    <span className="text-[12px] text-text-primary">{funnel.tofu} ({funnel.total > 0 ? Math.round((funnel.tofu / funnel.total) * 100) : 0}%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#fbbf24]" />
                      <span className="text-[12px] text-text-secondary">MOFU</span>
                    </div>
                    <span className="text-[12px] text-text-primary">{funnel.mofu} ({funnel.total > 0 ? Math.round((funnel.mofu / funnel.total) * 100) : 0}%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#34d399]" />
                      <span className="text-[12px] text-text-secondary">BOFU</span>
                    </div>
                    <span className="text-[12px] text-text-primary">{funnel.bofu} ({funnel.total > 0 ? Math.round((funnel.bofu / funnel.total) * 100) : 0}%)</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Consistency Score */}
          <div className="rounded-[16px] border border-border-subtle bg-bg-surface p-8">
            <h2 className="text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted mb-4">
              Consistencia (4 semanas)
            </h2>
            <div className="flex items-end gap-3">
              <span className="text-[40px] font-200 tracking-[-0.02em] text-text-primary leading-none">
                {consistency}%
              </span>
              <span className="text-[12px] text-text-muted mb-1">
                semanas con publicación
              </span>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-bg-elevated overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  consistency >= 75 ? "bg-success" : consistency >= 50 ? "bg-warning" : "bg-error"
                }`}
                style={{
                  width: `${consistency}%`,
                  transition: "width 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
            </div>
          </div>

          {/* Quick actions */}
          <div className="rounded-[16px] border border-border-subtle bg-bg-surface p-8">
            <h2 className="text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted mb-4">
              Acciones rápidas
            </h2>
            <div className="space-y-2">
              <QuickAction label="Nueva pieza de contenido" href="/content/new" />
              <QuickAction label="Añadir marca" href="/brands/new" />
              <QuickAction label="Registrar tendencia" href="/trends/new" />
              <QuickAction label="Añadir hook" href="/hooks/new" />
            </div>
          </div>
        </div>
      </div>

      {/* Second row */}
      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
        {/* Recent content */}
        <div className="lg:col-span-2 rounded-[16px] border border-border-subtle bg-bg-surface p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted">
              Contenido reciente
            </h2>
            <Link href="/content" className="text-[12px] text-accent hover:text-accent-hover transition-colors duration-300">
              Ver todo
            </Link>
          </div>
          {recentPieces.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="mb-4">
                <rect x="6" y="4" width="28" height="32" rx="4" stroke="#333" strokeWidth="1.5" />
                <path d="M13 14H27M13 20H27M13 26H21" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <p className="text-[14px] text-text-muted mb-6">Aún no has creado ninguna pieza de contenido</p>
              <Link
                href="/content/new"
                className="rounded-[10px] bg-accent px-6 py-2.5 text-[13px] font-500 tracking-[0.04em] text-white transition-all duration-300 hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(254,46,46,0.25)]"
                style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
              >
                Crear primera pieza
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recentPieces.slice(0, 5).map((piece) => (
                <Link
                  key={piece.id}
                  href={`/content/${piece.id}`}
                  className="flex items-center justify-between rounded-[10px] border border-border-subtle bg-bg-primary px-4 py-3 transition-all duration-300 hover:border-border-hover"
                  style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-400 text-text-primary">{piece.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-text-muted">{piece.brand_name}</span>
                      <span className="text-[11px] text-text-muted">
                        {stepLabels[(piece.current_step || 1) - 1]}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-3">
                    {[1, 2, 3, 4, 5, 6].map((step) => (
                      <div
                        key={step}
                        className={`h-1.5 w-1.5 rounded-full ${
                          step <= (piece.current_step || 1) ? "bg-accent" : "bg-border-subtle"
                        }`}
                      />
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right column — Brand metrics + top hooks */}
        <div className="space-y-3">
          {/* Brand Metrics */}
          <div className="rounded-[16px] border border-border-subtle bg-bg-surface p-8">
            <h2 className="text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted mb-4">
              Métricas por marca
            </h2>
            {brandMetrics.length === 0 ? (
              <p className="text-[13px] text-text-muted">Sin datos de marcas</p>
            ) : (
              <div className="space-y-4">
                {brandMetrics.map((bm) => (
                  <Link
                    key={bm.brand_id}
                    href={`/brands/${bm.brand_id}`}
                    className="block rounded-[10px] border border-border-subtle bg-bg-primary p-4 transition-all duration-300 hover:border-border-hover"
                    style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[13px] font-400 text-text-primary">{bm.brand_name}</span>
                      <span className="text-[11px] text-text-muted">{bm.piece_count} piezas</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <span className="text-[10px] text-text-muted">Views</span>
                        <p className="text-[13px] font-400 text-text-primary">{formatNumber(bm.total_views)}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-text-muted">Eng.</span>
                        <p className="text-[13px] font-400 text-text-primary">{bm.avg_engagement}%</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-text-muted">Follows</span>
                        <p className="text-[13px] font-400 text-text-primary">{formatNumber(bm.total_follows)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Top Hooks */}
          <div className="rounded-[16px] border border-border-subtle bg-bg-surface p-8">
            <h2 className="text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted mb-4">
              Mejores hooks
            </h2>
            {topHooks.length === 0 ? (
              <p className="text-[13px] text-text-muted">Sin hooks registrados</p>
            ) : (
              <div className="space-y-3">
                {topHooks.map((hook, i) => (
                  <div key={hook.id} className="flex items-start gap-3">
                    <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-bg-elevated text-[10px] font-500 text-text-muted">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-300 text-text-body leading-[1.5] line-clamp-2">
                        &ldquo;{hook.hook_text}&rdquo;
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M5 0.5L6.25 3.5L9.5 3.8L7 6L7.75 9.2L5 7.5L2.25 9.2L3 6L0.5 3.8L3.75 3.5L5 0.5Z" fill="#fbbf24" />
                        </svg>
                        <span className="text-[10px] text-text-muted">{hook.performance_score}/10</span>
                        <span className="text-[10px] text-text-muted">{hook.times_used}x</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="group rounded-[16px] border border-border-subtle bg-bg-surface p-6 transition-all duration-400 hover:border-border-hover hover:-translate-y-0.5"
      style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      <span className="text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted">
        {label}
      </span>
      <p className="mt-3 text-[32px] font-200 tracking-[-0.02em] text-text-primary">
        {value}
      </p>
    </div>
  );
}

function QuickAction({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex w-full items-center gap-3 rounded-[10px] border border-border-subtle bg-transparent px-4 py-3 text-left text-[13px] font-400 text-text-secondary transition-all duration-300 hover:border-border-hover hover:bg-[rgba(255,255,255,0.03)] hover:text-text-body"
      style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border-subtle text-text-muted">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M5 1V9M1 5H9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </span>
      {label}
    </Link>
  );
}

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}
