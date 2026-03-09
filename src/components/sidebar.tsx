"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_SECTIONS = [
  {
    label: "Principal",
    items: [
      { name: "Dashboard", href: "/", icon: DashboardIcon },
      { name: "Contenido", href: "/content", icon: ContentIcon },
      { name: "Marcas", href: "/brands", icon: BrandsIcon },
    ],
  },
  {
    label: "Herramientas",
    items: [
      { name: "Script Generator", href: "/scripts", icon: ScriptIcon },
      { name: "Trend Radar", href: "/trends", icon: TrendIcon },
      { name: "Hooks Library", href: "/hooks", icon: HookIcon },
    ],
  },
  {
    label: "Gestión",
    items: [
      { name: "Equipo", href: "/team", icon: TeamIcon },
      { name: "Analíticas", href: "/analytics", icon: AnalyticsIcon },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-[10px] border border-border-subtle bg-bg-surface lg:hidden"
        style={{ transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
        aria-label="Abrir menú"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d={mobileOpen ? "M4.5 4.5L13.5 13.5M4.5 13.5L13.5 4.5" : "M2 4.5H16M2 9H16M2 13.5H16"} stroke="#999" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-dvh border-r border-border-subtle bg-bg-primary
          flex flex-col
          transition-all duration-300
          ${collapsed ? "w-[68px]" : "w-[260px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static
        `}
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-border-subtle">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-2 w-2 rounded-full bg-accent" />
              <span className="text-[15px] font-700 tracking-[-0.02em] text-text-primary">
                SCALE
              </span>
            </Link>
          )}
          {collapsed && (
            <div className="mx-auto h-2 w-2 rounded-full bg-accent" />
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-[8px] text-text-muted hover:bg-[rgba(255,255,255,0.03)] hover:text-text-secondary"
            style={{ transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
            aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d={collapsed ? "M5 3L9 7L5 11" : "M9 3L5 7L9 11"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="mb-6">
              {!collapsed && (
                <span className="mb-2 block px-3 text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted">
                  {section.label}
                </span>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`
                        group relative flex items-center gap-3 rounded-[8px] px-3 py-2.5
                        transition-all duration-300
                        ${collapsed ? "justify-center" : ""}
                        ${isActive
                          ? "bg-accent-secondary text-accent"
                          : "text-text-secondary hover:bg-[rgba(255,255,255,0.03)] hover:text-text-body"
                        }
                      `}
                      style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent" />
                      )}
                      <item.icon size={18} active={isActive} />
                      {!collapsed && (
                        <span className="text-[13px] font-400">
                          {item.name}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-border-subtle p-3">
          <div
            className={`
              flex items-center gap-3 rounded-[8px] px-3 py-2.5
              ${collapsed ? "justify-center" : ""}
            `}
          >
            <div className="h-8 w-8 shrink-0 rounded-full bg-bg-elevated border border-border-subtle" />
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-[13px] font-400 text-text-primary">Admin</p>
                <p className="truncate text-[11px] text-text-muted">admin@nuze.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

/* ============================================
   ICONS — Custom minimal SVGs
   ============================================ */

function DashboardIcon({ size = 18, active = false }: { size?: number; active?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <rect x="2" y="2" width="6" height="6" rx="2" stroke={active ? "#fe2e2e" : "currentColor"} strokeWidth="1.3" />
      <rect x="10" y="2" width="6" height="4" rx="2" stroke={active ? "#fe2e2e" : "currentColor"} strokeWidth="1.3" />
      <rect x="2" y="10" width="6" height="4" rx="2" stroke={active ? "#fe2e2e" : "currentColor"} strokeWidth="1.3" />
      <rect x="10" y="8" width="6" height="8" rx="2" stroke={active ? "#fe2e2e" : "currentColor"} strokeWidth="1.3" />
    </svg>
  );
}

function ContentIcon({ size = 18, active = false }: { size?: number; active?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <rect x="3" y="2" width="12" height="14" rx="2" stroke={active ? "#fe2e2e" : "currentColor"} strokeWidth="1.3" />
      <path d="M6 6H12M6 9H12M6 12H9" stroke={active ? "#fe2e2e" : "currentColor"} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function BrandsIcon({ size = 18, active = false }: { size?: number; active?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="7" r="3" stroke={active ? "#fe2e2e" : "currentColor"} strokeWidth="1.3" />
      <path d="M3 16C3 13.2386 5.23858 11 8 11H10C12.7614 11 15 13.2386 15 16" stroke={active ? "#fe2e2e" : "currentColor"} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function ScriptIcon({ size = 18, active = false }: { size?: number; active?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path d="M5 3L5 13C5 14.1046 5.89543 15 7 15H13" stroke={active ? "#fe2e2e" : "currentColor"} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M8 6L11 9L8 12" stroke={active ? "#fe2e2e" : "currentColor"} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrendIcon({ size = 18, active = false }: { size?: number; active?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path d="M2 14L6 9L10 11L16 4" stroke={active ? "#fe2e2e" : "currentColor"} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 4H16V8" stroke={active ? "#fe2e2e" : "currentColor"} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HookIcon({ size = 18, active = false }: { size?: number; active?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path d="M9 2V7L12 10" stroke={active ? "#fe2e2e" : "currentColor"} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 7C9 7 5 8 5 12C5 14.2091 6.79086 16 9 16C11.2091 16 13 14.2091 13 12" stroke={active ? "#fe2e2e" : "currentColor"} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function TeamIcon({ size = 18, active = false }: { size?: number; active?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <circle cx="7" cy="6" r="2.5" stroke={active ? "#fe2e2e" : "currentColor"} strokeWidth="1.3" />
      <circle cx="13" cy="7" r="2" stroke={active ? "#fe2e2e" : "currentColor"} strokeWidth="1.3" />
      <path d="M1 16C1 13 3.5 11 7 11C10.5 11 13 13 13 16" stroke={active ? "#fe2e2e" : "currentColor"} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M13 11C15 11 17 12.5 17 15" stroke={active ? "#fe2e2e" : "currentColor"} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function AnalyticsIcon({ size = 18, active = false }: { size?: number; active?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <rect x="2" y="10" width="3" height="6" rx="1" stroke={active ? "#fe2e2e" : "currentColor"} strokeWidth="1.3" />
      <rect x="7.5" y="6" width="3" height="10" rx="1" stroke={active ? "#fe2e2e" : "currentColor"} strokeWidth="1.3" />
      <rect x="13" y="2" width="3" height="14" rx="1" stroke={active ? "#fe2e2e" : "currentColor"} strokeWidth="1.3" />
    </svg>
  );
}
