import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getDayName } from "@/lib/utils";
import { ScheduleForm } from "./ScheduleForm";
import { BlockedDateForm } from "./BlockedDateForm";

export const dynamic = "force-dynamic";

export default async function JadwalAdminPage() {
  const schedules = await prisma.schedule.findMany({
    orderBy: { dayOfWeek: "asc" },
  });

  const blockedDates = await prisma.blockedDate.findMany({
    orderBy: { date: "asc" },
    where: { date: { gte: new Date() } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-dark mb-6">Kelola Jadwal Praktik</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Schedule Table */}
        <Card>
          <div className="px-6 py-4 border-b border-border-soft flex items-center justify-between">
            <h2 className="font-semibold text-text-dark">Jadwal Mingguan</h2>
            <ScheduleForm />
          </div>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-soft bg-gray-50">
                    <th className="text-left px-4 py-3 font-medium text-text-secondary">Hari</th>
                    <th className="text-left px-4 py-3 font-medium text-text-secondary">Jam</th>
                    <th className="text-left px-4 py-3 font-medium text-text-secondary">Istirahat</th>
                    <th className="text-center px-4 py-3 font-medium text-text-secondary">Kuota</th>
                    <th className="text-center px-4 py-3 font-medium text-text-secondary">Status</th>
                    <th className="text-center px-4 py-3 font-medium text-text-secondary">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-text-secondary">
                        Belum ada jadwal. Tambahkan jadwal baru.
                      </td>
                    </tr>
                  ) : (
                    schedules.map((s) => (
                      <tr key={s.id} className="border-b border-border-soft hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-text-dark">{getDayName(s.dayOfWeek)}</td>
                        <td className="px-4 py-3 text-text-dark">{s.startTime} - {s.endTime}</td>
                        <td className="px-4 py-3 text-text-dark">
                          {s.breakStart && s.breakEnd ? `${s.breakStart} - ${s.breakEnd}` : "-"}
                        </td>
                        <td className="px-4 py-3 text-center text-text-dark">{s.quota}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge className={s.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}>
                            {s.isActive ? "Buka" : "Tutup"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <ScheduleForm schedule={s} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Blocked Dates */}
        <Card>
          <div className="px-6 py-4 border-b border-border-soft flex items-center justify-between">
            <h2 className="font-semibold text-text-dark">Tanggal Libur</h2>
            <BlockedDateForm />
          </div>
          <CardContent className="p-0">
            {blockedDates.length === 0 ? (
              <div className="p-6 text-center text-text-secondary text-sm">
                Tidak ada tanggal libur mendatang
              </div>
            ) : (
              <div className="divide-y divide-border-soft">
                {blockedDates.map((bd) => (
                  <div key={bd.id} className="px-6 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-text-dark">
                        {new Date(bd.date).toLocaleDateString("id-ID", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      {bd.reason && <p className="text-xs text-text-secondary">{bd.reason}</p>}
                    </div>
                    <BlockedDateForm blockedDate={bd} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
