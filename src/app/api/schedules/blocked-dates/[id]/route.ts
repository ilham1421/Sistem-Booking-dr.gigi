import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const existing = await prisma.blockedDate.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Tanggal libur tidak ditemukan" }, { status: 404 });
  }

  await prisma.blockedDate.delete({ where: { id } });
  return NextResponse.json({ message: "Tanggal libur dihapus" });
}
