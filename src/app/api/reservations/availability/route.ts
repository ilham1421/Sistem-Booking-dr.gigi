import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "Tanggal wajib diisi" }, { status: 400 });
  }

  const selectedDate = new Date(date);
  const dayOfWeek = selectedDate.getDay();

  // Check if the date is blocked
  const blockedDate = await prisma.blockedDate.findFirst({
    where: { date: selectedDate },
  });

  if (blockedDate) {
    return NextResponse.json({
      available: false,
      reason: blockedDate.reason || "Hari libur",
      slots: [],
    });
  }

  // Check if there's a schedule for this day
  const schedule = await prisma.schedule.findFirst({
    where: { dayOfWeek, isActive: true },
  });

  if (!schedule) {
    return NextResponse.json({
      available: false,
      reason: "Tidak ada jadwal praktik di hari ini",
      slots: [],
    });
  }

  // Get existing reservation counts per time slot
  const reservations = await prisma.reservation.groupBy({
    by: ["time"],
    where: {
      date: selectedDate,
      status: { in: ["WAITING", "CONFIRMED"] },
    },
    _count: { id: true },
  });

  const reservationMap: Record<string, number> = {};
  reservations.forEach((r) => {
    reservationMap[r.time] = r._count.id;
  });

  // Build available time slots
  const allSlots = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];
  const slots = allSlots.map((time) => {
    const booked = reservationMap[time] || 0;
    return {
      time,
      available: booked < schedule.quota,
      remaining: Math.max(0, schedule.quota - booked),
    };
  });

  return NextResponse.json({
    available: true,
    reason: null,
    slots,
  });
}
