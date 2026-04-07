import Image from "next/image";

interface Props {
  whatsapp: string;
}

export function WhatsAppFloat({ whatsapp }: Props) {
  return (
    <a
      href={`https://wa.me/${whatsapp}?text=Halo%20Dokter%2C%20saya%20ingin%20konsultasi`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 hover:scale-110 active:scale-95 transition-all"
      aria-label="Chat WhatsApp"
    >
      <Image src="/icon_whatsapp.avif" alt="WhatsApp" width={56} height={56} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg" />
    </a>
  );
}
