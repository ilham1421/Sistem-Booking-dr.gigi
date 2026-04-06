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
import { prisma } from "@/lib/prisma";
import { getDayName } from "@/lib/utils";

export const dynamic = "force-dynamic";

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
  const [testimonials, schedules, settings] = await Promise.all([
    prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.schedule.findMany({
      where: { isActive: true },
      orderBy: { dayOfWeek: "asc" },
    }),
    prisma.setting.findMany(),
  ]);

  const settingsMap: Record<string, string> = {};
  settings.forEach((s) => { settingsMap[s.key] = s.value; });
  const whatsapp = settingsMap.clinic_whatsapp || "6285342236688";
  const clinicAddress = settingsMap.clinic_address || "Desa Benteng, Kec. Mandalle, Kab. Pangkep";
  const googleMapsUrl = settingsMap.google_maps_url || "https://maps.app.goo.gl/fbw482grmLqAH1iP9";

  // Group schedules for display
  const scheduleDisplay = buildScheduleDisplay(schedules);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-linear-to-b from-lavender to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 text-sm text-primary font-medium shadow-sm mb-6">
              <CheckCircle2 size={16} />
              Praktik Dokter Gigi Terpercaya
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-dark leading-tight mb-6">
              Pelayanan Kesehatan Gigi yang{" "}
              <span className="text-primary">Bersih, Nyaman,</span> dan Profesional
            </h1>
            <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
              Dapatkan perawatan gigi terbaik dengan dokter berpengalaman dalam
              suasana klinik yang bersih, modern, dan ramah untuk seluruh keluarga.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/reservasi">
                <Button size="lg" className="gap-2">
                  <CalendarCheck size={20} />
                  Reservasi Sekarang
                </Button>
              </Link>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="gap-2">
                  <Phone size={20} />
                  Hubungi WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Short */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-text-dark mb-4">
              Tentang Praktik Kami
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Benteng Dental Care hadir untuk memberikan pelayanan kesehatan gigi
              yang berkualitas dengan mengutamakan kenyamanan dan keamanan pasien.
              Dengan peralatan modern dan ruang praktik yang steril, kami berkomitmen
              memberikan pengalaman perawatan gigi terbaik di Desa Benteng, Kec. Mandalle, Kab. Pangkep.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 lg:py-20 bg-bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-dark mb-3">Layanan Unggulan</h2>
            <p className="text-text-secondary">Berbagai layanan perawatan gigi untuk kebutuhan Anda</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredServices.map((svc) => (
              <Card key={svc.title} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-lavender rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svc.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-text-dark mb-2">{svc.title}</h3>
                  <p className="text-sm text-text-secondary">{svc.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/layanan">
              <Button variant="outline" className="gap-2">
                Lihat Semua Layanan <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-dark mb-3">Mengapa Memilih Kami</h2>
            <p className="text-text-secondary">Komitmen kami untuk pelayanan terbaik</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((adv) => (
              <div key={adv.title} className="text-center p-6">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <adv.icon size={28} className="text-primary" />
                </div>
                <h3 className="font-semibold text-text-dark mb-2">{adv.title}</h3>
                <p className="text-sm text-text-secondary">{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule Short */}
      <section className="py-16 lg:py-20 bg-lavender">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-text-dark mb-6">Jadwal Praktik</h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {scheduleDisplay.map((s) => (
                    <div key={s.day} className="flex items-center justify-between py-2 border-b border-border-soft last:border-0">
                      <span className="font-medium text-text-dark">{s.day}</span>
                      <span className="text-text-secondary text-sm">{s.time}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between py-2">
                    <span className="font-medium text-text-dark">Minggu & Hari Libur</span>
                    <span className="text-text-secondary text-sm">Tutup</span>
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
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-dark mb-3">Testimoni Pasien</h2>
            <p className="text-text-secondary">Apa kata mereka tentang pelayanan kami</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-text-secondary text-sm mb-4 italic">&ldquo;{t.content}&rdquo;</p>
                  <p className="font-medium text-text-dark text-sm">{t.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-16 lg:py-20 bg-bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-text-dark mb-3">Lokasi Kami</h2>
            <p className="text-text-secondary">Mudah dijangkau dan strategis</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <MapPin size={20} className="text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-text-dark">{clinicAddress}</p>
                  </div>
                </div>
                <div className="rounded-lg overflow-hidden mb-4">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.5!2d119.5!3d-4.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwNDInMDAuMCJTIDExOcKwMzAnMDAuMCJF!5e0!3m2!1sid!2sid!4v1"
                    width="100%"
                    height="192"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lokasi Benteng Dental Care"
                    className="w-full"
                  />
                </div>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm" className="gap-2">
                    <MapPin size={16} /> Buka di Google Maps
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-primary">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Siap Merawat Kesehatan Gigi Anda?
          </h2>
          <p className="text-white/80 mb-8">
            Jangan tunda perawatan gigi Anda. Reservasi sekarang dan dapatkan
            pelayanan terbaik dari dokter gigi berpengalaman.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/reservasi">
              <Button variant="secondary" size="lg" className="gap-2">
                <CalendarCheck size={20} />
                Reservasi Sekarang
              </Button>
            </Link>
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 border-white/30 text-white hover:bg-white/10 hover:text-white"
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
