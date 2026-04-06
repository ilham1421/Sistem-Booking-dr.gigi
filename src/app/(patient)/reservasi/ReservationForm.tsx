"use client";

import { useState } from "react";
import { CalendarCheck, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardContent } from "@/components/ui/Card";

interface ServiceOption {
  value: string;
  label: string;
}

interface Props {
  serviceOptions: ServiceOption[];
  whatsapp: string;
}

interface FormErrors {
  [key: string]: string;
}

const timeOptions = [
  { value: "09:00", label: "09:00" },
  { value: "10:00", label: "10:00" },
  { value: "11:00", label: "11:00" },
  { value: "13:00", label: "13:00" },
  { value: "14:00", label: "14:00" },
  { value: "15:00", label: "15:00" },
  { value: "16:00", label: "16:00" },
];

export function ReservationForm({ serviceOptions, whatsapp }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setFormError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      patientType: formData.get("patientType") as string,
      serviceId: formData.get("serviceId") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      complaint: formData.get("complaint") as string,
      notes: formData.get("notes") as string,
    };

    // Validation
    const newErrors: FormErrors = {};
    if (!data.name.trim()) newErrors.name = "Nama lengkap wajib diisi";
    if (!data.phone.trim()) newErrors.phone = "Nomor WhatsApp wajib diisi";
    if (data.phone && !/^[0-9+\-\s()]+$/.test(data.phone))
      newErrors.phone = "Format nomor tidak valid";
    if (!data.patientType) newErrors.patientType = "Pilih jenis pasien";
    if (!data.serviceId) newErrors.serviceId = "Pilih layanan";
    if (!data.date) newErrors.date = "Pilih tanggal reservasi";
    if (!data.time) newErrors.time = "Pilih jam reservasi";
    if (!data.complaint.trim()) newErrors.complaint = "Keluhan wajib diisi";

    // Check date is not in the past
    if (data.date) {
      const selectedDate = new Date(data.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = "Tanggal tidak boleh di masa lalu";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setFormError(errorData.error || "Terjadi kesalahan. Silakan coba lagi.");
        return;
      }

      setIsSuccess(true);
    } catch {
      setFormError("Terjadi kesalahan koneksi. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <>
        <section className="bg-linear-to-b from-lavender to-white py-10 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-text-dark mb-3">Reservasi Online</h1>
          </div>
        </section>
        <section className="py-10 sm:py-16">
          <div className="max-w-md mx-auto px-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-text-dark mb-3">Reservasi Berhasil!</h2>
            <p className="text-text-secondary mb-2">
              Terima kasih, reservasi Anda telah diterima dengan status{" "}
              <span className="font-medium text-yellow-600">Menunggu Konfirmasi</span>.
            </p>
            <p className="text-text-secondary text-sm mb-6">
              Tim kami akan segera menghubungi Anda melalui WhatsApp untuk
              mengonfirmasi jadwal reservasi.
            </p>
            <Button onClick={() => setIsSuccess(false)} variant="outline">
              Buat Reservasi Lagi
            </Button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="bg-linear-to-b from-lavender to-white py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CalendarCheck size={24} className="text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-dark mb-3">Reservasi Online</h1>
          <p className="text-text-secondary max-w-xl mx-auto text-sm sm:text-base">
            Isi form di bawah untuk menjadwalkan kunjungan Anda
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Emergency Notice */}
          <Card className="border-yellow-200 bg-yellow-50 mb-6 sm:mb-8">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertTriangle size={20} className="text-yellow-600 mt-0.5 shrink-0" />
              <p className="text-sm text-yellow-800">
                <strong>Perhatian:</strong> Untuk kondisi darurat atau sakit gigi yang parah,
                silakan hubungi langsung via{" "}
                <a
                  href={`https://wa.me/${whatsapp}`}
                  className="underline font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>{" "}
                untuk penanganan segera.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {formError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {formError}
                  </div>
                )}

                <Input
                  id="name"
                  name="name"
                  label="Nama Lengkap *"
                  placeholder="Masukkan nama lengkap Anda"
                  error={errors.name}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    id="phone"
                    name="phone"
                    label="Nomor WhatsApp *"
                    placeholder="08xx-xxxx-xxxx"
                    error={errors.phone}
                  />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    label="Email (opsional)"
                    placeholder="email@contoh.com"
                    error={errors.email}
                  />
                </div>

                <Select
                  id="patientType"
                  name="patientType"
                  label="Jenis Pasien *"
                  options={[
                    { value: "NEW", label: "Pasien Baru" },
                    { value: "EXISTING", label: "Pasien Lama" },
                  ]}
                  error={errors.patientType}
                />

                <Select
                  id="serviceId"
                  name="serviceId"
                  label="Pilih Layanan *"
                  options={serviceOptions}
                  error={errors.serviceId}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    label="Tanggal Reservasi *"
                    min={new Date().toISOString().split("T")[0]}
                    error={errors.date}
                  />
                  <Select
                    id="time"
                    name="time"
                    label="Jam Reservasi *"
                    options={timeOptions}
                    error={errors.time}
                  />
                </div>

                <Textarea
                  id="complaint"
                  name="complaint"
                  label="Keluhan Singkat *"
                  placeholder="Jelaskan keluhan atau alasan kunjungan Anda"
                  error={errors.complaint}
                />

                <Textarea
                  id="notes"
                  name="notes"
                  label="Catatan Tambahan (opsional)"
                  placeholder="Informasi tambahan jika ada"
                  rows={2}
                />

                <Button type="submit" className="w-full gap-2" size="lg" disabled={isSubmitting}>
                  <CalendarCheck size={20} />
                  {isSubmitting ? "Mengirim..." : "Kirim Reservasi"}
                </Button>

                <p className="text-xs text-text-secondary text-center">
                  Dengan mengirim reservasi, Anda menyetujui bahwa data akan digunakan
                  untuk keperluan pelayanan kesehatan. Reservasi akan diverifikasi oleh
                  admin/dokter.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
