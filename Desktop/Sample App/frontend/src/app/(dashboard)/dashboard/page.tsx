import Link from "next/link";
import { modules } from "@/lib/modules";
import { moduleDefinitions } from "@/lib/moduleDefinitions";

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <header>
        <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
          Operations overview
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--brand-deep)] sm:text-3xl">
          My ERP Dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
          Open any module to run standard ERP operations: products, purchase
          orders, stock moves, invoices, forecasts, and service tickets.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {modules.map((moduleItem) => {
          const definition = moduleDefinitions[moduleItem.key];
          return (
            <Link
              key={moduleItem.key}
              href={`/modules/${moduleItem.key}`}
              className="border border-[var(--line)] bg-white p-4 transition hover:border-[var(--accent)]"
            >
              <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--brand-deep)]">
                {moduleItem.label}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {definition?.summary ?? "Module workspace ready."}
              </p>
              <p className="mt-3 text-xs font-medium text-[var(--accent)]">
                {definition?.operations.length ?? 0} operations available
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
