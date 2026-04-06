import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";
import { Stethoscope } from "lucide-react";
import { ServiceFormModal } from "./ServiceFormModal";

export const dynamic = "force-dynamic";

export default async function LayananAdminPage() {
  const services = await prisma.service.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { reservations: true } } },
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-dark">Kelola Layanan</h1>
          <p className="text-text-secondary text-sm">{services.length} layanan tersedia</p>
        </div>
        <ServiceFormModal />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.length === 0 ? (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardContent className="py-12 text-center">
              <Stethoscope size={40} className="mx-auto mb-2 text-text-secondary opacity-50" />
              <p className="text-text-secondary">Belum ada layanan</p>
            </CardContent>
          </Card>
        ) : (
          services.map((service) => (
            <Card key={service.id} className={!service.isActive ? "opacity-60" : ""}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-text-dark">{service.name}</h3>
                  <Badge className={service.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}>
                    {service.isActive ? "Aktif" : "Nonaktif"}
                  </Badge>
                </div>
                <p className="text-sm text-text-secondary mb-3 line-clamp-2">{service.description || "-"}</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Harga</span>
                    <span className="font-medium text-text-dark">{formatCurrency(Number(service.price ?? 0))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Durasi</span>
                    <span className="text-text-dark">{service.duration} menit</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Reservasi</span>
                    <span className="text-text-dark">{service._count.reservations}x</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-border-soft">
                  <ServiceFormModal service={service} />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
