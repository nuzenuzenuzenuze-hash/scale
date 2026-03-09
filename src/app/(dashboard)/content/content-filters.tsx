"use client";

import { useRouter, usePathname } from "next/navigation";
import type { Brand } from "@/lib/actions/brands";
import type { TeamMember } from "@/lib/actions/team";

interface ContentFiltersProps {
  brands: Brand[];
  members: TeamMember[];
  params: { brand?: string; step?: string; framework?: string; funnel?: string; editor?: string };
}

export function ContentFilters({ brands, members, params }: ContentFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();

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

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      <select
        value={params.brand || ""}
        onChange={(e) => updateFilter("brand", e.target.value)}
        className={selectClass}
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <option value="">Todas las marcas</option>
        {brands.map((b) => (
          <option key={b.id} value={b.id}>{b.name}</option>
        ))}
      </select>

      <select
        value={params.step || ""}
        onChange={(e) => updateFilter("step", e.target.value)}
        className={selectClass}
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <option value="">Todos los pasos</option>
        <option value="1">1 — Idea</option>
        <option value="2">2 — Framework</option>
        <option value="3">3 — Script</option>
        <option value="4">4 — Editor</option>
        <option value="5">5 — Review</option>
        <option value="6">6 — Publicado</option>
      </select>

      <select
        value={params.framework || ""}
        onChange={(e) => updateFilter("framework", e.target.value)}
        className={selectClass}
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <option value="">Todo framework</option>
        <option value="documented">Documentado</option>
        <option value="engineered">Engineered</option>
      </select>

      <select
        value={params.funnel || ""}
        onChange={(e) => updateFilter("funnel", e.target.value)}
        className={selectClass}
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <option value="">Todo embudo</option>
        <option value="tofu">TOFU</option>
        <option value="mofu">MOFU</option>
        <option value="bofu">BOFU</option>
      </select>

      <select
        value={params.editor || ""}
        onChange={(e) => updateFilter("editor", e.target.value)}
        className={selectClass}
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <option value="">Todos los editores</option>
        {members
          .filter((m) => m.role === "editor" || m.role === "editor_lead")
          .map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
      </select>

      {Object.values(params).some(Boolean) && (
        <button
          onClick={() => router.push(pathname)}
          className="rounded-[10px] border border-border-subtle px-3 py-2 text-[12px] font-400 text-text-muted transition-all duration-300 hover:border-border-hover hover:text-text-secondary min-h-[44px]"
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
