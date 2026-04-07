import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate, statusLabels, statusColors } from "@/lib/utils";
import { ReservationActions } from "./ReservationActions";
import { ArrowLeft, User, Phone, Mail, Stethoscope, Calendar, Clock, FileText } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ReservationDetailPage({ params }: Props) {
  const { id } = await params;

  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: {
      patient: true,
      service: true,
      logs: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!reservation) notFound();

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/reservasi"
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary mb-2"
        >
          <ArrowLeft size={16} /> Kembali ke Daftar Reservasi
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-text-dark">Detail Reservasi</h1>
            <p className="text-text-secondary text-sm">ID: {reservation.id}</p>
          </div>
          <Badge className={`${statusColors[reservation.status]} text-sm px-3 py-1`}>
            {statusLabels[reservation.status]}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Info */}
        <Card>
          <div className="px-6 py-4 border-b border-border-soft">
            <h2 className="font-semibold text-text-dark">Informasi Pasien</h2>
          </div>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <User size={16} className="text-primary mt-0.5" />
              <div>
                <p className="text-xs text-text-secondary">Nama</p>
                <p className="font-medium text-text-dark">{reservation.patient.name}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={16} className="text-primary mt-0.5" />
              <div>
                <p className="text-xs text-text-secondary">WhatsApp</p>
                <p className="font-medium text-text-dark">{reservation.patient.phone}</p>
              </div>
            </div>
            {reservation.patient.email && (
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-text-secondary">Email</p>
                  <p className="font-medium text-text-dark">{reservation.patient.email}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <User size={16} className="text-primary mt-0.5" />
              <div>
                <p className="text-xs text-text-secondary">Jenis Pasien</p>
                <p className="font-medium text-text-dark">
                  {reservation.patient.patientType === "NEW" ? "Pasien Baru" : "Pasien Lama"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reservation Info */}
        <Card>
          <div className="px-6 py-4 border-b border-border-soft">
            <h2 className="font-semibold text-text-dark">Detail Reservasi</h2>
          </div>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <Stethoscope size={16} className="text-primary mt-0.5" />
              <div>
                <p className="text-xs text-text-secondary">Layanan</p>
                <p className="font-medium text-text-dark">{reservation.service.name}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar size={16} className="text-primary mt-0.5" />
              <div>
                <p className="text-xs text-text-secondary">Tanggal</p>
                <p className="font-medium text-text-dark">{formatDate(reservation.date)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock size={16} className="text-primary mt-0.5" />
              <div>
                <p className="text-xs text-text-secondary">Jam</p>
                <p className="font-medium text-text-dark">{reservation.time}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText size={16} className="text-primary mt-0.5" />
              <div>
                <p className="text-xs text-text-secondary">Keluhan</p>
                <p className="text-sm text-text-dark">{reservation.complaint || "-"}</p>
              </div>
            </div>
            {reservation.notes && (
              <div className="flex items-start gap-3">
                <FileText size={16} className="text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-text-secondary">Catatan Pasien</p>
                  <p className="text-sm text-text-dark">{reservation.notes}</p>
                </div>
              </div>
            )}
            {reservation.adminNotes && (
              <div className="bg-lavender rounded-lg p-3">
                <p className="text-xs text-primary font-medium mb-1">Catatan Admin/Dokter</p>
                <p className="text-sm text-text-dark">{reservation.adminNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <ReservationActions reservation={{
          id: reservation.id,
          status: reservation.status,
          date: reservation.date,
          time: reservation.time,
          adminNotes: reservation.adminNotes,
          patient: {
            name: reservation.patient.name,
            phone: reservation.patient.phone,
          },
          service: {
            name: reservation.service.name,
          },
        }} />
      </div>

      {/* Logs */}
      <Card className="mt-6">
        <div className="px-6 py-4 border-b border-border-soft">
          <h2 className="font-semibold text-text-dark">Riwayat Perubahan</h2>
        </div>
        <CardContent className="p-6">
          {reservation.logs.length === 0 ? (
            <p className="text-sm text-text-secondary">Belum ada riwayat</p>
          ) : (
            <div className="space-y-3">
              {reservation.logs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <div>
                    <p className="text-text-dark">{log.description || log.action}</p>
                    <p className="text-xs text-text-secondary">
                      {new Date(log.createdAt).toLocaleString("id-ID")}
                      {log.performedBy && ` • oleh ${log.performedBy}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
