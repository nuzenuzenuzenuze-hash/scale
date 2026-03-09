export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getBrand, updateBrand } from "@/lib/actions/brands";
import { BrandForm } from "../../new/brand-form";

export default async function EditBrandPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const brand = await getBrand(id);
  if (!brand) notFound();

  const updateBrandWithId = async (formData: FormData) => {
    "use server";
    await updateBrand(id, formData);
  };

  return (
    <div className="stagger">
      <div className="mb-10">
        <h1 className="text-[32px] font-300 tracking-[-0.02em] text-text-primary">
          Editar marca
        </h1>
        <p className="mt-2 text-[14px] text-text-secondary">
          Actualiza la información de {brand.name}
        </p>
      </div>

      <div className="mx-auto max-w-[640px]">
        <div className="rounded-[16px] border border-border-subtle bg-bg-surface p-8">
          <BrandForm action={updateBrandWithId} brand={brand} />
        </div>
      </div>
    </div>
  );
}
