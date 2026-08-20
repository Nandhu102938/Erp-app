"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { modules } from "@/lib/modules";
import { auth } from "@/lib/auth";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-64 border-r border-[var(--line)] bg-[var(--brand-deep)] p-4 text-white">
      <Link
        href="/"
        className="mb-6 block font-[family-name:var(--font-display)] text-xl font-semibold"
      >
        My ERP
      </Link>
      <nav className="space-y-1">
        <Link
          href="/dashboard"
          className={`block px-3 py-2 text-sm ${
            pathname === "/dashboard"
              ? "bg-white text-[var(--brand-deep)]"
              : "text-white/85 hover:bg-white/10"
          }`}
        >
          Dashboard
        </Link>
        {modules.map((moduleItem) => {
          const href = `/modules/${moduleItem.key}`;
          const active = pathname === href;
          return (
            <Link
              key={moduleItem.key}
              href={href}
              className={`block px-3 py-2 text-sm ${
                active
                  ? "bg-white text-[var(--brand-deep)]"
                  : "text-white/85 hover:bg-white/10"
              }`}
            >
              {moduleItem.label}
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        onClick={() => {
          auth.clearToken();
          router.push("/login");
        }}
        className="mt-6 w-full border border-white/30 px-3 py-2 text-left text-sm text-white/90 hover:bg-white/10"
      >
        Sign out
      </button>
    </aside>
  );
}
