export const dynamic = "force-dynamic";

import { createMember } from "@/lib/actions/team";
import { NewMemberForm } from "./new-member-form";

export default function NewMemberPage() {
  return (
    <div className="stagger">
      <div className="mb-10">
        <h1 className="text-[32px] font-300 tracking-[-0.02em] text-text-primary">
          Nuevo miembro
        </h1>
        <p className="mt-2 text-[14px] text-text-secondary">
          Añade un nuevo miembro a tu equipo de contenido
        </p>
      </div>

      <div className="mx-auto max-w-[640px]">
        <div className="rounded-[16px] border border-border-subtle bg-bg-surface p-8">
          <NewMemberForm action={createMember} />
        </div>
      </div>
    </div>
  );
}
