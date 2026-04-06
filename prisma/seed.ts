import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const adminUser = await prisma.user.upsert({
    where: { email: "bentengdentalcare@gmail.com" },
    update: {},
    create: {
      name: "Administrator",
      email: "bentengdentalcare@gmail.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("Admin user created");

  // Doctor user + profile
  const doctorPassword = await bcrypt.hash("doctor123", 12);
  const doctorUser = await prisma.user.upsert({
    where: { email: "drg.astuti@bentengdentalcare.com" },
    update: {},
    create: {
      name: "drg. Astuti",
      email: "drg.astuti@bentengdentalcare.com",
      password: doctorPassword,
      role: "DOCTOR",
    },
  });

  const doctor = await prisma.doctor.upsert({
    where: { userId: doctorUser.id },
    update: {},
    create: {
      userId: doctorUser.id,
      fullName: "drg. Astuti",
      title: "drg.",
      specialization: "Dokter Gigi Umum",
      bio: "Dokter gigi yang berpengalaman dan berdedikasi dalam memberikan pelayanan kesehatan gigi yang berkualitas di Desa Benteng, Kec. Mandalle, Kab. Pangkep.",
    },
  });
  console.log("Doctor created");

  // Services
  const servicesData = [
    { name: "Pembersihan Karang Gigi", description: "Pembersihan plak dan karang gigi menggunakan alat ultrasonik untuk menjaga kesehatan gusi dan mencegah penyakit periodontal.", price: 250000, duration: 30 },
    { name: "Tambal Gigi", description: "Penambalan gigi berlubang menggunakan bahan komposit sewarna gigi untuk mengembalikan fungsi dan estetika gigi.", price: 200000, duration: 45 },
    { name: "Cabut Gigi", description: "Pencabutan gigi yang tidak dapat dipertahankan dengan teknik atraumatik dan anestesi lokal untuk kenyamanan pasien.", price: 300000, duration: 30 },
    { name: "Perawatan Saluran Akar", description: "Perawatan endodontik untuk menyelamatkan gigi yang terinfeksi dengan membersihkan dan mengisi saluran akar gigi.", price: 1500000, duration: 90 },
    { name: "Veneer Gigi", description: "Pemasangan lapisan tipis porselen pada permukaan gigi depan untuk memperbaiki warna, bentuk, dan ukuran gigi.", price: 3000000, duration: 60 },
    { name: "Bleaching Gigi", description: "Pemutihan gigi profesional menggunakan gel pemutih khusus untuk mendapatkan senyum yang lebih cerah dan percaya diri.", price: 1500000, duration: 60 },
    { name: "Pemasangan Kawat Gigi", description: "Perawatan ortodontik untuk merapikan susunan gigi dan memperbaiki maloklusi menggunakan bracket modern.", price: 8000000, duration: 60 },
    { name: "Pemasangan Gigi Tiruan", description: "Pembuatan dan pemasangan gigi palsu (denture) untuk menggantikan gigi yang hilang dan mengembalikan fungsi pengunyahan.", price: 2500000, duration: 60 },
    { name: "Konsultasi Gigi", description: "Pemeriksaan menyeluruh kondisi gigi dan mulut, termasuk rontgen jika diperlukan, serta rencana perawatan.", price: 100000, duration: 20 },
  ];

  for (const svc of servicesData) {
    const existing = await prisma.service.findFirst({ where: { name: svc.name } });
    if (!existing) {
      await prisma.service.create({ data: svc });
    }
  }
  console.log("Services created");

  // Weekly schedules
  const scheduleData = [
    { dayOfWeek: 1, startTime: "09:00", endTime: "17:00", breakStart: "12:00", breakEnd: "13:00", quota: 10 },
    { dayOfWeek: 2, startTime: "09:00", endTime: "17:00", breakStart: "12:00", breakEnd: "13:00", quota: 10 },
    { dayOfWeek: 3, startTime: "09:00", endTime: "17:00", breakStart: "12:00", breakEnd: "13:00", quota: 10 },
    { dayOfWeek: 4, startTime: "09:00", endTime: "17:00", breakStart: "12:00", breakEnd: "13:00", quota: 10 },
    { dayOfWeek: 5, startTime: "09:00", endTime: "15:00", breakStart: "12:00", breakEnd: "13:00", quota: 8 },
    { dayOfWeek: 6, startTime: "09:00", endTime: "14:00", breakStart: null, breakEnd: null, quota: 6 },
  ];

  for (const sched of scheduleData) {
    const existing = await prisma.schedule.findFirst({ where: { dayOfWeek: sched.dayOfWeek } });
    if (!existing) {
      await prisma.schedule.create({
        data: {
          ...sched,
          doctorId: doctor.id,
        },
      });
    }
  }
  console.log("Schedules created");

  // FAQs
  const faqData = [
    { question: "Berapa biaya konsultasi pertama kali?", answer: "Biaya konsultasi pertama adalah Rp 100.000 yang sudah termasuk pemeriksaan menyeluruh dan rencana perawatan.", sortOrder: 1 },
    { question: "Apakah menerima BPJS?", answer: "Saat ini kami belum menerima BPJS. Namun kami menerima berbagai asuransi swasta. Silakan hubungi kami untuk informasi lebih lanjut.", sortOrder: 2 },
    { question: "Berapa lama waktu perawatan kawat gigi?", answer: "Rata-rata perawatan kawat gigi membutuhkan waktu 1-2 tahun tergantung tingkat keparahan kasus. Kontrol dilakukan setiap 4-6 minggu.", sortOrder: 3 },
    { question: "Apakah cabut gigi sakit?", answer: "Dengan teknik anestesi lokal modern, proses pencabutan gigi tidak terasa sakit. Anda mungkin merasakan tekanan ringan, tetapi tidak ada rasa nyeri.", sortOrder: 4 },
    { question: "Bagaimana cara membuat reservasi?", answer: "Anda dapat membuat reservasi melalui website ini di halaman Reservasi, atau menghubungi kami melalui WhatsApp di nomor yang tertera.", sortOrder: 5 },
    { question: "Apakah bisa walk-in tanpa reservasi?", answer: "Kami mengutamakan pasien yang sudah melakukan reservasi. Walk-in dilayani jika masih tersedia kuota pada hari tersebut.", sortOrder: 6 },
    { question: "Berapa lama waktu pembersihan karang gigi?", answer: "Pembersihan karang gigi biasanya membutuhkan waktu sekitar 30 menit. Disarankan untuk melakukan pembersihan setiap 6 bulan sekali.", sortOrder: 7 },
    { question: "Apakah ada layanan darurat?", answer: "Untuk keadaan darurat gigi, silakan hubungi WhatsApp kami segera. Kami akan berusaha memberikan penanganan secepat mungkin pada jam praktik.", sortOrder: 8 },
  ];

  for (const faq of faqData) {
    const existing = await prisma.faq.findFirst({ where: { question: faq.question } });
    if (!existing) {
      await prisma.faq.create({ data: faq });
    }
  }
  console.log("FAQs created");

  // Testimonials
  const testimonialData = [
    { name: "Rina Wulandari", content: "Pelayanan sangat ramah dan profesional. Gigi saya yang berlubang ditambal dengan sangat rapi. Tidak terasa sakit sama sekali!", rating: 5, isActive: true },
    { name: "Ahmad Fauzi", content: "Dokter Astuti sangat teliti dan sabar menjelaskan kondisi gigi saya. Harga juga terjangkau. Sangat direkomendasikan!", rating: 5, isActive: true },
    { name: "Dewi Kartika", content: "Sudah menjadi langganan sejak 3 tahun lalu. Tempatnya bersih, nyaman, dan hasilnya selalu memuaskan. Terima kasih!", rating: 5, isActive: true },
  ];

  for (const t of testimonialData) {
    const existing = await prisma.testimonial.findFirst({ where: { name: t.name } });
    if (!existing) {
      await prisma.testimonial.create({ data: t });
    }
  }
  console.log("Testimonials created");

  // Settings
  const settingsData: Record<string, string> = {
    clinic_name: "Benteng Dental Care - drg. Astuti",
    clinic_address: "Desa Benteng, Kec. Mandalle, Kab. Pangkep, Sulawesi Selatan",
    clinic_phone: "+6285342236688",
    clinic_whatsapp: "6285342236688",
    clinic_email: "bentengdentalcare@gmail.com",
    google_maps_url: "https://maps.app.goo.gl/fbw482grmLqAH1iP9",
    opening_hours: "Senin - Jumat: 09:00 - 17:00, Sabtu: 09:00 - 14:00",
  };

  for (const [key, value] of Object.entries(settingsData)) {
    await prisma.setting.upsert({
      where: { key },
      update: {},
      create: { key, value },
    });
  }
  console.log("Settings created");

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
