export const dynamic = "force-dynamic";

import Link from "next/link";
import { getMembers } from "@/lib/actions/team";
import { DeleteMemberButton } from "./delete-member-button";
import { EditMemberButton } from "./edit-member-button";

export default async function TeamPage() {
  const members = await getMembers();

  return (
    <div className="stagger">
      {/* Header */}
      <div className="mb-10 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-300 tracking-[-0.02em] text-text-primary">
            Equipo
          </h1>
          <p className="mt-2 text-[14px] text-text-secondary">
            Gestiona tu equipo y su carga de trabajo
          </p>
        </div>
        <Link
          href="/team/new"
          className="shrink-0 rounded-[10px] bg-accent px-6 py-2.5 text-[13px] font-500 tracking-[0.04em] text-white transition-all duration-300 hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(254,46,46,0.25)]"
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          Añadir miembro
        </Link>
      </div>

      {/* Content */}
      {members.length === 0 ? (
        <div className="rounded-[16px] border border-border-subtle bg-bg-surface p-8">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mb-4">
              <circle cx="18" cy="16" r="6" stroke="#333" strokeWidth="1.5" />
              <circle cx="34" cy="18" r="5" stroke="#333" strokeWidth="1.5" />
              <path d="M4 42C4 35 10 30 18 30C26 30 32 35 32 42" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M32 30C37 30 42 33 42 39" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="text-[14px] text-text-muted mb-6">
              Aún no has añadido miembros al equipo
            </p>
            <Link
              href="/team/new"
              className="rounded-[10px] bg-accent px-6 py-2.5 text-[13px] font-500 tracking-[0.04em] text-white transition-all duration-300 hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(254,46,46,0.25)]"
              style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
            >
              Añadir primer miembro
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => {
            const loadPercentage = member.capacity > 0
              ? Math.min(100, Math.round((member.active_pieces / member.capacity) * 100))
              : 0;
            const isOverloaded = member.active_pieces >= member.capacity;

            return (
              <div
                key={member.id}
                className="rounded-[16px] border border-border-subtle bg-bg-surface p-6 transition-all duration-300 hover:border-border-hover"
                style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-elevated border border-border-subtle text-[14px] font-500 text-text-primary uppercase">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-[14px] font-500 text-text-primary">{member.name}</h3>
                      <p className="text-[11px] text-text-muted capitalize">{member.role.replace("_", " ")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <EditMemberButton member={member} />
                    <DeleteMemberButton memberId={member.id} />
                  </div>
                </div>

                {member.specialties && (
                  <div className="mb-4">
                    <span className="text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted">
                      Especialidades
                    </span>
                    <p className="mt-1 text-[12px] text-text-secondary">{member.specialties}</p>
                  </div>
                )}

                {/* Workload bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted">
                      Carga de trabajo
                    </span>
                    <span className={`text-[12px] font-400 ${isOverloaded ? "text-error" : "text-text-secondary"}`}>
                      {member.active_pieces}/{member.capacity}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-bg-elevated overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOverloaded ? "bg-error" : loadPercentage > 70 ? "bg-warning" : "bg-accent"
                      }`}
                      style={{
                        width: `${loadPercentage}%`,
                        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
