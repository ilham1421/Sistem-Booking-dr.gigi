import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, context: RouteContext) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await req.json();

  const existing = await prisma.schedule.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Jadwal tidak ditemukan" }, { status: 404 });
  }

  const schedule = await prisma.schedule.update({
    where: { id },
    data: {
      dayOfWeek: Number(body.dayOfWeek),
      startTime: body.startTime,
      endTime: body.endTime,
      breakStart: body.breakStart || null,
      breakEnd: body.breakEnd || null,
      quota: Number(body.quota || 5),
      isActive: body.isActive,
    },
  });

  return NextResponse.json(schedule);
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const existing = await prisma.schedule.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Jadwal tidak ditemukan" }, { status: 404 });
  }

  await prisma.schedule.delete({ where: { id } });
  return NextResponse.json({ message: "Jadwal dihapus" });
}
