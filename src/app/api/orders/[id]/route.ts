import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const { id } = await params;
  const { status } = await req.json();
  const updated = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
  return NextResponse.json(updated[0]);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const { id } = await params;
  await db.delete(orders).where(eq(orders.id, id));
  return NextResponse.json({ success: true });
}
