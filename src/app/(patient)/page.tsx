import Link from "next/link";
import {
  Shield,
  Clock,
  Heart,
  Star,
  MapPin,
  Phone,
  ArrowRight,
  Sparkles,
  Stethoscope,
  CalendarCheck,
  Users,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { getSettings, getActiveSchedules, getTestimonials } from "@/lib/data";
import { getDayName } from "@/lib/utils";

export const revalidate = 600;

const featuredServices = [
  { icon: Stethoscope, title: "Pemeriksaan Gigi", desc: "Konsultasi dan pemeriksaan menyeluruh untuk kesehatan gigi Anda" },
  { icon: Sparkles, title: "Scaling / Pembersihan", desc: "Pembersihan karang gigi untuk gigi lebih bersih dan sehat" },
  { icon: Heart, title: "Tambal Gigi", desc: "Penambalan gigi berlubang dengan bahan berkualitas tinggi" },
  { icon: Star, title: "Bleaching", desc: "Pemutihan gigi untuk senyuman lebih cerah dan percaya diri" },
];

const advantages = [
  { icon: Shield, title: "Steril & Aman", desc: "Peralatan sterilisasi modern untuk keamanan pasien" },
  { icon: Clock, title: "Tepat Waktu", desc: "Jadwal teratur dan pelayanan yang menghargai waktu Anda" },
  { icon: Heart, title: "Ramah Pasien", desc: "Pendekatan gentle dan nyaman untuk semua usia" },
  { icon: Users, title: "Berpengalaman", desc: "Dokter berpengalaman dengan keahlian terpercaya" },
];

export default async function HomePage() {
  const [testimonials, schedules, settingsMap] = await Promise.all([
    getTestimonials(3),
    getActiveSchedules(),
    getSettings(),
  ]);

  const whatsapp = settingsMap.clinic_whatsapp || "6285342236688";
  const clinicAddress = settingsMap.clinic_address || "Desa Benteng, Kec. Mandalle, Kab. Pangkep";
  const googleMapsUrl = settingsMap.google_maps_url || "https://maps.app.goo.gl/fbw482grmLqAH1iP9";

  // Group schedules for display
  const scheduleDisplay = buildScheduleDisplay(schedules);

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-lavender via-white to-primary/5 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs sm:text-sm text-primary font-medium shadow-sm mb-5 sm:mb-6 border border-primary/10">
              <CheckCircle2 size={14} />
              Praktik Dokter Gigi Terpercaya
            </div>
            <h1 className="text-[1.75rem] leading-9 sm:text-4xl md:text-5xl lg:text-6xl font-bold text-text-dark sm:leading-tight mb-4 sm:mb-6">
              Pelayanan Kesehatan Gigi yang{" "}
              <span className="bg-linear-to-r from-primary to-primary-light bg-clip-text text-transparent">Bersih, Nyaman,</span>{" "}
              dan Profesional
            </h1>
            <p className="text-sm sm:text-lg text-text-secondary mb-8 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              Dapatkan perawatan gigi terbaik dengan dokter berpengalaman dalam
              suasana klinik yang bersih, modern, dan ramah untuk seluruh keluarga.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link href="/reservasi" className="w-full sm:w-auto">
                <Button size="lg" className="gap-2 w-full sm:w-auto shadow-lg shadow-primary/25">
                  <CalendarCheck size={20} />
                  Reservasi Sekarang
                </Button>
              </Link>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                  <Phone size={20} />
                  Hubungi WhatsApp
                </Button>
              </a>
            </div>

            {/* Quick stats on mobile */}
            <div className="grid grid-cols-3 gap-3 mt-10 sm:mt-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white shadow-sm">
                <p className="text-xl sm:text-2xl font-bold text-primary">10+</p>
                <p className="text-[0.65rem] sm:text-xs text-text-secondary mt-0.5">Tahun Pengalaman</p>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white shadow-sm">
                <p className="text-xl sm:text-2xl font-bold text-primary">5000+</p>
                <p className="text-[0.65rem] sm:text-xs text-text-secondary mt-0.5">Pasien Terlayani</p>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white shadow-sm">
                <p className="text-xl sm:text-2xl font-bold text-primary">9</p>
                <p className="text-[0.65rem] sm:text-xs text-text-secondary mt-0.5">Jenis Layanan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Short */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
              <span className="w-8 h-px bg-primary" />
              Tentang Kami
              <span className="w-8 h-px bg-primary" />
            </div>
            <h2 className="text-xl sm:text-3xl font-bold text-text-dark mb-4">
              Tentang Praktik Kami
            </h2>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              Benteng Dental Care hadir untuk memberikan pelayanan kesehatan gigi
              yang berkualitas dengan mengutamakan kenyamanan dan keamanan pasien.
              Dengan peralatan modern dan ruang praktik yang steril, kami berkomitmen
              memberikan pengalaman perawatan gigi terbaik di Desa Benteng, Kec. Mandalle, Kab. Pangkep.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-12 sm:py-16 lg:py-20 bg-bg-light">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
              <span className="w-8 h-px bg-primary" />
              Layanan
              <span className="w-8 h-px bg-primary" />
            </div>
            <h2 className="text-xl sm:text-3xl font-bold text-text-dark mb-2 sm:mb-3">Layanan Unggulan</h2>
            <p className="text-sm sm:text-base text-text-secondary">Berbagai layanan perawatan gigi untuk kebutuhan Anda</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {featuredServices.map((svc) => (
              <Card key={svc.title} className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-lavender group-hover:bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-colors">
                    <svc.icon size={22} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-text-dark text-sm sm:text-base mb-1 sm:mb-2">{svc.title}</h3>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed hidden sm:block">{svc.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-6 sm:mt-8">
            <Link href="/layanan">
              <Button variant="outline" className="gap-2">
                Lihat Semua Layanan <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
              <span className="w-8 h-px bg-primary" />
              Keunggulan
              <span className="w-8 h-px bg-primary" />
            </div>
            <h2 className="text-xl sm:text-3xl font-bold text-text-dark mb-2 sm:mb-3">Mengapa Memilih Kami</h2>
            <p className="text-sm sm:text-base text-text-secondary">Komitmen kami untuk pelayanan terbaik</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {advantages.map((adv, i) => (
              <div key={adv.title} className={`relative text-center p-4 sm:p-6 rounded-2xl ${i % 2 === 0 ? 'bg-lavender/50' : 'bg-primary/5'}`}>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-sm">
                  <adv.icon size={24} className="text-primary" />
                </div>
                <h3 className="font-semibold text-text-dark text-sm sm:text-base mb-1 sm:mb-2">{adv.title}</h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule Short */}
      <section className="py-12 sm:py-16 lg:py-20 bg-linear-to-br from-lavender to-primary/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
              <span className="w-8 h-px bg-primary" />
              Jadwal
              <span className="w-8 h-px bg-primary" />
            </div>
            <h2 className="text-xl sm:text-3xl font-bold text-text-dark mb-4 sm:mb-6">Jadwal Praktik</h2>
            <Card className="shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-0">
                  {scheduleDisplay.map((s, i) => (
                    <div key={s.day} className={`flex items-center justify-between py-3 ${i < scheduleDisplay.length - 1 ? 'border-b border-border-soft' : ''}`}>
                      <span className="font-medium text-text-dark text-sm sm:text-base">{s.day}</span>
                      <span className="text-primary font-medium text-sm bg-lavender px-3 py-1 rounded-full">{s.time}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between py-3 border-t border-border-soft">
                    <span className="font-medium text-text-dark text-sm sm:text-base">Minggu & Hari Libur</span>
                    <span className="text-red-500 font-medium text-sm bg-red-50 px-3 py-1 rounded-full">Tutup</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="mt-6">
              <Link href="/jadwal">
                <Button variant="outline" className="gap-2">
                  Lihat Jadwal Lengkap <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
              <span className="w-8 h-px bg-primary" />
              Testimoni
              <span className="w-8 h-px bg-primary" />
            </div>
            <h2 className="text-xl sm:text-3xl font-bold text-text-dark mb-2 sm:mb-3">Testimoni Pasien</h2>
            <p className="text-sm sm:text-base text-text-secondary">Apa kata mereka tentang pelayanan kami</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-text-secondary text-sm mb-4 italic leading-relaxed">&ldquo;{t.content}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-3 border-t border-border-soft">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {t.name.charAt(0)}
                    </div>
                    <p className="font-medium text-text-dark text-sm">{t.name}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-12 sm:py-16 lg:py-20 bg-bg-light">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
              <span className="w-8 h-px bg-primary" />
              Lokasi
              <span className="w-8 h-px bg-primary" />
            </div>
            <h2 className="text-xl sm:text-3xl font-bold text-text-dark mb-2 sm:mb-3">Lokasi Kami</h2>
            <p className="text-sm sm:text-base text-text-secondary">Mudah dijangkau dan strategis</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Card className="shadow-lg overflow-hidden">
              <div className="rounded-t-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.5!2d119.5!3d-4.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwNDInMDAuMCJTIDExOcKwMzAnMDAuMCJF!5e0!3m2!1sid!2sid!4v1"
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi Benteng Dental Care"
                  className="w-full"
                />
              </div>
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-text-dark text-sm sm:text-base">{clinicAddress}</p>
                  </div>
                </div>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
                    <MapPin size={16} /> Buka di Google Maps
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-14 sm:py-16 lg:py-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary to-primary-dark" />
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
            Siap Merawat Kesehatan Gigi Anda?
          </h2>
          <p className="text-white/80 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed">
            Jangan tunda perawatan gigi Anda. Reservasi sekarang dan dapatkan
            pelayanan terbaik dari dokter gigi berpengalaman.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link href="/reservasi" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="gap-2 w-full sm:w-auto shadow-lg">
                <CalendarCheck size={20} />
                Reservasi Sekarang
              </Button>
            </Link>
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 border-white/30 text-white hover:bg-white/10 hover:text-white w-full sm:w-auto"
              >
                <Phone size={20} />
                Hubungi WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

interface ScheduleRecord {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

function buildScheduleDisplay(schedules: ScheduleRecord[]): { day: string; time: string }[] {
  return schedules.map((s) => ({
    day: getDayName(s.dayOfWeek),
    time: `${s.startTime} - ${s.endTime}`,
  }));
}
