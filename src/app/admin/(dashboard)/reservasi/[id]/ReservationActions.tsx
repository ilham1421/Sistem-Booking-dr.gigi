"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import { CheckCircle, XCircle, RefreshCw, Clock, AlertTriangle } from "lucide-react";

interface Reservation {
  id: string;
  status: string;
  date: Date;
  time: string;
  adminNotes: string | null;
}

interface Props {
  reservation: Reservation;
}

const statusTransitions: Record<string, { label: string; value: string; icon: React.ReactNode; color: string }[]> = {
  WAITING: [
    { label: "Konfirmasi", value: "CONFIRMED", icon: <CheckCircle size={16} />, color: "bg-blue-500 hover:bg-blue-600 text-white" },
    { label: "Batalkan", value: "CANCELLED", icon: <XCircle size={16} />, color: "bg-red-500 hover:bg-red-600 text-white" },
  ],
  CONFIRMED: [
    { label: "Selesai", value: "COMPLETED", icon: <CheckCircle size={16} />, color: "bg-green-500 hover:bg-green-600 text-white" },
    { label: "Reschedule", value: "RESCHEDULED", icon: <RefreshCw size={16} />, color: "bg-yellow-500 hover:bg-yellow-600 text-white" },
    { label: "No Show", value: "NO_SHOW", icon: <AlertTriangle size={16} />, color: "bg-gray-500 hover:bg-gray-600 text-white" },
    { label: "Batalkan", value: "CANCELLED", icon: <XCircle size={16} />, color: "bg-red-500 hover:bg-red-600 text-white" },
  ],
  RESCHEDULED: [
    { label: "Konfirmasi", value: "CONFIRMED", icon: <CheckCircle size={16} />, color: "bg-blue-500 hover:bg-blue-600 text-white" },
    { label: "Batalkan", value: "CANCELLED", icon: <XCircle size={16} />, color: "bg-red-500 hover:bg-red-600 text-white" },
  ],
};

export function ReservationActions({ reservation }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState(reservation.adminNotes || "");
  const [showReschedule, setShowReschedule] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [error, setError] = useState("");

  const transitions = statusTransitions[reservation.status] || [];

  async function handleStatusChange(newStatus: string) {
    if (newStatus === "RESCHEDULED") {
      setShowReschedule(true);
      return;
    }
    await updateReservation(newStatus);
  }

  async function updateReservation(newStatus: string, rescheduleData?: { date: string; time: string }) {
    setLoading(true);
    setError("");
    try {
      const body: Record<string, string> = { status: newStatus, adminNotes };
      if (rescheduleData) {
        body.date = rescheduleData.date;
        body.time = rescheduleData.time;
      }
      const res = await fetch(`/api/reservations/${reservation.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Gagal mengupdate reservasi");
        return;
      }
      router.refresh();
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setLoading(false);
      setShowReschedule(false);
    }
  }

  async function handleSaveNotes() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/reservations/${reservation.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Gagal menyimpan catatan");
        return;
      }
      router.refresh();
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <div className="px-6 py-4 border-b border-border-soft">
        <h2 className="font-semibold text-text-dark">Tindakan</h2>
      </div>
      <CardContent className="p-6 space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>
        )}

        {transitions.length > 0 && (
          <div>
            <p className="text-sm text-text-secondary mb-2">Ubah Status:</p>
            <div className="flex flex-wrap gap-2">
              {transitions.map((t) => (
                <button
                  key={t.value}
                  disabled={loading}
                  onClick={() => handleStatusChange(t.value)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${t.color}`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {showReschedule && (
          <div className="bg-yellow-50 p-4 rounded-lg space-y-3">
            <p className="text-sm font-medium text-yellow-800">Jadwal Ulang</p>
            <Input
              label="Tanggal Baru"
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
            <Input
              label="Jam Baru"
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                disabled={loading || !newDate || !newTime}
                onClick={() => updateReservation("RESCHEDULED", { date: newDate, time: newTime })}
              >
                Simpan
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowReschedule(false)}>
                Batal
              </Button>
            </div>
          </div>
        )}

        <div className="border-t border-border-soft pt-4">
          <Textarea
            label="Catatan Admin/Dokter"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            rows={3}
            placeholder="Tambahkan catatan..."
          />
          <Button
            size="sm"
            variant="outline"
            className="mt-2"
            disabled={loading}
            onClick={handleSaveNotes}
          >
            Simpan Catatan
          </Button>
        </div>

        {!transitions.length && (
          <div className="flex items-center gap-2 text-sm text-text-secondary bg-gray-50 p-3 rounded-lg">
            <Clock size={16} />
            <span>Reservasi ini sudah final dan tidak dapat diubah statusnya.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
