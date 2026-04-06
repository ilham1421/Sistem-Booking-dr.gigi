import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import {
  CalendarCheck,
  Users,
  TrendingUp,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LaporanPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const [
    totalReservations,
    monthlyReservations,
    completedCount,
    cancelledCount,
    noShowCount,
    waitingCount,
    newPatients,
    existingPatients,
    topServices,
    monthlyStats,
  ] = await Promise.all([
    prisma.reservation.count(),
    prisma.reservation.count({
      where: { date: { gte: startOfMonth, lte: endOfMonth } },
    }),
    prisma.reservation.count({ where: { status: "COMPLETED" } }),
    prisma.reservation.count({ where: { status: "CANCELLED" } }),
    prisma.reservation.count({ where: { status: "NO_SHOW" } }),
    prisma.reservation.count({ where: { status: "WAITING" } }),
    prisma.patient.count({ where: { patientType: "NEW" } }),
    prisma.patient.count({ where: { patientType: "EXISTING" } }),
    prisma.reservation.groupBy({
      by: ["serviceId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    }),
    // Last 6 months
    prisma.reservation.groupBy({
      by: ["status"],
      where: { date: { gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) } },
      _count: { id: true },
    }),
  ]);

  const serviceIds = topServices.map((s) => s.serviceId);
  const services = await prisma.service.findMany({
    where: { id: { in: serviceIds } },
  });
  const serviceMap = new Map(services.map((s) => [s.id, s]));

  const totalPatients = newPatients + existingPatients;
  const completionRate = totalReservations > 0 ? Math.round((completedCount / totalReservations) * 100) : 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-dark mb-6">Laporan & Statistik</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-lavender flex items-center justify-center">
                <CalendarCheck size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-dark">{totalReservations}</p>
                <p className="text-xs text-text-secondary">Total Reservasi</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <TrendingUp size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-dark">{monthlyReservations}</p>
                <p className="text-xs text-text-secondary">Bulan Ini</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <Users size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-dark">{totalPatients}</p>
                <p className="text-xs text-text-secondary">Total Pasien</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
                <BarChart3 size={20} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-dark">{completionRate}%</p>
                <p className="text-xs text-text-secondary">Tingkat Penyelesaian</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <Card>
          <div className="px-6 py-4 border-b border-border-soft">
            <h2 className="font-semibold text-text-dark">Distribusi Status Reservasi</h2>
          </div>
          <CardContent className="p-6">
            <div className="space-y-4">
              <StatusBar label="Selesai" count={completedCount} total={totalReservations} color="bg-green-500" icon={<CheckCircle size={16} className="text-green-500" />} />
              <StatusBar label="Menunggu" count={waitingCount} total={totalReservations} color="bg-yellow-500" icon={<Clock size={16} className="text-yellow-500" />} />
              <StatusBar label="Dibatalkan" count={cancelledCount} total={totalReservations} color="bg-red-500" icon={<XCircle size={16} className="text-red-500" />} />
              <StatusBar label="No Show" count={noShowCount} total={totalReservations} color="bg-gray-400" icon={<AlertTriangle size={16} className="text-gray-400" />} />
            </div>
          </CardContent>
        </Card>

        {/* Top Services */}
        <Card>
          <div className="px-6 py-4 border-b border-border-soft">
            <h2 className="font-semibold text-text-dark">Layanan Terpopuler</h2>
          </div>
          <CardContent className="p-6">
            {topServices.length === 0 ? (
              <p className="text-sm text-text-secondary">Belum ada data</p>
            ) : (
              <div className="space-y-3">
                {topServices.map((item, idx) => {
                  const svc = serviceMap.get(item.serviceId);
                  return (
                    <div key={item.serviceId} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-lavender text-primary text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text-dark">{svc?.name || "Unknown"}</p>
                        <p className="text-xs text-text-secondary">{svc ? formatCurrency(svc.price ?? 0) : ""}</p>
                      </div>
                      <span className="text-sm font-semibold text-primary">{item._count.id}x</span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Patient Distribution */}
        <Card>
          <div className="px-6 py-4 border-b border-border-soft">
            <h2 className="font-semibold text-text-dark">Distribusi Pasien</h2>
          </div>
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="flex-1 text-center p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">{newPatients}</p>
                <p className="text-sm text-text-secondary mt-1">Pasien Baru</p>
              </div>
              <div className="flex-1 text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">{existingPatients}</p>
                <p className="text-sm text-text-secondary mt-1">Pasien Lama</p>
              </div>
            </div>
            {totalPatients > 0 && (
              <div className="mt-4 h-3 bg-gray-100 rounded-full overflow-hidden flex">
                <div
                  className="bg-green-500 h-full"
                  style={{ width: `${(newPatients / totalPatients) * 100}%` }}
                />
                <div
                  className="bg-blue-500 h-full"
                  style={{ width: `${(existingPatients / totalPatients) * 100}%` }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatusBar({
  label,
  count,
  total,
  color,
  icon,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
  icon: React.ReactNode;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm text-text-dark">{label}</span>
        </div>
        <span className="text-sm font-medium text-text-dark">{count} ({pct}%)</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
