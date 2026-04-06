import { prisma } from "@/lib/prisma";
import { HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { FaqAccordion } from "./FaqAccordion";

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const [faqs, settings] = await Promise.all([
    prisma.faq.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.setting.findMany(),
  ]);

  const settingsMap: Record<string, string> = {};
  settings.forEach((s) => { settingsMap[s.key] = s.value; });
  const whatsapp = settingsMap.clinic_whatsapp || "6285342236688";

  return (
    <>
      <section className="bg-linear-to-b from-lavender to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HelpCircle size={24} className="text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-text-dark mb-3">Pertanyaan Umum (FAQ)</h1>
          <p className="text-text-secondary max-w-xl mx-auto">
            Jawaban untuk pertanyaan yang sering diajukan oleh pasien
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FaqAccordion faqs={faqs.map((f) => ({ question: f.question, answer: f.answer }))} />

          <div className="mt-12 text-center">
            <Card className="border-primary/20 bg-lavender/50">
              <CardContent className="p-6">
                <p className="text-text-dark font-medium mb-2">Masih ada pertanyaan?</p>
                <p className="text-sm text-text-secondary mb-4">
                  Jangan ragu untuk menghubungi kami melalui WhatsApp
                </p>
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Chat WhatsApp
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
