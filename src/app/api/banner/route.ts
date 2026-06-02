import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { db } from "@/db";
import { saleBanner } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const rows = await db.select().from(saleBanner).where(eq(saleBanner.id, "main"));
  return NextResponse.json(rows[0] ?? null);
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { text, active, bgColor } = await req.json();

  const existing = await db.select().from(saleBanner).where(eq(saleBanner.id, "main"));

  if (existing.length > 0) {
    await db.update(saleBanner).set({ text, active, bgColor }).where(eq(saleBanner.id, "main"));
  } else {
    await db.insert(saleBanner).values({ id: "main", text, active, bgColor });
  }

  return NextResponse.json({ success: true });
}
