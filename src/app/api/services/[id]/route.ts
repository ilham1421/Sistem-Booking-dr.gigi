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
  const { name, description, price, duration, isActive } = body;

  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Layanan tidak ditemukan" }, { status: 404 });
  }

  const service = await prisma.service.update({
    where: { id },
    data: {
      name,
      description: description || null,
      price: Number(price),
      duration: Number(duration),
      isActive,
    },
  });

  return NextResponse.json(service);
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const reservationCount = await prisma.reservation.count({
    where: { serviceId: id },
  });

  if (reservationCount > 0) {
    // Soft delete: deactivate instead
    await prisma.service.update({
      where: { id },
      data: { isActive: false },
    });
    return NextResponse.json({ message: "Layanan dinonaktifkan karena memiliki reservasi terkait" });
  }

  await prisma.service.delete({ where: { id } });
  return NextResponse.json({ message: "Layanan dihapus" });
}
