import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { date, reason } = body;

  if (!date) {
    return NextResponse.json({ error: "Tanggal wajib diisi" }, { status: 400 });
  }

  const blocked = await prisma.blockedDate.create({
    data: {
      date: new Date(date),
      reason: reason || null,
    },
  });

  return NextResponse.json(blocked, { status: 201 });
}
