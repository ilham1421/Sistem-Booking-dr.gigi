import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate, statusLabels, statusColors } from "@/lib/utils";
import { ArrowLeft, User, Phone, Mail, Calendar } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PatientDetailPage({ params }: Props) {
  const { id } = await params;

  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      reservations: {
        include: { service: true },
        orderBy: { date: "desc" },
      },
    },
  });

  if (!patient) notFound();

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/pasien"
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary mb-2"
        >
          <ArrowLeft size={16} /> Kembali ke Data Pasien
        </Link>
        <h1 className="text-2xl font-bold text-text-dark">Detail Pasien</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <User size={16} className="text-primary mt-0.5" />
              <div>
                <p className="text-xs text-text-secondary">Nama Lengkap</p>
                <p className="font-medium text-text-dark">{patient.name}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={16} className="text-primary mt-0.5" />
              <div>
                <p className="text-xs text-text-secondary">WhatsApp</p>
                <p className="font-medium text-text-dark">{patient.phone}</p>
              </div>
            </div>
            {patient.email && (
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-text-secondary">Email</p>
                  <p className="font-medium text-text-dark">{patient.email}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <User size={16} className="text-primary mt-0.5" />
              <div>
                <p className="text-xs text-text-secondary">Jenis Pasien</p>
                <Badge className={patient.patientType === "NEW" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}>
                  {patient.patientType === "NEW" ? "Pasien Baru" : "Pasien Lama"}
                </Badge>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar size={16} className="text-primary mt-0.5" />
              <div>
                <p className="text-xs text-text-secondary">Terdaftar Sejak</p>
                <p className="font-medium text-text-dark">{formatDate(patient.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <div className="px-6 py-4 border-b border-border-soft flex items-center justify-between">
            <h2 className="font-semibold text-text-dark">Statistik</h2>
          </div>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-lavender rounded-lg">
                <p className="text-2xl font-bold text-primary">{patient.reservations.length}</p>
                <p className="text-xs text-text-secondary">Total Reservasi</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {patient.reservations.filter((r) => r.status === "COMPLETED").length}
                </p>
                <p className="text-xs text-text-secondary">Selesai</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">
                  {patient.reservations.filter((r) => r.status === "CANCELLED").length}
                </p>
                <p className="text-xs text-text-secondary">Dibatalkan</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">
                  {patient.reservations.filter((r) => r.status === "NO_SHOW").length}
                </p>
                <p className="text-xs text-text-secondary">No Show</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="px-6 py-4 border-b border-border-soft">
          <h2 className="font-semibold text-text-dark">Riwayat Reservasi</h2>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-soft bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Tanggal</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Jam</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Layanan</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Status</th>
                  <th className="text-center px-4 py-3 font-medium text-text-secondary">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {patient.reservations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-text-secondary">
                      Belum ada riwayat reservasi
                    </td>
                  </tr>
                ) : (
                  patient.reservations.map((r) => (
                    <tr key={r.id} className="border-b border-border-soft hover:bg-gray-50">
                      <td className="px-4 py-3 text-text-dark">{formatDate(r.date)}</td>
                      <td className="px-4 py-3 text-text-dark">{r.time}</td>
                      <td className="px-4 py-3 text-text-dark">{r.service.name}</td>
                      <td className="px-4 py-3">
                        <Badge className={statusColors[r.status]}>
                          {statusLabels[r.status]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Link
                          href={`/admin/reservasi/${r.id}`}
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
      </Card>
    </div>
  );
}
