"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/tentang", label: "Tentang Dokter" },
  { href: "/layanan", label: "Layanan" },
  { href: "/jadwal", label: "Jadwal" },
  { href: "/reservasi", label: "Reservasi" },
  { href: "/faq", label: "FAQ" },
  { href: "/kontak", label: "Kontak" },
];

interface Props {
  whatsapp: string;
}

export function Navbar({ whatsapp }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <nav className="bg-white border-b border-border-soft sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image src="/logo.jpeg" alt="Benteng Dental Care" width={32} height={32} className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-semibold text-text-dark text-base sm:text-lg truncate max-w-45 sm:max-w-none">Benteng Dental Care</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  pathname === link.href
                    ? "text-primary bg-lavender font-medium"
                    : "text-text-secondary hover:text-primary hover:bg-lavender"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary-dark"
            >
              <Phone size={16} />
              WhatsApp
            </a>
            <Link href="/reservasi">
              <Button size="sm">Reservasi Sekarang</Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 -mr-2 text-text-secondary hover:text-primary active:bg-lavender rounded-lg transition-colors"
            aria-label={isOpen ? "Tutup menu" : "Buka menu"}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav - Full screen overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 top-14 sm:top-16 z-50 bg-white mobile-menu-enter overflow-y-auto">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 text-base rounded-xl transition-colors ${
                  pathname === link.href
                    ? "text-primary bg-lavender font-medium"
                    : "text-text-dark hover:text-primary hover:bg-lavender"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 space-y-3 border-t border-border-soft mt-3">
              <Link href="/reservasi" onClick={() => setIsOpen(false)}>
                <Button className="w-full" size="lg">Reservasi Sekarang</Button>
              </Link>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-sm text-green-600 py-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
              >
                <Phone size={18} />
                Hubungi WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
