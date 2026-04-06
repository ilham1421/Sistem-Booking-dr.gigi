import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  Users,
  AlertCircle,
} from "lucide-react";
import { formatDateShort, statusLabels, statusColors } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [
    todayReservations,
    waitingCount,
    completedToday,
    newPatientsCount,
    recentReservations,
  ] = await Promise.all([
    prisma.reservation.count({
      where: { date: { gte: today, lt: tomorrow } },
    }),
    prisma.reservation.count({
      where: { status: "WAITING" },
    }),
    prisma.reservation.count({
      where: {
        status: "COMPLETED",
        date: { gte: today, lt: tomorrow },
      },
    }),
    prisma.patient.count({
      where: { patientType: "NEW", createdAt: { gte: today } },
    }),
    prisma.reservation.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        patient: { select: { name: true, phone: true } },
        service: { select: { name: true } },
      },
    }),
  ]);

  return {
    todayReservations,
    waitingCount,
    completedToday,
    newPatientsCount,
    recentReservations,
  };
}

export default async function AdminDashboard() {
  const data = await getDashboardData();

  const stats = [
    {
      label: "Reservasi Hari Ini",
      value: data.todayReservations,
      icon: CalendarCheck,
      color: "text-primary bg-lavender",
    },
    {
      label: "Menunggu Konfirmasi",
      value: data.waitingCount,
      icon: Clock,
      color: "text-yellow-600 bg-yellow-50",
    },
    {
      label: "Selesai Hari Ini",
      value: data.completedToday,
      icon: CheckCircle2,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Pasien Baru",
      value: data.newPatientsCount,
      icon: Users,
      color: "text-blue-600 bg-blue-50",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-dark">Dashboard</h1>
        <p className="text-text-secondary text-sm">Ringkasan aktivitas praktik hari ini</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">{stat.label}</p>
                  <p className="text-3xl font-bold text-text-dark mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Reservations */}
      <Card>
        <div className="px-6 py-4 border-b border-border-soft flex items-center justify-between">
          <h2 className="font-semibold text-text-dark">Reservasi Terbaru</h2>
          <Link
            href="/admin/reservasi"
            className="text-sm text-primary hover:text-primary-dark"
          >
            Lihat Semua →
          </Link>
        </div>
        <div className="overflow-x-auto">
          {data.recentReservations.length === 0 ? (
            <div className="p-8 text-center">
              <AlertCircle size={40} className="text-text-secondary/30 mx-auto mb-3" />
              <p className="text-text-secondary">Belum ada reservasi</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-soft bg-bg-light">
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Pasien</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Layanan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Jam</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.recentReservations.map((r) => (
                  <tr key={r.id} className="border-b border-border-soft last:border-0 hover:bg-bg-light/50">
                    <td className="px-6 py-3">
                      <div>
                        <p className="font-medium text-text-dark text-sm">{r.patient.name}</p>
                        <p className="text-xs text-text-secondary">{r.patient.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-sm text-text-secondary">{r.service.name}</td>
                    <td className="px-6 py-3 text-sm text-text-secondary">{formatDateShort(r.date)}</td>
                    <td className="px-6 py-3 text-sm text-text-secondary">{r.time}</td>
                    <td className="px-6 py-3">
                      <Badge className={statusColors[r.status]}>
                        {statusLabels[r.status]}
                      </Badge>
                    </td>
                    <td className="px-6 py-3">
                      <Link
                        href={`/admin/reservasi/${r.id}`}
                        className="text-sm text-primary hover:text-primary-dark"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
