export const dynamic = "force-dynamic";

import { getBrands } from "@/lib/actions/brands";
import { NewContentForm } from "./new-content-form";

export default async function NewContentPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string }>;
}) {
  const params = await searchParams;
  const brands = await getBrands();

  return (
    <div className="stagger">
      <div className="mb-10">
        <h1 className="text-[32px] font-300 tracking-[-0.02em] text-text-primary">
          Nueva pieza de contenido
        </h1>
        <p className="mt-2 text-[14px] text-text-secondary">
          Define la idea inicial para tu nueva pieza de contenido
        </p>
      </div>

      <div className="mx-auto max-w-[640px]">
        <div className="rounded-[16px] border border-border-subtle bg-bg-surface p-8">
          <NewContentForm brands={brands} preselectedBrand={params.brand} />
        </div>
      </div>
    </div>
  );
}
