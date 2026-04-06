"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Plus, Pencil, X } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  duration: number | null;
  isActive: boolean;
}

interface Props {
  service?: Service;
}

export function ServiceFormModal({ service }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState(service?.name || "");
  const [description, setDescription] = useState(service?.description || "");
  const [price, setPrice] = useState(service?.price?.toString() || "");
  const [duration, setDuration] = useState(service?.duration?.toString() || "30");
  const [isActive, setIsActive] = useState(service?.isActive ?? true);

  const isEdit = !!service;

  function resetForm() {
    if (!service) {
      setName("");
      setDescription("");
      setPrice("");
      setDuration("30");
      setIsActive(true);
    }
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !price || !duration) {
      setError("Nama, harga, dan durasi wajib diisi");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const body = { name, description, price: Number(price), duration: Number(duration), isActive };
      const url = isEdit ? `/api/services/${service.id}` : "/api/services";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Gagal menyimpan layanan");
        return;
      }

      setOpen(false);
      resetForm();
      router.refresh();
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!service || !confirm("Yakin ingin menghapus layanan ini?")) return;
    setLoading(true);
    try {
      await fetch(`/api/services/${service.id}`, { method: "DELETE" });
      setOpen(false);
      router.refresh();
    } catch {
      setError("Gagal menghapus");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return isEdit ? (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-sm text-primary hover:text-deep-purple font-medium"
      >
        <Pencil size={14} /> Edit
      </button>
    ) : (
      <Button onClick={() => setOpen(true)}>
        <Plus size={16} className="mr-1" /> Tambah Layanan
      </Button>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-soft">
            <h2 className="text-lg font-semibold text-text-dark">
              {isEdit ? "Edit Layanan" : "Tambah Layanan Baru"}
            </h2>
            <button onClick={() => setOpen(false)} className="text-text-secondary hover:text-text-dark">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}

            <Input label="Nama Layanan" value={name} onChange={(e) => setName(e.target.value)} required />
            <Textarea label="Deskripsi" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
            <Input label="Harga (Rp)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" />
            <Input label="Durasi (menit)" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} required min="1" />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded border-border-soft text-primary focus:ring-primary"
              />
              <label htmlFor="isActive" className="text-sm text-text-dark">Layanan Aktif</label>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                {isEdit && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={loading}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Hapus Layanan
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
