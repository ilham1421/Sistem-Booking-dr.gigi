import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

interface Props {
  settings: Record<string, string>;
}

export function Footer({ settings }: Props) {
  const address = settings.clinic_address || "Desa Benteng, Kec. Mandalle, Kab. Pangkep";
  const phone = settings.clinic_phone || "+6285342236688";
  const email = settings.clinic_email || "bentengdentalcare@gmail.com";
  const openingHours = settings.opening_hours || "Senin - Jumat: 09:00 - 17:00, Sabtu: 09:00 - 14:00";

  return (
    <footer className="bg-text-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src="/logo.jpeg" alt="Benteng Dental Care" width={32} height={32} className="w-8 h-8 rounded-lg object-cover" />
              <span className="font-semibold text-lg">Benteng Dental Care</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Pelayanan kesehatan gigi yang bersih, nyaman, dan profesional untuk seluruh keluarga Anda.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Menu</h3>
            <ul className="space-y-2">
              {[
                { href: "/tentang", label: "Tentang Dokter" },
                { href: "/layanan", label: "Layanan" },
                { href: "/jadwal", label: "Jadwal Praktik" },
                { href: "/reservasi", label: "Reservasi Online" },
                { href: "/faq", label: "FAQ" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Kontak</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                {address}
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone size={16} className="shrink-0" />
                {phone}
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail size={16} className="shrink-0" />
                {email}
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-semibold mb-4">Jam Praktik</h3>
            <p className="text-sm text-gray-400 whitespace-pre-line">{openingHours.replace(/,\s*/g, '\n')}</p>
            <p className="text-sm text-gray-500 mt-2">Minggu & Hari Libur: Tutup</p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Benteng Dental Care. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/admin/login" className="text-xs text-gray-600 hover:text-gray-400">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
