export const dynamic = "force-dynamic";

import { createBrand } from "@/lib/actions/brands";
import { BrandForm } from "./brand-form";

export default function NewBrandPage() {
  return (
    <div className="stagger">
      <div className="mb-10">
        <h1 className="text-[32px] font-300 tracking-[-0.02em] text-text-primary">
          Nueva marca
        </h1>
        <p className="mt-2 text-[14px] text-text-secondary">
          Define el perfil de tu marca para generar contenido coherente
        </p>
      </div>

      <div className="mx-auto max-w-[640px]">
        <div className="rounded-[16px] border border-border-subtle bg-bg-surface p-8">
          <BrandForm action={createBrand} />
        </div>
      </div>
    </div>
  );
}
