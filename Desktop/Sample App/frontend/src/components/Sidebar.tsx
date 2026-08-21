"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { modules } from "@/lib/modules";
import { auth } from "@/lib/auth";

function initials(label: string) {
  return label
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}

export default function Sidebar({
  collapsed,
  mobileOpen,
  onToggle,
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const showLabels = !collapsed || mobileOpen;

  const linkClass = (active: boolean) =>
    `flex items-center gap-3 rounded px-3 py-2 text-sm transition ${
      active
        ? "bg-white text-[var(--brand-deep)]"
        : "text-white/85 hover:bg-white/10"
    } ${showLabels ? "" : "justify-center px-2"}`;

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close module menu"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onNavigate}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-white/10 bg-[var(--brand-deep)] text-white transition-all duration-300 lg:static ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${collapsed ? "w-64 lg:w-[4.5rem]" : "w-64"}`}
      >
        <div className={`flex items-center border-b border-white/10 p-3 ${showLabels ? "justify-between" : "justify-center"}`}>
          {showLabels ? (
            <Link
              href="/"
              onClick={onNavigate}
              className="font-[family-name:var(--font-display)] text-lg font-semibold"
            >
              My ERP
            </Link>
          )}
          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? "Expand module menu" : "Shrink module menu"}
            className="flex h-9 w-9 items-center justify-center border border-white/30 text-lg hover:bg-white/10"
            title={collapsed ? "Expand menu" : "Shrink menu"}
          >
            {collapsed ? "»" : "«"}
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          <Link
            href="/dashboard"
            onClick={onNavigate}
            title="Dashboard"
            className={linkClass(pathname === "/dashboard")}
          >
            <span className="w-7 shrink-0 text-center text-xs font-semibold">DB</span>
            {showLabels ? <span>Dashboard</span> : null}
          </Link>
          {modules.map((moduleItem) => {
            const href = `/modules/${moduleItem.key}`;
            const active = pathname === href;
            return (
              <Link
                key={moduleItem.key}
                href={href}
                onClick={onNavigate}
                title={moduleItem.label}
                className={linkClass(active)}
              >
                <span className="w-7 shrink-0 text-center text-xs font-semibold">
                  {initials(moduleItem.label)}
                </span>
                {showLabels ? <span>{moduleItem.label}</span> : null}
              </Link>
            );
          })}
        </nav>

        <div className="p-3">
          <button
            type="button"
            onClick={() => {
              auth.clearToken();
              router.push("/login");
            }}
            className={`w-full border border-white/30 px-3 py-2 text-sm text-white/90 hover:bg-white/10 ${
              showLabels ? "text-left" : "px-1 text-xs"
            }`}
          >
            {showLabels ? "Sign out" : "Out"}
          </button>
        </div>
      </aside>
    </>
  );
}
