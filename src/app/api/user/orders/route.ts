import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { desc, sql, eq, and } from "drizzle-orm";

const SECRET = process.env.NEXTAUTH_SECRET || "clothhaus-secret-key-change-in-production";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: SECRET });
  if (!token?.email) {
    return NextResponse.json({ error: "Login karein" }, { status: 401 });
  }

  const userOrders = await db
    .select()
    .from(orders)
    .where(sql`${orders.customer}->>'email' = ${token.email}`)
    .orderBy(desc(orders.createdAt));

  return NextResponse.json(userOrders);
}

export async function DELETE(req: NextRequest) {
  const token = await getToken({ req, secret: SECRET });
  if (!token?.email) {
    return NextResponse.json({ error: "Login karein" }, { status: 401 });
  }

  const { id } = await req.json();

  // Only delete if this order belongs to the logged-in user
  await db.delete(orders).where(
    and(
      eq(orders.id, id),
      sql`${orders.customer}->>'email' = ${token.email}`
    )
  );

  return NextResponse.json({ success: true });
}
