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
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110"
      aria-label="Chat WhatsApp"
    >
      <MessageCircle size={24} />
    </a>
  );
}
