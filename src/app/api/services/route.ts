import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { revalidateTag } from "next/cache";

export async function GET() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(services);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, description, price, duration, isActive } = body;

  if (!name || price === undefined || !duration) {
    return NextResponse.json({ error: "Nama, harga, dan durasi wajib diisi" }, { status: 400 });
  }

  const service = await prisma.service.create({
    data: {
      name,
      description: description || null,
      price: Number(price),
      duration: Number(duration),
      isActive: isActive ?? true,
    },
  });

  revalidateTag("services", "default");
  return NextResponse.json(service, { status: 201 });
}
