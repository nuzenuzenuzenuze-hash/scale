export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrand } from "@/lib/actions/brands";
import { getPieces } from "@/lib/actions/content";
import { DeleteBrandButton } from "./delete-button";

export default async function BrandDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const brand = await getBrand(id);
  if (!brand) notFound();

  const allPieces = await getPieces();
  const brandPieces = allPieces.filter((p) => p.brand_id === id);

  const funnelChecklist = [
    { label: "TOFU — Contenido de descubrimiento", key: "tofu" },
    { label: "MOFU — Contenido de consideración", key: "mofu" },
    { label: "BOFU — Contenido de conversión", key: "bofu" },
  ];

  const funnelCounts = {
    tofu: brandPieces.filter((p) => p.funnel_position === "tofu").length,
    mofu: brandPieces.filter((p) => p.funnel_position === "mofu").length,
    bofu: brandPieces.filter((p) => p.funnel_position === "bofu").length,
  };

  return (
    <div className="stagger">
      {/* Header */}
      <div className="mb-10 flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-bg-elevated border border-border-subtle text-[22px] font-500 text-text-primary uppercase">
            {brand.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-[32px] font-300 tracking-[-0.02em] text-text-primary">
              {brand.name}
            </h1>
            <p className="mt-1 text-[14px] text-text-secondary">
              {brand.niche}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/brands/${id}/edit`}
            className="rounded-[10px] border border-border-subtle px-5 py-2.5 text-[13px] font-400 text-text-secondary transition-all duration-300 hover:border-border-hover hover:text-text-body"
            style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
          >
            Editar
          </Link>
          <DeleteBrandButton brandId={id} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {/* Brand Info */}
        <div className="lg:col-span-2 space-y-3">
          <div className="rounded-[16px] border border-border-subtle bg-bg-surface p-8">
            <h2 className="text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted mb-6">
              Información de la marca
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <span className="text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted">
                  Tono
                </span>
                <p className="mt-1 text-[14px] font-300 text-text-primary">{brand.tone}</p>
              </div>
              <div>
                <span className="text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted">
                  Nicho
                </span>
                <p className="mt-1 text-[14px] font-300 text-text-primary">{brand.niche}</p>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted">
                  Audiencia objetivo
                </span>
                <p className="mt-1 text-[14px] font-300 text-text-body leading-[1.6]">
                  {brand.target_audience}
                </p>
              </div>
              {brand.brand_context_file && (
                <div className="sm:col-span-2">
                  <span className="text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted">
                    Archivo de contexto
                  </span>
                  <p className="mt-1 flex items-center gap-2 text-[13px] text-text-secondary">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="3" y="1" width="8" height="12" rx="1.5" stroke="#666" strokeWidth="1.2" />
                      <path d="M5.5 5H8.5M5.5 7H8.5M5.5 9H7" stroke="#666" strokeWidth="1" strokeLinecap="round" />
                    </svg>
                    {brand.brand_context_file.split("/").pop()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Content Pieces */}
          <div className="rounded-[16px] border border-border-subtle bg-bg-surface p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted">
                Piezas de contenido ({brandPieces.length})
              </h2>
              <Link
                href={`/content/new?brand=${id}`}
                className="text-[12px] font-500 text-accent transition-colors duration-300 hover:text-accent-hover"
              >
                + Nueva pieza
              </Link>
            </div>
            {brandPieces.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="mb-4">
                  <rect x="6" y="4" width="28" height="32" rx="4" stroke="#333" strokeWidth="1.5" />
                  <path d="M13 14H27M13 20H27M13 26H21" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <p className="text-[13px] text-text-muted mb-4">Sin piezas de contenido</p>
                <Link
                  href={`/content/new?brand=${id}`}
                  className="rounded-[10px] bg-accent px-5 py-2 text-[12px] font-500 text-white transition-all duration-300 hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(254,46,46,0.25)]"
                  style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
                >
                  Crear primera pieza
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {brandPieces.map((piece) => {
                  const stepLabels = ["Idea", "Framework", "Script", "Editor", "Review", "Publicado"];
                  return (
                    <Link
                      key={piece.id}
                      href={`/content/${piece.id}`}
                      className="flex items-center justify-between rounded-[10px] border border-border-subtle bg-bg-primary px-4 py-3 transition-all duration-300 hover:border-border-hover"
                      style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-400 text-text-primary">
                          {piece.title}
                        </p>
                        <p className="text-[11px] text-text-muted mt-0.5">
                          Paso {piece.current_step}/6 — {stepLabels[(piece.current_step || 1) - 1]}
                        </p>
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
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar — Funnel Audit */}
        <div className="space-y-3">
          <div className="rounded-[16px] border border-border-subtle bg-bg-surface p-8">
            <h2 className="text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted mb-6">
              Auditoría de embudo
            </h2>
            <div className="space-y-4">
              {funnelChecklist.map((item) => {
                const count = funnelCounts[item.key as keyof typeof funnelCounts];
                const hasContent = count > 0;
                return (
                  <div key={item.key} className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        hasContent
                          ? "border-success bg-[rgba(52,211,153,0.1)]"
                          : "border-border-subtle"
                      }`}
                    >
                      {hasContent && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5L4 7L8 3" stroke="#34d399" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className={`text-[13px] ${hasContent ? "text-text-primary" : "text-text-secondary"}`}>
                        {item.label}
                      </p>
                      <p className="text-[11px] text-text-muted mt-0.5">
                        {count} {count === 1 ? "pieza" : "piezas"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[16px] border border-border-subtle bg-bg-surface p-8">
            <h2 className="text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted mb-6">
              Resumen
            </h2>
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted">
                  Total piezas
                </span>
                <p className="mt-1 text-[24px] font-200 text-text-primary">{brandPieces.length}</p>
              </div>
              <div>
                <span className="text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted">
                  Publicadas
                </span>
                <p className="mt-1 text-[24px] font-200 text-text-primary">
                  {brandPieces.filter((p) => p.current_step === 6).length}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted">
                  En progreso
                </span>
                <p className="mt-1 text-[24px] font-200 text-text-primary">
                  {brandPieces.filter((p) => (p.current_step || 1) < 6).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
