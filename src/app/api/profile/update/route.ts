import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { users } from "@/db/schema";

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, image, bio, city, province } = await req.json();

    const updateData: Record<string, string | null> = {};
    if (name !== undefined) updateData.name = name;
    if (image !== undefined) updateData.image = image || null;
    if (bio !== undefined) updateData.bio = bio || null;
    if (city !== undefined) updateData.city = city || null;
    if (province !== undefined) updateData.province = province || null;

    if (Object.keys(updateData).length > 0) {
      updateData.updatedAt = new Date().toISOString();
      await db.update(users).set(updateData).where(eq(users.id, session.user.id));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
