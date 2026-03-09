"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

interface HookFiltersProps {
  params: { type?: string; source?: string; niche?: string; platform?: string; search?: string };
}

export function HookFilters({ params }: HookFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState(params.search || "");

  function updateFilter(key: string, value: string) {
    const current = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v) current.set(k, v);
    });
    if (value) {
      current.set(key, value);
    } else {
      current.delete(key);
    }
    router.push(`${pathname}?${current.toString()}`);
  }

  const selectClass =
    "rounded-[10px] border border-border-subtle bg-bg-primary px-3 py-2 text-[12px] font-300 text-text-secondary transition-all duration-300 focus:border-accent focus:shadow-[0_0_0_3px_rgba(254,46,46,0.125)] focus:outline-none min-h-[44px] appearance-none cursor-pointer";
  const easing = { transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" };

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateFilter("search", search);
        }}
        className="flex items-center"
      >
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar hooks..."
          className="rounded-[10px] border border-border-subtle bg-bg-primary px-3 py-2 text-[12px] font-300 text-text-primary placeholder:text-text-muted transition-all duration-300 focus:border-accent focus:shadow-[0_0_0_3px_rgba(254,46,46,0.125)] focus:outline-none min-h-[44px] w-56"
          style={easing}
        />
      </form>

      <select
        value={params.type || ""}
        onChange={(e) => updateFilter("type", e.target.value)}
        className={selectClass}
        style={easing}
      >
        <option value="">Todos los tipos</option>
        <option value="documented">Documentado</option>
        <option value="engineered">Engineered</option>
      </select>

      <select
        value={params.source || ""}
        onChange={(e) => updateFilter("source", e.target.value)}
        className={selectClass}
        style={easing}
      >
        <option value="">Todas las fuentes</option>
        <option value="manual">Manual</option>
        <option value="ai_generated">Generado por IA</option>
        <option value="trend">De tendencia</option>
      </select>

      <select
        value={params.platform || ""}
        onChange={(e) => updateFilter("platform", e.target.value)}
        className={selectClass}
        style={easing}
      >
        <option value="">Todas las plataformas</option>
        <option value="instagram_reels">Instagram Reels</option>
        <option value="tiktok">TikTok</option>
        <option value="youtube_shorts">YouTube Shorts</option>
        <option value="linkedin">LinkedIn</option>
        <option value="twitter">Twitter/X</option>
      </select>

      {Object.values(params).some(Boolean) && (
        <button
          onClick={() => {
            setSearch("");
            router.push(pathname);
          }}
          className="rounded-[10px] border border-border-subtle px-3 py-2 text-[12px] font-400 text-text-muted transition-all duration-300 hover:border-border-hover hover:text-text-secondary min-h-[44px]"
          style={easing}
        >
          Limpiar
        </button>
      )}
    </div>
  );
}
