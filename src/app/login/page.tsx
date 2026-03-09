"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const authError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg-primary px-6">
      <div className="reveal w-full max-w-[380px]">
        {/* Logo */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center">
            <div className="h-3 w-3 rounded-full bg-accent shadow-[0_0_40px_rgba(254,46,46,0.3)]" />
          </div>
          <h1 className="text-[24px] font-400 tracking-[-0.01em] text-text-primary">
            SCALE
          </h1>
          <p className="mt-2 text-[14px] text-text-secondary">
            Content Operations CRM
          </p>
        </div>

        {/* Login card */}
        <div className="rounded-[16px] border border-border-subtle bg-bg-surface p-8">
          {(authError || error) && (
            <div className="mb-5 rounded-[10px] bg-[rgba(248,113,113,0.08)] border border-[rgba(248,113,113,0.15)] px-4 py-3 text-[13px] text-error">
              {error || "Error de autenticación. Inténtalo de nuevo."}
            </div>
          )}

          {/* Email + Password form */}
          <form onSubmit={handlePasswordLogin} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              disabled={loading}
              className="w-full rounded-[10px] border border-border-subtle bg-bg-primary px-4 py-3 text-[14px] font-300 text-text-primary placeholder:text-text-muted transition-all duration-300 focus:border-accent focus:shadow-[0_0_0_3px_rgba(254,46,46,0.125)] focus:outline-none disabled:opacity-50"
              style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              disabled={loading}
              className="w-full rounded-[10px] border border-border-subtle bg-bg-primary px-4 py-3 text-[14px] font-300 text-text-primary placeholder:text-text-muted transition-all duration-300 focus:border-accent focus:shadow-[0_0_0_3px_rgba(254,46,46,0.125)] focus:outline-none disabled:opacity-50"
              style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
            />
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full rounded-[10px] bg-accent px-6 py-3 text-[13px] font-500 tracking-[0.04em] text-white transition-all duration-300 hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(254,46,46,0.25)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
              style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border-subtle" />
            <span className="text-[10px] font-500 uppercase tracking-[0.2em] text-text-muted">
              o
            </span>
            <div className="h-px flex-1 bg-border-subtle" />
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-[10px] border border-border-subtle bg-transparent px-6 py-3 text-[13px] font-500 tracking-[0.04em] text-text-secondary transition-all duration-300 hover:border-border-hover hover:bg-[rgba(255,255,255,0.04)] hover:text-text-body disabled:opacity-50"
            style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
          >
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M16.3 9.205c0-.567-.05-1.113-.145-1.636H9v3.097h4.096a3.503 3.503 0 0 1-1.52 2.299v1.912h2.46c1.44-1.326 2.264-3.278 2.264-5.672Z" fill="#4285F4" />
              <path d="M9 16.5c2.055 0 3.78-.681 5.04-1.846l-2.46-1.912c-.682.457-1.554.727-2.58.727-1.984 0-3.663-1.34-4.263-3.14H2.19v1.974A7.498 7.498 0 0 0 9 16.5Z" fill="#34A853" />
              <path d="M4.737 10.329A4.505 4.505 0 0 1 4.502 9c0-.461.085-.91.235-1.329V5.697H2.19A7.498 7.498 0 0 0 1.5 9c0 1.21.29 2.355.69 3.303l2.547-1.974Z" fill="#FBBC05" />
              <path d="M9 4.531c1.118 0 2.122.384 2.912 1.14l2.184-2.184C12.776 2.245 11.052 1.5 9 1.5a7.498 7.498 0 0 0-6.81 4.197l2.547 1.974C5.337 5.87 7.016 4.531 9 4.531Z" fill="#EA4335" />
            </svg>
            Entrar con Google
          </button>
        </div>

        <p className="mt-8 text-center text-[11px] text-text-muted">
          by NUZE
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
