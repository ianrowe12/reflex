"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("j.martinez@valero.com");
  const [password, setPassword] = useState("password");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/operations");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-base p-4">
      <div className="flex flex-col items-center gap-8 w-full max-w-[400px]">
        <div className="w-full bg-surface-card rounded-lg py-10 px-8 shadow-elevated">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-headline font-bold text-accent">
              Reflex
            </h1>
            <p className="text-sm font-body text-text-secondary mt-1">
              Refinery Optimization Platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-sm font-body font-medium text-text-secondary mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-surface-hover border border-surface-border rounded font-body text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="password"
                className="text-sm font-body font-medium text-text-secondary mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-surface-hover border border-surface-border rounded font-body text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>

            <div className="flex items-center justify-between">
              <label
                htmlFor="remember"
                className="flex items-center gap-2 text-sm font-body text-text-secondary cursor-pointer"
              >
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="w-4 h-4 rounded border-surface-border accent-accent cursor-pointer"
                />
                Remember me
              </label>
              <a
                href="#"
                className="text-sm text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 rounded"
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded bg-accent text-white font-headline font-semibold hover:bg-accent-hover transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              Sign In
            </button>
          </form>
        </div>

        <p className="text-xs font-body text-text-secondary">
          Reflex v2.1.0 &middot; Constellation Energy
        </p>
      </div>
    </div>
  );
}
