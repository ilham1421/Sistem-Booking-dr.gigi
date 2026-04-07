"use client";

import { useState } from "react";
import { Search, CalendarCheck, Clock, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const statusLabels: Record<string, string> = {
  WAITING: "Menunggu Konfirmasi",
  CONFIRMED: "Dikonfirmasi",
  RESCHEDULED: "Dijadwalkan Ulang",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
  NO_SHOW: "Tidak Hadir",
};

const statusColors: Record<string, string> = {
  WAITING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  RESCHEDULED: "bg-purple-100 text-purple-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  NO_SHOW: "bg-gray-100 text-gray-800",
};

interface Reservation {
  id: string;
  service: string;
  date: string;
  time: string;
  status: string;
  createdAt: string;
}

export default function CekReservasiPage() {
  const [phone, setPhone] = useState("");
  const [reservations, setReservations] = useState<Reservation[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) {
      setError("Masukkan nomor WhatsApp Anda");
      return;
    }

    setLoading(true);
    setError("");
    setReservations(null);

    try {
      const res = await fetch(`/api/reservations/check?phone=${encodeURIComponent(phone.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Terjadi kesalahan");
        return;
      }
      setReservations(data.reservations);
    } catch {
      setError("Terjadi kesalahan koneksi");
    } finally {
      setLoading(false);
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <>
      <section className="bg-linear-to-b from-lavender to-white py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search size={24} className="text-primary" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-text-dark mb-3">Cek Status Reservasi</h1>
          <p className="text-text-secondary max-w-xl mx-auto text-sm sm:text-base px-2">
            Masukkan nomor WhatsApp yang Anda gunakan saat reservasi untuk melihat status terkini
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSearch} className="space-y-4">
                <Input
                  id="phone"
                  label="Nomor WhatsApp"
                  placeholder="08xx-xxxx-xxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  error={error}
                />
                <Button type="submit" disabled={loading} className="w-full gap-2">
                  <Search size={16} />
                  {loading ? "Mencari..." : "Cek Status"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {reservations !== null && (
            <div className="mt-6 space-y-4">
              {reservations.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Phone size={40} className="text-text-secondary/30 mx-auto mb-3" />
                    <p className="text-text-secondary font-medium">Tidak ada reservasi ditemukan</p>
                    <p className="text-text-secondary text-sm mt-1">
                      Pastikan nomor WhatsApp yang Anda masukkan benar
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <p className="text-sm text-text-secondary">
                    Ditemukan {reservations.length} reservasi
                  </p>
                  {reservations.map((r) => (
                    <Card key={r.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                          <h3 className="font-semibold text-text-dark">{r.service}</h3>
                          <Badge className={statusColors[r.status]}>
                            {statusLabels[r.status]}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-text-secondary">
                          <span className="flex items-center gap-1.5">
                            <CalendarCheck size={14} className="text-primary" />
                            {formatDate(r.date)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock size={14} className="text-primary" />
                            {r.time}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
