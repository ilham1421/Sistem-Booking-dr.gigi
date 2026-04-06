import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Benteng Dental Care - drg. Astuti",
  description: "Pelayanan kesehatan gigi yang bersih, nyaman, dan profesional di Desa Benteng, Kec. Mandalle, Kab. Pangkep",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
