import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDateShort, statusLabels, statusColors } from "@/lib/utils";
import { AlertCircle, Eye } from "lucide-react";
import { ReservationFilters } from "./ReservationFilters";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ status?: string; search?: string; date?: string; page?: string }>;
}

const PAGE_SIZE = 20;

export default async function AdminReservasiPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const where: Record<string, unknown> = {};
  if (params.status) where.status = params.status;
  if (params.date) {
    const d = new Date(params.date);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    where.date = { gte: d, lt: next };
  }
  if (params.search) {
    where.patient = { name: { contains: params.search, mode: "insensitive" } };
  }

  const [reservations, totalCount] = await Promise.all([
    prisma.reservation.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        patient: { select: { name: true, phone: true } },
        service: { select: { name: true } },
      },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.reservation.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-dark">Reservasi</h1>
          <p className="text-text-secondary text-sm">Kelola semua reservasi pasien</p>
        </div>
      </div>

      <ReservationFilters />

      <Card>
        <div className="overflow-x-auto">
          {reservations.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle size={40} className="text-text-secondary/30 mx-auto mb-3" />
              <p className="text-text-secondary">Tidak ada reservasi ditemukan</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-soft bg-bg-light">
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Pasien</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">WhatsApp</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Layanan</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Tanggal</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Jam</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.id} className="border-b border-border-soft last:border-0 hover:bg-bg-light/50">
                    <td className="px-4 py-3 text-xs text-text-secondary font-mono">
                      {r.id.slice(-6)}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-text-dark">
                      {r.patient.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{r.patient.phone}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{r.service.name}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{formatDateShort(r.date)}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{r.time}</td>
                    <td className="px-4 py-3">
                      <Badge className={statusColors[r.status]}>
                        {statusLabels[r.status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/reservasi/${r.id}`}>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <Eye size={14} /> Detail
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-border-soft flex items-center justify-between">
            <p className="text-sm text-text-secondary">
              Menampilkan {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, totalCount)} dari {totalCount}
            </p>
            <div className="flex gap-1">
              {page > 1 && (
                <Link href={`/admin/reservasi?${new URLSearchParams({ ...params, page: String(page - 1) })}`}>
                  <Button variant="outline" size="sm">← Sebelumnya</Button>
                </Link>
              )}
              {page < totalPages && (
                <Link href={`/admin/reservasi?${new URLSearchParams({ ...params, page: String(page + 1) })}`}>
                  <Button variant="outline" size="sm">Selanjutnya →</Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
