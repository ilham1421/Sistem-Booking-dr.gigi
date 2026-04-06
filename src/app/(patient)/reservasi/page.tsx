import { prisma } from "@/lib/prisma";
import { ReservationForm } from "./ReservationForm";

export const dynamic = "force-dynamic";

export default async function ReservasiPage() {
  const [services, settings] = await Promise.all([
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.setting.findMany(),
  ]);

  const settingsMap: Record<string, string> = {};
  settings.forEach((s) => { settingsMap[s.key] = s.value; });
  const whatsapp = settingsMap.clinic_whatsapp || "6285342236688";

  const serviceOptions = services.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  return <ReservationForm serviceOptions={serviceOptions} whatsapp={whatsapp} />;
}
