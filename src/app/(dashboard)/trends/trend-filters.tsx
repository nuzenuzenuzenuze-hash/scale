"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

interface TrendFiltersProps {
  params: { type?: string; creator?: string };
}

export function TrendFilters({ params }: TrendFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [creatorSearch, setCreatorSearch] = useState(params.creator || "");

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

      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateFilter("creator", creatorSearch);
        }}
        className="flex items-center gap-1"
      >
        <input
          type="text"
          value={creatorSearch}
          onChange={(e) => setCreatorSearch(e.target.value)}
          placeholder="Buscar por creador..."
          className="rounded-[10px] border border-border-subtle bg-bg-primary px-3 py-2 text-[12px] font-300 text-text-primary placeholder:text-text-muted transition-all duration-300 focus:border-accent focus:shadow-[0_0_0_3px_rgba(254,46,46,0.125)] focus:outline-none min-h-[44px] w-48"
          style={easing}
        />
      </form>

      {Object.values(params).some(Boolean) && (
        <button
          onClick={() => {
            setCreatorSearch("");
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
