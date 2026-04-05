"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard,
  GitBranch,
  Package,
  Truck,
  ShieldAlert,
  FileBarChart,
  ScrollText,
  Settings,
  HelpCircle,
} from "lucide-react";

const navItems = [
  { href: "/operations", label: "Dashboard", icon: LayoutDashboard },
  { href: "#", label: "Refinery Flow", icon: GitBranch },
  { href: "#", label: "Inventory", icon: Package },
  { href: "#", label: "Logistics", icon: Truck },
  { href: "#", label: "Risk Assessment", icon: ShieldAlert },
  { href: "/analytics", label: "Reports", icon: FileBarChart },
  { href: "#", label: "Logs", icon: ScrollText },
];

const bottomItems = [
  { href: "#", label: "Settings", icon: Settings },
  { href: "#", label: "Support", icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-52 bg-white border-r border-[#E5E7EB] flex flex-col h-full shrink-0">
      <nav className="flex-1 py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={clsx(
                "flex items-center gap-2.5 px-3 py-2 rounded text-sm font-body transition-colors",
                isActive
                  ? "bg-[#F0FDFA] text-[#0D9488] border-l-2 border-[#0D9488] font-medium"
                  : "text-[#4B5563] hover:bg-[#F9FAFB] hover:text-[#111827]"
              )}
            >
              <Icon size={16} strokeWidth={isActive ? 2 : 1.5} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-[#E5E7EB] py-3 px-2 space-y-0.5">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded text-sm font-body text-[#4B5563] hover:bg-[#F9FAFB] hover:text-[#111827] transition-colors"
            >
              <Icon size={16} strokeWidth={1.5} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
      <div className="border-t border-[#E5E7EB] p-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#0D9488] flex items-center justify-center text-white text-xs font-semibold">
            JM
          </div>
          <div className="text-xs">
            <div className="font-medium text-[#111827]">Refinery Ops</div>
            <div className="text-[#9CA3AF]">INST ID · CONSTELLATION</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
