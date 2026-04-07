"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import clsx from "clsx";
import { LiveIndicator, ConnectionDot } from "@/components/ui/LiveIndicator";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { connections, SITE } from "@/data/mock-data";

const tabs = [
  { href: "/operations", label: "Global View" },
  { href: "/assets", label: "Assets" },
];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <header className="h-12 bg-surface-card border-b border-surface-border flex items-center px-4 gap-4 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <span className="text-lg font-headline font-bold text-accent">Reflex</span>
        <span className="text-xs text-text-muted font-body">{SITE.name}</span>
      </div>

      {/* Nav tabs */}
      <nav className="flex items-center gap-1 ml-4">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={clsx(
                "px-3 py-1.5 rounded text-xs font-body transition-colors",
                isActive
                  ? "bg-accent-muted text-accent font-medium"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      {/* Search */}
      <div className="flex-1 flex justify-center">
        <div className="relative w-64">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Search systems..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-surface-hover border border-surface-border rounded font-body text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <LiveIndicator />
        <div className="flex items-center gap-2">
          {connections.map((c) => (
            <ConnectionDot key={c.name} label={c.label} status={c.status} />
          ))}
        </div>
        <ThemeToggle />
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-white text-xs font-semibold cursor-pointer hover:bg-accent-hover transition-colors"
          >
            JM
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-9 w-36 bg-surface-card border border-surface-border rounded shadow-card-hover py-1 z-50">
              <Link
                href="/settings"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 text-sm font-body text-text-secondary hover:bg-surface-hover hover:text-text-primary"
              >
                Profile
              </Link>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 text-sm font-body text-text-secondary hover:bg-surface-hover hover:text-text-primary"
              >
                Sign Out
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
