export const dynamic = "force-dynamic";

import { createHook } from "@/lib/actions/hooks";
import { NewHookForm } from "./new-hook-form";

export default function NewHookPage() {
  return (
    <div className="stagger">
      <div className="mb-10">
        <h1 className="text-[32px] font-300 tracking-[-0.02em] text-text-primary">
          Añadir hook
        </h1>
        <p className="mt-2 text-[14px] text-text-secondary">
          Guarda un hook que quieras reutilizar
        </p>
      </div>

      <div className="mx-auto max-w-[640px]">
        <div className="rounded-[16px] border border-border-subtle bg-bg-surface p-8">
          <NewHookForm action={createHook} />
        </div>
      </div>
    </div>
  );
}
