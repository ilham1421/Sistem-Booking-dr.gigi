import Link from "next/link";
import { Clock, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { getActiveServices } from "@/lib/data";

export const revalidate = 60;

export const metadata = {
  title: "Layanan - Benteng Dental Care",
};

export default async function LayananPage() {
  const services = await getActiveServices();

  return (
    <>
      <section className="bg-linear-to-b from-lavender to-white py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-text-dark mb-3">Layanan Kami</h1>
          <p className="text-text-secondary max-w-xl mx-auto">
            Berbagai layanan perawatan gigi dengan standar kualitas terbaik
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 sm:space-y-6">
            {services.map((svc) => (
              <Card key={svc.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-text-dark mb-2">{svc.name}</h3>
                      <p className="text-sm text-text-secondary mb-3">{svc.description}</p>
                      {svc.benefit && (
                        <p className="text-sm text-text-secondary">
                          <span className="font-medium text-text-dark">Manfaat:</span> {svc.benefit}
                        </p>
                      )}
                    </div>
                    <div className="lg:text-right shrink-0 space-y-2">
                      {svc.duration && (
                        <div className="flex items-center gap-1 text-sm text-text-secondary lg:justify-end">
                          <Clock size={14} />
                          <span>~{svc.duration} menit</span>
                        </div>
                      )}
                      {svc.price && (
                        <p className="text-lg font-semibold text-primary">
                          Mulai {formatCurrency(svc.price)}
                        </p>
                      )}
                      <Link href="/reservasi">
                        <Button size="sm" className="gap-1.5 mt-2">
                          <CalendarCheck size={14} />
                          Reservasi
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
