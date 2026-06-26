import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/db/client";
import { users, userRoles } from "@/db/schema";
import { createId } from "@/lib/id";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const existing = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (existing) {
      return NextResponse.json({ alreadyExists: true }, { status: 200 });
    }

    const hashedPassword = await hash(password, 12);
    const userId = createId("usr");
    const displayName = name || email.split("@")[0];

    await db.insert(users).values({
      id: userId,
      name: displayName,
      email,
      password: hashedPassword,
      activeRole: "tourist",
    });

    await db.insert(userRoles).values({
      id: createId("urole"),
      userId,
      role: "tourist",
      status: "active",
    });

    return NextResponse.json({ success: true, userId }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
