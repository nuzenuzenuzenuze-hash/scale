export const dynamic = "force-dynamic";

import Link from "next/link";
import { getBrands } from "@/lib/actions/brands";

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <div className="stagger">
      {/* Header */}
      <div className="mb-10 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-300 tracking-[-0.02em] text-text-primary">
            Marcas
          </h1>
          <p className="mt-2 text-[14px] text-text-secondary">
            Gestiona tus marcas y sus perfiles de contenido
          </p>
        </div>
        <Link
          href="/brands/new"
          className="shrink-0 rounded-[10px] bg-accent px-6 py-2.5 text-[13px] font-500 tracking-[0.04em] text-white transition-all duration-300 hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(254,46,46,0.25)]"
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          Añadir marca
        </Link>
      </div>

      {/* Content */}
      {brands.length === 0 ? (
        <div className="rounded-[16px] border border-border-subtle bg-bg-surface p-8">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="18" r="8" stroke="#333" strokeWidth="1.5" />
                <path d="M8 42C8 35 14 30 22 30H26C34 30 40 35 40 42" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-[14px] text-text-muted mb-6">
              Aún no has añadido ninguna marca
            </p>
            <Link
              href="/brands/new"
              className="rounded-[10px] bg-accent px-6 py-2.5 text-[13px] font-500 tracking-[0.04em] text-white transition-all duration-300 hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(254,46,46,0.25)]"
              style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
            >
              Añadir primera marca
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.id}`}
              className="group rounded-[16px] border border-border-subtle bg-bg-surface p-6 transition-all duration-400 hover:border-border-hover hover:-translate-y-0.5"
              style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-bg-elevated border border-border-subtle text-[15px] font-500 text-text-primary uppercase">
                  {brand.name.charAt(0)}
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-text-muted group-hover:text-text-secondary transition-colors duration-300">
                  <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-[15px] font-500 text-text-primary mb-1">
                {brand.name}
              </h3>
              <div className="space-y-2 mt-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted">
                    Nicho
                  </span>
                  <span className="text-[12px] text-text-secondary">{brand.niche}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted">
                    Tono
                  </span>
                  <span className="text-[12px] text-text-secondary">{brand.tone}</span>
                </div>
              </div>
              {brand.brand_context_file && (
                <div className="mt-4 flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 1V7M3 4L6 7L9 4" stroke="#666" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 9H10" stroke="#666" strokeWidth="1" strokeLinecap="round" />
                  </svg>
                  <span className="text-[11px] text-text-muted">Archivo de contexto</span>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
