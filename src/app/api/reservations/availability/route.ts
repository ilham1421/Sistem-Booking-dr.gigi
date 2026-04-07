import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function generateTimeSlots(
  startTime: string,
  endTime: string,
  breakStart: string | null,
  breakEnd: string | null
): string[] {
  const startHour = parseInt(startTime.split(":")[0], 10);
  const endHour = parseInt(endTime.split(":")[0], 10);
  const breakStartHour = breakStart ? parseInt(breakStart.split(":")[0], 10) : null;
  const breakEndHour = breakEnd ? parseInt(breakEnd.split(":")[0], 10) : null;

  const slots: string[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    if (breakStartHour !== null && breakEndHour !== null && hour >= breakStartHour && hour < breakEndHour) {
      continue;
    }
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
  }
  return slots;
}

function getDayOfWeek(dateStr: string): number {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).getDay();
}

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "Tanggal wajib diisi" }, { status: 400 });
  }

  try {
    const selectedDate = new Date(date + "T00:00:00.000Z");
    const dayOfWeek = getDayOfWeek(date);

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
    const reservations = await prisma.reservation.findMany({
      where: {
        date: selectedDate,
        status: { in: ["WAITING", "CONFIRMED"] },
      },
      select: { time: true },
    });

    const reservationMap: Record<string, number> = {};
    reservations.forEach((r) => {
      reservationMap[r.time] = (reservationMap[r.time] || 0) + 1;
    });

    // Build available time slots from schedule
    const allSlots = generateTimeSlots(
      schedule.startTime,
      schedule.endTime,
      schedule.breakStart,
      schedule.breakEnd
    );

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
  } catch (error) {
    console.error("Availability check error:", error);
    return NextResponse.json(
      { available: false, reason: "Terjadi kesalahan server", slots: [] },
      { status: 500 }
    );
  }
}
