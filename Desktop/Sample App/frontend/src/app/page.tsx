import Link from "next/link";

export default function Home() {
  return (
    <main className="hero-atmosphere relative min-h-screen overflow-hidden text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(47,143,134,0.22),transparent_42%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-between px-4 py-6 sm:px-6 md:px-10 md:py-10">
        <header className="animate-fade flex items-center justify-between">
          <p className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight md:text-3xl">
            My ERP
          </p>
          <Link
            href="/login"
            className="border border-white/40 px-4 py-2 text-sm font-medium transition duration-300 hover:bg-white hover:text-[var(--brand-deep)]"
          >
            Sign in
          </Link>
        </header>

        <section className="max-w-3xl pb-16 pt-20 md:pb-24 md:pt-10">
          <h1 className="animate-rise font-[family-name:var(--font-display)] text-3xl leading-tight font-semibold tracking-tight sm:text-4xl md:text-6xl md:leading-[1.05]">
            Run every operation from one command center
          </h1>
          <p className="animate-rise-delay mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
            Inventory, finance, procurement, and retail workflows in a single
            enterprise platform built for daily decisions.
          </p>
          <div className="animate-rise-delay mt-8 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="bg-white px-6 py-3 text-sm font-semibold text-[var(--brand-deep)] transition duration-300 hover:bg-[var(--accent)] hover:text-white"
            >
              Enter workspace
            </Link>
            <Link
              href="/signup"
              className="border border-white/50 px-6 py-3 text-sm font-semibold transition duration-300 hover:bg-white/10"
            >
              Sign up
            </Link>
          </div>
        </section>

        <footer className="animate-fade border-t border-white/20 pt-4 text-xs tracking-wide text-white/70 md:text-sm">
          POS · Procurement · Inventory · Finance · Reports · Service
        </footer>
      </div>
    </main>
  );
}
