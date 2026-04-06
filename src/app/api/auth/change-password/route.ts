import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, verifyPassword, hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { currentPassword, newPassword } = body;

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Password saat ini dan password baru wajib diisi" }, { status: 400 });
  }

  if (newPassword.length < 6) {
    return NextResponse.json({ error: "Password baru minimal 6 karakter" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
  });

  if (!user) {
    return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
  }

  const isValid = await verifyPassword(currentPassword, user.password);
  if (!isValid) {
    return NextResponse.json({ error: "Password saat ini salah" }, { status: 400 });
  }

  const hashedPassword = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: session.id },
    data: { password: hashedPassword },
  });

  return NextResponse.json({ message: "Password berhasil diubah" });
}
