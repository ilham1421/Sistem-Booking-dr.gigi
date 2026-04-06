import { MessageCircle } from "lucide-react";

interface Props {
  whatsapp: string;
}

export function WhatsAppFloat({ whatsapp }: Props) {
  return (
    <a
      href={`https://wa.me/${whatsapp}?text=Halo%20Dokter%2C%20saya%20ingin%20konsultasi`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white p-3.5 sm:p-4 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95"
      aria-label="Chat WhatsApp"
    >
      <MessageCircle size={22} className="sm:w-6 sm:h-6" />
    </a>
  );
}
