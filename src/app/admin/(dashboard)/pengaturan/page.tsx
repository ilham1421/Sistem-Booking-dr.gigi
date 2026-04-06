import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { SettingsForm } from "./SettingsForm";
import { PasswordForm } from "./PasswordForm";

export const dynamic = "force-dynamic";

export default async function PengaturanPage() {
  const settings = await prisma.setting.findMany();
  const settingsMap: Record<string, string> = {};
  settings.forEach((s) => {
    settingsMap[s.key] = s.value;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-dark mb-6">Pengaturan</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SettingsForm settings={settingsMap} />
        <PasswordForm />
      </div>
    </div>
  );
}
