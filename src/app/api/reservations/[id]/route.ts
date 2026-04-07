import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: {
      patient: true,
      service: true,
      logs: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!reservation) {
    return NextResponse.json({ error: "Reservasi tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json(reservation);
}

export async function PUT(req: NextRequest, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await req.json();
  const { status, adminNotes, date, time } = body;

  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: { patient: true, service: true },
  });

  if (!reservation) {
    return NextResponse.json({ error: "Reservasi tidak ditemukan" }, { status: 404 });
  }

  const updateData: Record<string, unknown> = {};
  const logEntries: { action: string; description: string; performedBy: string }[] = [];

  if (adminNotes !== undefined) {
    updateData.adminNotes = adminNotes;
  }

  if (status && status !== reservation.status) {
    const validTransitions: Record<string, string[]> = {
      WAITING: ["CONFIRMED", "CANCELLED"],
      CONFIRMED: ["COMPLETED", "RESCHEDULED", "NO_SHOW", "CANCELLED"],
      RESCHEDULED: ["CONFIRMED", "CANCELLED"],
    };

    const allowed = validTransitions[reservation.status];
    if (!allowed || !allowed.includes(status)) {
      return NextResponse.json(
        { error: `Tidak dapat mengubah status dari ${reservation.status} ke ${status}` },
        { status: 400 }
      );
    }

    updateData.status = status;
    logEntries.push({
      action: `STATUS_${status}`,
      description: `Status diubah dari ${reservation.status} ke ${status}`,
      performedBy: session.name,
    });

    if (status === "RESCHEDULED" && date && time) {
      updateData.date = new Date(date);
      updateData.time = time;
      logEntries.push({
        action: "RESCHEDULED",
        description: `Dijadwalkan ulang ke ${date} pukul ${time}`,
        performedBy: session.name,
      });
    }
  }

  const updated = await prisma.reservation.update({
    where: { id },
    data: {
      ...updateData,
      logs: logEntries.length > 0 ? {
        create: logEntries.map((log) => log),
      } : undefined,
    },
    include: { patient: true, service: true, logs: true },
  });

  return NextResponse.json(updated);
}
