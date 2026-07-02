"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "../../lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const err = await login(email, password);
    setLoading(false);
    if (err) setError(err);
    else router.push("/");
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-card">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-sbi-blue to-sbi-cyan text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <h1 className="mt-3 text-xl font-bold text-[var(--text-primary)]">Welcome back</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Sign in to SBI AcquireX</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-[var(--text-primary)]">
            Email
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm focus:border-sbi-blue focus:outline-none focus:ring-1 focus:ring-sbi-blue" />
          </label>
          <label className="block text-sm font-medium text-[var(--text-primary)]">
            Password
            <div className="relative mt-1">
              <input type={show ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 pr-9 text-sm focus:border-sbi-blue focus:outline-none focus:ring-1 focus:ring-sbi-blue" />
              <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          {error && <p className="rounded-lg bg-red-50 p-2.5 text-sm text-red-600 dark:bg-red-500/20">{error}</p>}

          <button type="submit" disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-sbi-blue to-sbi-cyan py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md disabled:opacity-50">
            {loading ? "Signing in..." : <> <LogIn className="h-4 w-4" /> Sign in </>}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-[var(--text-secondary)]">
          No account? <Link href="/signup" className="font-semibold text-sbi-blue hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}
