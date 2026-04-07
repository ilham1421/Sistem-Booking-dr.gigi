import { prisma } from "@/lib/prisma";
import { ReservationForm } from "./ReservationForm";
import { getSettings } from "@/lib/data";

export const revalidate = 60;

export default async function ReservasiPage() {
  const [services, settingsMap] = await Promise.all([
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, price: true, duration: true },
    }),
    getSettings(),
  ]);

  const whatsapp = settingsMap.clinic_whatsapp || "6285342236688";

  const serviceOptions = services.map((s) => ({
    value: s.id,
    label: s.name,
    price: s.price,
    duration: s.duration,
  }));

  return <ReservationForm serviceOptions={serviceOptions} whatsapp={whatsapp} />;
}
