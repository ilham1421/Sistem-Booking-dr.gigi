import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Benteng Dental Care - drg. Astuti",
  description: "Pelayanan kesehatan gigi yang bersih, nyaman, dan profesional di Desa Benteng, Kec. Mandalle, Kab. Pangkep",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
