import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, phone, password } = await req.json();

  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json({ error: "Tamam fields bharna zaroori hain" }, { status: 400 });
  }

  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing.length > 0) {
    return NextResponse.json({ error: "Yeh email pehle se registered hai" }, { status: 409 });
  }

  const passwordHash = await hash(password, 12);

  await db.insert(users).values({
    id: `USR-${Date.now()}`,
    firstName,
    lastName,
    email,
    phone: phone || null,
    passwordHash,
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
