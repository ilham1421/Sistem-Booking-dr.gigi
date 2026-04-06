import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getSettings, getActiveSchedules } from "@/lib/data";
import { getDayName } from "@/lib/utils";

export const metadata = {
  title: "Kontak & Lokasi - Benteng Dental Care",
};

export const revalidate = 60;

export default async function KontakPage() {
  const [settingsMap, schedules] = await Promise.all([
    getSettings(),
    getActiveSchedules(),
  ]);

  const address = settingsMap.clinic_address || "Desa Benteng, Kec. Mandalle, Kab. Pangkep";
  const phone = settingsMap.clinic_phone || "+6285342236688";
  const whatsapp = settingsMap.clinic_whatsapp || "6285342236688";
  const email = settingsMap.clinic_email || "bentengdentalcare@gmail.com";
  const googleMapsUrl = settingsMap.google_maps_url || "https://maps.app.goo.gl/fbw482grmLqAH1iP9";

  // Build schedule display from DB
  const scheduleDisplay = schedules.map((s) => ({
    day: getDayName(s.dayOfWeek),
    time: `${s.startTime} - ${s.endTime}`,
    note: s.breakStart && s.breakEnd ? `Istirahat ${s.breakStart} - ${s.breakEnd}` : null,
  }));

  return (
    <>
      <section className="bg-linear-to-b from-lavender to-white py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-text-dark mb-3">Kontak & Lokasi</h1>
          <p className="text-text-secondary max-w-xl mx-auto">
            Hubungi kami atau kunjungi klinik kami
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-semibold text-text-dark text-lg mb-4">Informasi Kontak</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-lavender rounded-lg flex items-center justify-center shrink-0">
                        <MapPin size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-text-dark text-sm">Alamat</p>
                        <p className="text-sm text-text-secondary">{address}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-lavender rounded-lg flex items-center justify-center shrink-0">
                        <Phone size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-text-dark text-sm">Telepon / WhatsApp</p>
                        <p className="text-sm text-text-secondary">{phone}</p>
                        <a
                          href={`https://wa.me/${whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 mt-1"
                        >
                          Chat WhatsApp <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-lavender rounded-lg flex items-center justify-center shrink-0">
                        <Mail size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-text-dark text-sm">Email</p>
                        <p className="text-sm text-text-secondary">{email}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="font-semibold text-text-dark text-lg mb-4">Jam Operasional</h2>
                  <div className="space-y-3">
                    {scheduleDisplay.map((item) => (
                      <div key={item.day} className="flex items-start gap-3">
                        <Clock size={16} className="text-primary mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium text-text-dark text-sm">{item.day}</p>
                          <p className="text-sm text-text-secondary">{item.time}</p>
                          {item.note && (
                            <p className="text-xs text-text-secondary">{item.note}</p>
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="flex items-start gap-3">
                      <Clock size={16} className="text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-text-dark text-sm">Minggu & Hari Libur</p>
                        <p className="text-sm text-text-secondary">Tutup</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Map */}
            <div className="space-y-4">
              <Card className="overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.5!2d119.5!3d-4.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwNDInMDAuMCJTIDExOcKwMzAnMDAuMCJF!5e0!3m2!1sid!2sid!4v1"
                  width="100%"
                  height="320"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi Benteng Dental Care"
                  className="w-full"
                />
                <CardContent className="p-4">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="w-full gap-2">
                      <MapPin size={16} />
                      Buka di Google Maps
                    </Button>
                  </a>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-lavender/50">
                <CardContent className="p-4">
                  <p className="text-sm text-text-dark font-medium mb-1">Petunjuk Arah</p>
                  <p className="text-sm text-text-secondary">
                    Klinik kami terletak di Desa Benteng, Kec. Mandalle, Kab. Pangkep.
                    Mudah dijangkau dengan kendaraan pribadi maupun umum.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
