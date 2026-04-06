import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, patientType, serviceId, date, time, complaint, notes } = body;

    // Validate required fields
    if (!name?.trim() || !phone?.trim() || !patientType || !serviceId || !date || !time || !complaint?.trim()) {
      return NextResponse.json({ error: "Semua field wajib harus diisi" }, { status: 400 });
    }

    // Validate phone format
    if (!/^[0-9+\-\s()]+$/.test(phone)) {
      return NextResponse.json({ error: "Format nomor telepon tidak valid" }, { status: 400 });
    }

    // Validate date not in past
    const reservationDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (reservationDate < today) {
      return NextResponse.json({ error: "Tanggal reservasi tidak boleh di masa lalu" }, { status: 400 });
    }

    // Validate service exists
    const serviceRecord = await prisma.service.findUnique({
      where: { id: serviceId, isActive: true },
    });
    if (!serviceRecord) {
      return NextResponse.json({ error: "Layanan tidak ditemukan" }, { status: 400 });
    }

    // Check for blocked dates
    const blockedDate = await prisma.blockedDate.findFirst({
      where: { date: reservationDate },
    });
    if (blockedDate) {
      return NextResponse.json(
        { error: `Tanggal ${date} tidak tersedia: ${blockedDate.reason || "Hari libur"}` },
        { status: 400 }
      );
    }

    // Check schedule exists for the day
    const dayOfWeek = reservationDate.getDay();
    const schedule = await prisma.schedule.findFirst({
      where: { dayOfWeek, isActive: true },
    });

    if (!schedule) {
      return NextResponse.json({ error: "Tidak ada jadwal praktik di hari tersebut" }, { status: 400 });
    }

    // Use transaction to prevent race condition on quota
    const reservation = await prisma.$transaction(async (tx) => {
      const existingReservations = await tx.reservation.count({
        where: {
          date: reservationDate,
          time,
          status: { in: ["WAITING", "CONFIRMED"] },
        },
      });

      if (existingReservations >= schedule.quota) {
        throw new Error("SLOT_FULL");
      }

      // Find or create patient
      let patient = await tx.patient.findFirst({
        where: { phone: phone.trim() },
      });

      if (!patient) {
        patient = await tx.patient.create({
          data: {
            name: name.trim(),
            phone: phone.trim(),
            email: email?.trim() || null,
            patientType: patientType === "EXISTING" ? "EXISTING" : "NEW",
          },
        });
      } else {
        await tx.patient.update({
          where: { id: patient.id },
          data: {
            name: name.trim(),
            email: email?.trim() || patient.email,
          },
        });
      }

      // Create reservation
      const newReservation = await tx.reservation.create({
        data: {
          patientId: patient.id,
          serviceId: serviceRecord.id,
          date: reservationDate,
          time,
          complaint: complaint.trim(),
          notes: notes?.trim() || null,
          status: "WAITING",
        },
      });

      // Create log entry
      await tx.reservationLog.create({
        data: {
          reservationId: newReservation.id,
          action: "CREATED",
          description: "Reservasi dibuat oleh pasien melalui website",
        },
      });

      return newReservation;
    });

    return NextResponse.json(
      { message: "Reservasi berhasil dibuat", id: reservation.id },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "SLOT_FULL") {
      return NextResponse.json(
        { error: "Slot waktu tersebut sudah penuh. Silakan pilih waktu lain." },
        { status: 400 }
      );
    }
    console.error("Reservation error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
