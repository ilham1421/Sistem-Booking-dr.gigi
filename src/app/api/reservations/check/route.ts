import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const phone = req.nextUrl.searchParams.get("phone");

  if (!phone?.trim()) {
    return NextResponse.json({ error: "Nomor WhatsApp wajib diisi" }, { status: 400 });
  }

  const cleanPhone = phone.trim();

  const patient = await prisma.patient.findFirst({
    where: { phone: cleanPhone },
  });

  if (!patient) {
    return NextResponse.json({ reservations: [] });
  }

  const reservations = await prisma.reservation.findMany({
    where: { patientId: patient.id },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      service: { select: { name: true } },
    },
  });

  return NextResponse.json({
    reservations: reservations.map((r) => ({
      id: r.id,
      service: r.service.name,
      date: r.date,
      time: r.time,
      status: r.status,
      createdAt: r.createdAt,
    })),
  });
}
