"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, X } from "lucide-react";

export function PatientSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [type, setType] = useState(searchParams.get("type") || "");

  function applyFilters(s?: string, t?: string) {
    const params = new URLSearchParams();
    const searchVal = s !== undefined ? s : search;
    const typeVal = t !== undefined ? t : type;
    if (searchVal) params.set("search", searchVal);
    if (typeVal) params.set("type", typeVal);
    router.push(`/admin/pasien?${params.toString()}`);
  }

  function handleReset() {
    setSearch("");
    setType("");
    router.push("/admin/pasien");
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
        <input
          type="text"
          placeholder="Cari nama, telepon, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          className="w-full pl-9 pr-4 py-2 border border-border-soft rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>
      <select
        value={type}
        onChange={(e) => {
          setType(e.target.value);
          applyFilters(undefined, e.target.value);
        }}
        className="px-3 py-2 border border-border-soft rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      >
        <option value="">Semua Jenis</option>
        <option value="NEW">Pasien Baru</option>
        <option value="EXISTING">Pasien Lama</option>
      </select>
      {(search || type) && (
        <button onClick={handleReset} className="inline-flex items-center gap-1 px-3 py-2 text-sm text-text-secondary hover:text-text-dark">
          <X size={16} /> Reset
        </button>
      )}
    </div>
  );
}
