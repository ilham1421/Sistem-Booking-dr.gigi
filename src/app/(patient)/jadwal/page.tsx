import Link from "next/link";
import { CalendarCheck, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { getActiveSchedules } from "@/lib/data";
import { getDayName } from "@/lib/utils";

export const metadata = {
  title: "Jadwal Praktik - Benteng Dental Care",
};

export const revalidate = 60;

export default async function JadwalPage() {
  const dbSchedules = await getActiveSchedules();

  const schedules = dbSchedules.map((s) => ({
    day: getDayName(s.dayOfWeek),
    dayNum: s.dayOfWeek,
    start: s.startTime,
    end: s.endTime,
    break: s.breakStart && s.breakEnd ? `${s.breakStart} - ${s.breakEnd}` : "-",
    open: true,
  }));

  // Add Sunday if not in DB
  if (!schedules.some((s) => s.dayNum === 0)) {
    schedules.push({ day: "Minggu", dayNum: 0, start: "-", end: "-", break: "-", open: false });
  }

  return (
    <>
      <section className="bg-linear-to-b from-lavender to-white py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-text-dark mb-3">Jadwal Praktik</h1>
          <p className="text-text-secondary max-w-xl mx-auto">
            Informasi jadwal praktik dokter gigi untuk memudahkan kunjungan Anda
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-0">
              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-soft bg-bg-light">
                      <th className="px-6 py-3 text-left text-sm font-medium text-text-dark">Hari</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-text-dark">Jam Mulai</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-text-dark">Jam Selesai</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-text-dark">Istirahat</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-text-dark">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedules.map((s) => (
                      <tr key={s.day} className="border-b border-border-soft last:border-0">
                        <td className="px-6 py-4 font-medium text-text-dark">{s.day}</td>
                        <td className="px-6 py-4 text-text-secondary">{s.start}</td>
                        <td className="px-6 py-4 text-text-secondary">{s.end}</td>
                        <td className="px-6 py-4 text-text-secondary">{s.break}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              s.open
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {s.open ? "Buka" : "Tutup"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="sm:hidden divide-y divide-border-soft">
                {schedules.map((s) => (
                  <div key={s.day} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-text-dark">{s.day}</span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          s.open
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {s.open ? "Buka" : "Tutup"}
                      </span>
                    </div>
                    {s.open && (
                      <div className="text-sm text-text-secondary space-y-1">
                        <p>Jam: {s.start} - {s.end}</p>
                        {s.break !== "-" && <p>Istirahat: {s.break}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <div className="mt-8 space-y-4">
            <Card className="border-primary/20 bg-lavender/50">
              <CardContent className="p-4 flex items-start gap-3">
                <Info size={20} className="text-primary mt-0.5 shrink-0" />
                <div className="text-sm text-text-secondary">
                  <p className="font-medium text-text-dark mb-1">Catatan Penting</p>
                  <ul className="space-y-1">
                    <li>• Jadwal dapat berubah sewaktu-waktu pada hari libur nasional</li>
                    <li>• Disarankan untuk melakukan reservasi terlebih dahulu</li>
                    <li>• Pasien diharapkan datang 10 menit sebelum jadwal reservasi</li>
                    <li>• Untuk kondisi darurat, silakan hubungi langsung via WhatsApp</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Link href="/reservasi">
                <Button size="lg" className="gap-2">
                  <CalendarCheck size={20} />
                  Reservasi Sekarang
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
