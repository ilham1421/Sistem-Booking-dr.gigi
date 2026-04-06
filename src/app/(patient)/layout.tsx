import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { prisma } from "@/lib/prisma";

export default async function PatientLayout({ children }: { children: React.ReactNode }) {
  const settings = await prisma.setting.findMany();
  const settingsMap: Record<string, string> = {};
  settings.forEach((s) => { settingsMap[s.key] = s.value; });

  const whatsapp = settingsMap.clinic_whatsapp || "6285342236688";

  return (
    <>
      <Navbar whatsapp={whatsapp} />
      <main className="min-h-screen">{children}</main>
      <Footer settings={settingsMap} />
      <WhatsAppFloat whatsapp={whatsapp} />
    </>
  );
}
