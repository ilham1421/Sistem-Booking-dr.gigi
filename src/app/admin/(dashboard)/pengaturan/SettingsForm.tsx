"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

interface Props {
  settings: Record<string, string>;
}

const settingFields = [
  { key: "clinic_name", label: "Nama Klinik", type: "text" },
  { key: "clinic_address", label: "Alamat Klinik", type: "textarea" },
  { key: "clinic_phone", label: "Nomor Telepon", type: "text" },
  { key: "clinic_whatsapp", label: "Nomor WhatsApp", type: "text" },
  { key: "clinic_email", label: "Email Klinik", type: "text" },
  { key: "google_maps_url", label: "URL Google Maps", type: "text" },
  { key: "opening_hours", label: "Jam Operasional", type: "text" },
];

export function SettingsForm({ settings }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [values, setValues] = useState<Record<string, string>>(() => {
    const v: Record<string, string> = {};
    settingFields.forEach((f) => {
      v[f.key] = settings[f.key] || "";
    });
    return v;
  });

  function handleChange(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Gagal menyimpan pengaturan");
        return;
      }

      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <div className="px-6 py-4 border-b border-border-soft">
        <h2 className="font-semibold text-text-dark">Informasi Klinik</h2>
      </div>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}
          {success && <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg">Pengaturan berhasil disimpan</div>}

          {settingFields.map((field) =>
            field.type === "textarea" ? (
              <Textarea
                key={field.key}
                label={field.label}
                value={values[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                rows={2}
              />
            ) : (
              <Input
                key={field.key}
                label={field.label}
                value={values[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
              />
            )
          )}

          <Button type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan Pengaturan"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
