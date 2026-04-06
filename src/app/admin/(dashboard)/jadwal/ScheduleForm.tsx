"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Plus, Pencil, X } from "lucide-react";

interface Schedule {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  breakStart: string | null;
  breakEnd: string | null;
  quota: number;
  isActive: boolean;
}

interface Props {
  schedule?: Schedule;
}

const dayOptions = [
  { value: "0", label: "Minggu" },
  { value: "1", label: "Senin" },
  { value: "2", label: "Selasa" },
  { value: "3", label: "Rabu" },
  { value: "4", label: "Kamis" },
  { value: "5", label: "Jumat" },
  { value: "6", label: "Sabtu" },
];

export function ScheduleForm({ schedule }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [dayOfWeek, setDayOfWeek] = useState(schedule?.dayOfWeek?.toString() || "1");
  const [startTime, setStartTime] = useState(schedule?.startTime || "09:00");
  const [endTime, setEndTime] = useState(schedule?.endTime || "17:00");
  const [breakStart, setBreakStart] = useState(schedule?.breakStart || "12:00");
  const [breakEnd, setBreakEnd] = useState(schedule?.breakEnd || "13:00");
  const [quota, setQuota] = useState(schedule?.quota?.toString() || "10");
  const [isActive, setIsActive] = useState(schedule?.isActive ?? true);

  const isEdit = !!schedule;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const body = {
        dayOfWeek: Number(dayOfWeek),
        startTime,
        endTime,
        breakStart: breakStart || null,
        breakEnd: breakEnd || null,
        quota: Number(quota),
        isActive,
      };

      const url = isEdit ? `/api/schedules/${schedule.id}` : "/api/schedules";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Gagal menyimpan jadwal");
        return;
      }

      setOpen(false);
      router.refresh();
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return isEdit ? (
      <button onClick={() => setOpen(true)} className="text-primary hover:text-deep-purple">
        <Pencil size={14} />
      </button>
    ) : (
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus size={16} className="mr-1" /> Tambah
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-soft">
          <h2 className="text-lg font-semibold text-text-dark">
            {isEdit ? "Edit Jadwal" : "Tambah Jadwal"}
          </h2>
          <button onClick={() => setOpen(false)} className="text-text-secondary hover:text-text-dark">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}

          <Select
            label="Hari"
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
            options={dayOptions}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Jam Buka" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            <Input label="Jam Tutup" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Istirahat Mulai" type="time" value={breakStart} onChange={(e) => setBreakStart(e.target.value)} />
            <Input label="Istirahat Selesai" type="time" value={breakEnd} onChange={(e) => setBreakEnd(e.target.value)} />
          </div>
          <Input label="Kuota Pasien" type="number" value={quota} onChange={(e) => setQuota(e.target.value)} min="1" />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="scheduleActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded border-border-soft text-primary focus:ring-primary"
            />
            <label htmlFor="scheduleActive" className="text-sm text-text-dark">Jadwal Aktif</label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button type="submit" disabled={loading}>{loading ? "Menyimpan..." : "Simpan"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
