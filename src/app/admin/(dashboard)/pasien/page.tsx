import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Users, Search } from "lucide-react";
import Link from "next/link";
import { PatientSearch } from "./PatientSearch";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ search?: string; type?: string; page?: string }>;
}

const PAGE_SIZE = 20;

export default async function PasienPage({ searchParams }: Props) {
  const params = await searchParams;
  const search = params.search || "";
  const type = params.type || "";
  const page = Math.max(1, Number(params.page) || 1);

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { phone: { contains: search } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }
  if (type === "NEW" || type === "EXISTING") {
    where.patientType = type;
  }

  const [patients, totalCount] = await Promise.all([
    prisma.patient.findMany({
      where,
      include: {
        _count: { select: { reservations: true } },
        reservations: { orderBy: { date: "desc" }, take: 1, select: { date: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.patient.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-dark">Data Pasien</h1>
          <p className="text-text-secondary text-sm">{totalCount} pasien ditemukan</p>
        </div>
      </div>

      <PatientSearch />

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-soft bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Nama</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">WhatsApp</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary hidden md:table-cell">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Jenis</th>
                  <th className="text-center px-4 py-3 font-medium text-text-secondary">Kunjungan</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary hidden lg:table-cell">Terakhir</th>
                  <th className="text-center px-4 py-3 font-medium text-text-secondary">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {patients.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-text-secondary">
                      <Users size={40} className="mx-auto mb-2 opacity-50" />
                      <p>Belum ada data pasien</p>
                    </td>
                  </tr>
                ) : (
                  patients.map((patient) => (
                    <tr key={patient.id} className="border-b border-border-soft hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-text-dark">{patient.name}</td>
                      <td className="px-4 py-3 text-text-dark">{patient.phone}</td>
                      <td className="px-4 py-3 text-text-dark hidden md:table-cell">{patient.email || "-"}</td>
                      <td className="px-4 py-3">
                        <Badge className={patient.patientType === "NEW" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}>
                          {patient.patientType === "NEW" ? "Baru" : "Lama"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center text-text-dark">{patient._count.reservations}</td>
                      <td className="px-4 py-3 text-text-secondary hidden lg:table-cell">
                        {patient.reservations[0]
                          ? new Date(patient.reservations[0].date).toLocaleDateString("id-ID")
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Link
                          href={`/admin/pasien/${patient.id}`}
                          className="text-primary hover:text-deep-purple font-medium text-sm"
                        >
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-border-soft flex items-center justify-between">
            <p className="text-sm text-text-secondary">
              Menampilkan {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, totalCount)} dari {totalCount}
            </p>
            <div className="flex gap-1">
              {page > 1 && (
                <Link href={`/admin/pasien?${new URLSearchParams({ ...params, page: String(page - 1) })}`}>
                  <Button variant="outline" size="sm">← Sebelumnya</Button>
                </Link>
              )}
              {page < totalPages && (
                <Link href={`/admin/pasien?${new URLSearchParams({ ...params, page: String(page + 1) })}`}>
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
