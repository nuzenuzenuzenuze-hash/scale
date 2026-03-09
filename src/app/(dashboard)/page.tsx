export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <div className="stagger">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-[32px] font-300 tracking-[-0.02em] text-text-primary">
          Dashboard
        </h1>
        <p className="mt-2 text-[14px] text-text-secondary">
          Vista general de tus operaciones de contenido
        </p>
      </div>

      {/* Stats Grid — Bento style */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Piezas activas" value="—" />
        <StatCard label="En producción" value="—" />
        <StatCard label="Publicadas este mes" value="—" />
        <StatCard label="Marcas activas" value="—" />
      </div>

      {/* Content area */}
      <div className="mt-8 grid grid-cols-1 gap-3 lg:grid-cols-3">
        {/* Recent content — spans 2 cols */}
        <div className="lg:col-span-2 rounded-[16px] border border-border-subtle bg-bg-surface p-8">
          <h2 className="text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted mb-6">
            Contenido reciente
          </h2>
          <EmptyState
            icon={
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect x="6" y="4" width="28" height="32" rx="4" stroke="#333" strokeWidth="1.5" />
                <path d="M13 14H27M13 20H27M13 26H21" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            }
            message="Aún no has creado ninguna pieza de contenido"
            cta="Crear primera pieza"
          />
        </div>

        {/* Quick actions */}
        <div className="rounded-[16px] border border-border-subtle bg-bg-surface p-8">
          <h2 className="text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted mb-6">
            Acciones rápidas
          </h2>
          <div className="space-y-2">
            <QuickAction label="Nueva pieza de contenido" />
            <QuickAction label="Añadir marca" />
            <QuickAction label="Generar script" />
            <QuickAction label="Registrar tendencia" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="group rounded-[16px] border border-border-subtle bg-bg-surface p-6 transition-all duration-400 hover:border-border-hover hover:-translate-y-0.5"
      style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      <span className="text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted">
        {label}
      </span>
      <p className="mt-3 text-[32px] font-200 tracking-[-0.02em] text-text-primary">
        {value}
      </p>
    </div>
  );
}

function EmptyState({
  icon,
  message,
  cta,
}: {
  icon: React.ReactNode;
  message: string;
  cta: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4">{icon}</div>
      <p className="text-[14px] text-text-muted mb-6">{message}</p>
      <button
        className="rounded-[10px] bg-accent px-6 py-2.5 text-[13px] font-500 tracking-[0.04em] text-white transition-all duration-300 hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(254,46,46,0.25)]"
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        {cta}
      </button>
    </div>
  );
}

function QuickAction({ label }: { label: string }) {
  return (
    <button
      className="flex w-full items-center gap-3 rounded-[10px] border border-border-subtle bg-transparent px-4 py-3 text-left text-[13px] font-400 text-text-secondary transition-all duration-300 hover:border-border-hover hover:bg-[rgba(255,255,255,0.03)] hover:text-text-body"
      style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border-subtle text-text-muted">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M5 1V9M1 5H9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </span>
      {label}
    </button>
  );
}
