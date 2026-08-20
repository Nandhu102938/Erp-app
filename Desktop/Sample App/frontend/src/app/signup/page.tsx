"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 20000);
      const response = await fetch(`${apiUrl}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: name || email }),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (response.status === 409) {
        throw new Error("That ID is already taken. Try signing in.");
      }
      if (!response.ok) {
        throw new Error("Could not create the account.");
      }

      const data = (await response.json()) as { token: string };
      auth.setToken(data.token);
      router.push("/dashboard");
    } catch (signupError) {
      if (signupError instanceof DOMException && signupError.name === "AbortError") {
        setError("Signup timed out. The API is still starting or is not connected to the database.");
      } else if (signupError instanceof TypeError) {
        setError("Cannot reach the API. Add DATABASE_URL on my-erp-api in Render.");
      } else {
        setError(signupError instanceof Error ? signupError.message : "Signup failed.");
      }
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
            Create your workspace access
          </h1>
          <p className="mt-4 text-base leading-relaxed text-white/80">
            Register an ID and password, then continue into the ERP modules.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center bg-[var(--background)] px-6 py-12">
        <form
          onSubmit={handleSignup}
          className="animate-rise w-full max-w-md border border-[var(--line)] bg-[var(--surface)] p-8"
        >
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--foreground)]">
            Sign up
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Choose an ID and password to create an account.
          </p>

          <div className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                Name
              </span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full border border-[var(--line)] bg-white px-3 py-2.5 outline-none transition focus:border-[var(--accent)]"
                placeholder="Your name"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                ID
              </span>
              <input
                type="text"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full border border-[var(--line)] bg-white px-3 py-2.5 outline-none transition focus:border-[var(--accent)]"
                placeholder="your-id"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                Password
              </span>
              <input
                type="password"
                required
                minLength={4}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full border border-[var(--line)] bg-white px-3 py-2.5 outline-none transition focus:border-[var(--accent)]"
                placeholder="••••••••"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-deep)] disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
            {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
          </div>

          <p className="mt-6 text-sm text-[var(--muted)]">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-[var(--brand)] hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
