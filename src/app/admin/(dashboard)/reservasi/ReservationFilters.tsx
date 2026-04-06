"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Search, X } from "lucide-react";

const statusOptions = [
  { value: "WAITING", label: "Menunggu Konfirmasi" },
  { value: "CONFIRMED", label: "Dikonfirmasi" },
  { value: "RESCHEDULED", label: "Dijadwalkan Ulang" },
  { value: "COMPLETED", label: "Selesai" },
  { value: "CANCELLED", label: "Dibatalkan" },
  { value: "NO_SHOW", label: "Tidak Hadir" },
];

export function ReservationFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/admin/reservasi?${params.toString()}`);
  }

  function clearFilters() {
    router.push("/admin/reservasi");
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
        <input
          type="text"
          placeholder="Cari nama pasien..."
          defaultValue={searchParams.get("search") || ""}
          onChange={(e) => updateParams("search", e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border-soft bg-white text-sm text-text-dark placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>
      <Select
        options={statusOptions}
        value={searchParams.get("status") || ""}
        onChange={(e) => updateParams("status", e.target.value)}
        className="sm:w-48"
      />
      <Input
        type="date"
        value={searchParams.get("date") || ""}
        onChange={(e) => updateParams("date", e.target.value)}
        className="sm:w-44"
      />
      {(searchParams.get("search") || searchParams.get("status") || searchParams.get("date")) && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
          <X size={14} /> Reset
        </Button>
      )}
    </div>
  );
}
