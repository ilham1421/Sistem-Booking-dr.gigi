import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const schedules = await prisma.schedule.findMany({
    orderBy: { dayOfWeek: "asc" },
  });
  return NextResponse.json(schedules);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { dayOfWeek, startTime, endTime, breakStart, breakEnd, quota, isActive, doctorId } = body;

  const existing = await prisma.schedule.findFirst({
    where: { dayOfWeek: Number(dayOfWeek) },
  });

  if (existing) {
    return NextResponse.json({ error: "Jadwal untuk hari ini sudah ada" }, { status: 400 });
  }

  // Find default doctor if not provided
  let resolvedDoctorId = doctorId;
  if (!resolvedDoctorId) {
    const doctor = await prisma.doctor.findFirst();
    if (!doctor) {
      return NextResponse.json({ error: "Belum ada dokter terdaftar" }, { status: 400 });
    }
    resolvedDoctorId = doctor.id;
  }

  const schedule = await prisma.schedule.create({
    data: {
      doctorId: resolvedDoctorId,
      dayOfWeek: Number(dayOfWeek),
      startTime,
      endTime,
      breakStart: breakStart || null,
      breakEnd: breakEnd || null,
      quota: Number(quota || 5),
      isActive: isActive ?? true,
    },
  });

  return NextResponse.json(schedule, { status: 201 });
}
