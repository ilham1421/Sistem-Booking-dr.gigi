"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, Trash2, X } from "lucide-react";

interface BlockedDateData {
  id: string;
  date: Date;
  reason: string | null;
}

interface Props {
  blockedDate?: BlockedDateData;
}

export function BlockedDateForm({ blockedDate }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [date, setDate] = useState(
    blockedDate ? new Date(blockedDate.date).toISOString().split("T")[0] : ""
  );
  const [reason, setReason] = useState(blockedDate?.reason || "");

  const isEdit = !!blockedDate;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date) {
      setError("Tanggal wajib diisi");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/schedules/blocked-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, reason: reason || null }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Gagal menyimpan");
        return;
      }

      setOpen(false);
      setDate("");
      setReason("");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!blockedDate || !confirm("Hapus tanggal libur ini?")) return;
    setLoading(true);
    try {
      await fetch(`/api/schedules/blocked-dates/${blockedDate.id}`, { method: "DELETE" });
      router.refresh();
    } catch {
      setError("Gagal menghapus");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return isEdit ? (
      <button onClick={handleDelete} disabled={loading} className="text-red-400 hover:text-red-600">
        <Trash2 size={14} />
      </button>
    ) : (
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus size={16} className="mr-1" /> Tambah
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-soft">
          <h2 className="text-lg font-semibold text-text-dark">Tambah Tanggal Libur</h2>
          <button onClick={() => setOpen(false)} className="text-text-secondary hover:text-text-dark">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}
          <Input label="Tanggal" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          <Input label="Keterangan (opsional)" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Contoh: Hari Raya Idul Fitri" />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button type="submit" disabled={loading}>{loading ? "Menyimpan..." : "Simpan"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
