"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("sample");
  const [password, setPassword] = useState("sample");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid ID or password.");
      }

      const data = (await response.json()) as { token: string };
      auth.setToken(data.token);
      router.push("/dashboard");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="login-atmosphere relative hidden overflow-hidden text-white lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.12),transparent_35%)]" />
        <div className="relative z-10">
          <Link
            href="/"
            className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight"
          >
            My ERP
          </Link>
        </div>
        <div className="relative z-10 max-w-md animate-rise">
          <h1 className="font-[family-name:var(--font-display)] text-4xl leading-tight font-semibold">
            Secure access to your enterprise workspace
          </h1>
          <p className="mt-4 text-base leading-relaxed text-white/80">
            Sign in to manage operations across inventory, finance, procurement,
            and service modules.
          </p>
        </div>
        <p className="relative z-10 text-sm text-white/65">
          Built for operators, finance teams, and administrators.
        </p>
      </section>

      <section className="flex items-center justify-center bg-[var(--background)] px-6 py-12">
        <form
          onSubmit={handleLogin}
          className="animate-rise w-full max-w-md border border-[var(--line)] bg-[var(--surface)] p-8"
        >
          <p className="mb-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--brand-deep)] lg:hidden">
            My ERP
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--foreground)]">
            Sign in
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Use ID <span className="font-medium text-[var(--foreground)]">sample</span> and password{" "}
            <span className="font-medium text-[var(--foreground)]">sample</span>.
          </p>

          <div className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                ID
              </span>
              <input
                type="text"
                required
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full border border-[var(--line)] bg-white px-3 py-2.5 text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
                placeholder="sample"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                Password
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full border border-[var(--line)] bg-white px-3 py-2.5 text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
                placeholder="••••••••"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-[var(--brand-deep)] disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in to My ERP"}
            </button>

            {error ? (
              <p className="text-sm text-[var(--danger)]">{error}</p>
            ) : null}
          </div>

          <p className="mt-6 text-sm text-[var(--muted)]">
            <Link href="/" className="font-medium text-[var(--brand)] hover:underline">
              Back to landing
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
