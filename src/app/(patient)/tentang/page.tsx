import { Heart, Award, BookOpen, CheckCircle2, CalendarCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export const metadata = {
  title: "Tentang Dokter - Benteng Dental Care",
};

export default function TentangPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-linear-to-b from-lavender to-white py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-text-dark mb-3">Tentang Dokter</h1>
          <p className="text-text-secondary max-w-xl mx-auto">
            Mengenal lebih dekat dokter gigi yang akan merawat kesehatan gigi Anda
          </p>
        </div>
      </section>

      {/* Doctor Profile */}
      <section className="py-10 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-10">
            {/* Photo */}
            <div className="lg:col-span-2">
              <div className="bg-lavender rounded-2xl aspect-3/4 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-4xl">👨‍⚕️</span>
                  </div>
                  <p className="text-sm text-text-secondary">Foto Dokter</p>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                <p className="text-sm text-primary font-medium mb-1">drg.</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-text-dark mb-2">drg. Astuti</h2>
                <p className="text-text-secondary">Dokter Gigi Umum</p>
              </div>

              <div className="space-y-4 mb-8">
                <p className="text-text-secondary leading-relaxed">
                  drg. Astuti adalah dokter gigi yang berpengalaman dan berdedikasi
                  dalam memberikan pelayanan kesehatan gigi yang berkualitas.
                  Berlokasi di Desa Benteng, Kec. Mandalle, Kab. Pangkep,
                  beliau melayani pasien dengan penuh perhatian dan profesionalisme.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  Dengan pendekatan yang ramah, gentle, dan informatif, drg. Astuti
                  berkomitmen untuk memberikan pengalaman perawatan gigi yang nyaman
                  dan menyenangkan bagi seluruh pasien, termasuk anak-anak.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8">
                <Card>
                  <CardContent className="p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl font-bold text-primary">10+</p>
                    <p className="text-[10px] sm:text-xs text-text-secondary">Tahun Pengalaman</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl font-bold text-primary">5000+</p>
                    <p className="text-[10px] sm:text-xs text-text-secondary">Pasien Dilayani</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl font-bold text-primary">9</p>
                    <p className="text-[10px] sm:text-xs text-text-secondary">Jenis Layanan</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="py-10 sm:py-16 bg-bg-light">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-lavender rounded-lg flex items-center justify-center">
                    <Award size={20} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-text-dark">Pengalaman</h3>
                </div>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                    Lulusan Fakultas Kedokteran Gigi
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                    Praktik di Desa Benteng, Kec. Mandalle, Kab. Pangkep
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                    Pelatihan perawatan gigi anak dan ortodonti
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                    Anggota PDGI (Persatuan Dokter Gigi Indonesia)
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-lavender rounded-lg flex items-center justify-center">
                    <BookOpen size={20} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-text-dark">Bidang Layanan</h3>
                </div>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                    Kedokteran gigi umum & konservasi
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                    Perawatan gigi anak (pedodonsia)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                    Estetika gigi (bleaching, veneer)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                    Perawatan saluran akar
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-lavender rounded-lg flex items-center justify-center">
                    <Heart size={20} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-text-dark">Komitmen & Visi</h3>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  &ldquo;Setiap pasien berhak mendapatkan perawatan gigi yang aman, nyaman, dan
                  berkualitas. Saya percaya bahwa kepercayaan pasien dibangun melalui komunikasi
                  yang baik, transparansi, dan hasil perawatan yang optimal. Visi saya adalah
                  menjadikan kunjungan ke dokter gigi sebagai pengalaman yang positif, sehingga
                  setiap orang tidak ragu untuk menjaga kesehatan gigi secara rutin.&rdquo;
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-text-dark mb-4">
            Konsultasikan Kesehatan Gigi Anda
          </h2>
          <p className="text-text-secondary mb-6">
            Jadwalkan kunjungan Anda dan rasakan pelayanan dokter gigi yang profesional
          </p>
          <Link href="/reservasi">
            <Button size="lg" className="gap-2">
              <CalendarCheck size={20} />
              Reservasi Sekarang
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
