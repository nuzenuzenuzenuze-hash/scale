export const dynamic = "force-dynamic";

import { createTrend } from "@/lib/actions/trends";
import { NewTrendForm } from "./new-trend-form";

export default function NewTrendPage() {
  return (
    <div className="stagger">
      <div className="mb-10">
        <h1 className="text-[32px] font-300 tracking-[-0.02em] text-text-primary">
          Registrar tendencia
        </h1>
        <p className="mt-2 text-[14px] text-text-secondary">
          Documenta una señal de tendencia que has detectado
        </p>
      </div>

      <div className="mx-auto max-w-[640px]">
        <div className="rounded-[16px] border border-border-subtle bg-bg-surface p-8">
          <NewTrendForm action={createTrend} />
        </div>
      </div>
    </div>
  );
}
