"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { auth } from "@/lib/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const token = auth.getToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    setAllowed(true);
    setCollapsed(localStorage.getItem("erp_sidebar_collapsed") === "1");
  }, [router]);

  const toggleMenu = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setMobileOpen((open) => !open);
      return;
    }
    setCollapsed((current) => {
      const next = !current;
      localStorage.setItem("erp_sidebar_collapsed", next ? "1" : "0");
      return next;
    });
  };

  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 text-center text-[var(--muted)]">
        Redirecting to sign in...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggle={toggleMenu}
        onNavigate={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-[var(--line)] bg-white px-3 py-3 lg:hidden">
          <button
            type="button"
            onClick={toggleMenu}
            aria-label="Open module menu"
            className="flex h-10 w-10 items-center justify-center border border-[var(--line)] text-[var(--brand-deep)]"
          >
            ☰
          </button>
          <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--brand-deep)]">
            My ERP
          </p>
        </header>
        <main className="flex-1 overflow-auto p-3 sm:p-5 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
