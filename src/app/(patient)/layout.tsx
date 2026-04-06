import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { getSettings } from "@/lib/data";

export default async function PatientLayout({ children }: { children: React.ReactNode }) {
  const settingsMap = await getSettings();
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
