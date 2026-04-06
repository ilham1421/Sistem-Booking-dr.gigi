"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";

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

  return (
    <nav className="bg-white border-b border-border-soft sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.jpeg" alt="Benteng Dental Care" width={32} height={32} className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-semibold text-text-dark text-lg">Benteng Dental Care</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm text-text-secondary hover:text-primary transition-colors rounded-lg hover:bg-lavender"
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
            className="lg:hidden p-2 text-text-secondary hover:text-primary"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="lg:hidden border-t border-border-soft bg-white">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-sm text-text-secondary hover:text-primary hover:bg-lavender rounded-lg"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 space-y-2 border-t border-border-soft mt-2">
              <Link href="/reservasi" onClick={() => setIsOpen(false)}>
                <Button className="w-full" size="sm">Reservasi Sekarang</Button>
              </Link>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 text-sm text-primary py-2"
              >
                <Phone size={16} />
                Hubungi WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
