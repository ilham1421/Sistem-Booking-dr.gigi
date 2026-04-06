"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Stethoscope,
  Clock,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/reservasi", icon: CalendarCheck, label: "Reservasi" },
  { href: "/admin/pasien", icon: Users, label: "Data Pasien" },
  { href: "/admin/layanan", icon: Stethoscope, label: "Layanan" },
  { href: "/admin/jadwal", icon: Clock, label: "Jadwal Praktik" },
  { href: "/admin/laporan", icon: FileText, label: "Laporan" },
  { href: "/admin/pengaturan", icon: Settings, label: "Pengaturan" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-primary-dark text-white flex items-center justify-between px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Image src="/logo.jpeg" alt="Benteng Dental Care" width={28} height={28} className="w-7 h-7 rounded object-cover" />
          <span className="font-semibold text-sm">Admin Panel</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-primary-dark text-white transform transition-transform lg:translate-x-0 lg:static lg:inset-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="hidden lg:flex items-center gap-3 px-6 py-5 border-b border-white/10">
            <Image src="/logo.jpeg" alt="Benteng Dental Care" width={36} height={36} className="w-9 h-9 rounded-lg object-cover" />
            <div>
              <p className="font-semibold text-sm">Benteng Dental Care</p>
              <p className="text-xs text-white/60">Admin Panel</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  isActive(link.href)
                    ? "bg-white/15 text-white font-medium"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <link.icon size={18} />
                <span>{link.label}</span>
                {isActive(link.href) && (
                  <ChevronRight size={14} className="ml-auto" />
                )}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-3 py-4 border-t border-white/10">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 text-sm text-white/60 hover:text-white rounded-lg hover:bg-white/10 mb-1"
            >
              <ChevronRight size={18} />
              Lihat Website
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white/60 hover:text-white rounded-lg hover:bg-white/10"
            >
              <LogOut size={18} />
              Keluar
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
